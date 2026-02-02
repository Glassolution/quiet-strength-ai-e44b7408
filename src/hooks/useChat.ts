import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Message } from "@/components/chat/ChatMessage";
import type { OnboardingAnswers } from "@/types/onboarding";

const WELCOME_MESSAGE = `Olá! 👋 Sou seu assistente pessoal e estou aqui para te ajudar, sem julgamentos.

Sei que dar esse primeiro passo não é fácil, e admiro sua coragem. Estou aqui para te ouvir, apoiar e ajudar a construir hábitos mais saudáveis.

Como você está se sentindo hoje?`;

export function useChat(
  userId: string | undefined,
  onboardingAnswers: OnboardingAnswers | null,
  onMessageSent?: () => void
) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load existing messages or create welcome message
  useEffect(() => {
    if (!userId) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: WELCOME_MESSAGE,
          timestamp: new Date(),
        },
      ]);
      return;
    }

    const loadMessages = async () => {
      const { data } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: true });

      if (data && data.length > 0) {
        setMessages(
          data.map((msg) => ({
            id: msg.id,
            role: msg.role as "user" | "assistant",
            content: msg.content,
            timestamp: new Date(msg.created_at),
          }))
        );
      } else {
        // Insert welcome message
        const { data: newMsg } = await supabase
          .from("chat_messages")
          .insert({
            user_id: userId,
            role: "assistant",
            content: WELCOME_MESSAGE,
          })
          .select()
          .single();

        if (newMsg) {
          setMessages([
            {
              id: newMsg.id,
              role: "assistant",
              content: WELCOME_MESSAGE,
              timestamp: new Date(newMsg.created_at),
            },
          ]);
        }
      }
    };

    loadMessages();
  }, [userId]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!userId) return;

      setError(null);

      // Add user message immediately
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsTyping(true);

      // Save user message to database
      await supabase.from("chat_messages").insert({
        user_id: userId,
        role: "user",
        content,
      });

      // Call onMessageSent callback (for incrementing message count)
      onMessageSent?.();

      try {
        // Get auth session for the request
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          throw new Error("Not authenticated");
        }

        // Prepare messages for API (last 20 messages for context)
        const apiMessages = [...messages, userMessage].slice(-20).map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({
              messages: apiMessages,
              onboardingContext: onboardingAnswers,
            }),
          }
        );

        if (!response.ok) {
          if (response.status === 429) {
            throw new Error("Muitas requisições. Tente novamente em alguns segundos.");
          }
          if (response.status === 402) {
            throw new Error("Limite de uso atingido.");
          }
          throw new Error("Erro ao conectar com a IA");
        }

        if (!response.body) {
          throw new Error("No response body");
        }

        // Stream the response
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let assistantContent = "";
        let textBuffer = "";

        const updateAssistantMessage = (content: string) => {
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last?.role === "assistant" && last.id.startsWith("ai-streaming")) {
              return prev.map((m, i) =>
                i === prev.length - 1 ? { ...m, content } : m
              );
            }
            return [
              ...prev,
              {
                id: "ai-streaming",
                role: "assistant" as const,
                content,
                timestamp: new Date(),
              },
            ];
          });
        };

        let streamDone = false;
        while (!streamDone) {
          const { done, value } = await reader.read();
          if (done) break;

          textBuffer += decoder.decode(value, { stream: true });

          let newlineIndex: number;
          while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
            let line = textBuffer.slice(0, newlineIndex);
            textBuffer = textBuffer.slice(newlineIndex + 1);

            if (line.endsWith("\r")) line = line.slice(0, -1);
            if (line.startsWith(":") || line.trim() === "") continue;
            if (!line.startsWith("data: ")) continue;

            const jsonStr = line.slice(6).trim();
            if (jsonStr === "[DONE]") {
              streamDone = true;
              break;
            }

            try {
              const parsed = JSON.parse(jsonStr);
              const delta = parsed.choices?.[0]?.delta?.content;
              if (delta) {
                assistantContent += delta;
                updateAssistantMessage(assistantContent);
              }
            } catch {
              textBuffer = line + "\n" + textBuffer;
              break;
            }
          }
        }

        // Save final assistant message to database
        const { data: savedMsg } = await supabase
          .from("chat_messages")
          .insert({
            user_id: userId,
            role: "assistant",
            content: assistantContent,
          })
          .select()
          .single();

        // Update message with final ID
        if (savedMsg) {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === "ai-streaming"
                ? { ...m, id: savedMsg.id }
                : m
            )
          );
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
        // Remove the streaming message if there was an error
        setMessages((prev) => prev.filter((m) => m.id !== "ai-streaming"));
      } finally {
        setIsTyping(false);
      }
    },
    [userId, messages, onboardingAnswers, onMessageSent]
  );

  return {
    messages,
    isTyping,
    error,
    sendMessage,
  };
}
