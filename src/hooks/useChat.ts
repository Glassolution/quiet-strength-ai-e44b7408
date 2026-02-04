import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Message } from "@/components/chat/ChatMessage";
import type { OnboardingAnswers } from "@/types/onboarding";

const WELCOME_MESSAGE = `Olá! 👋 Percebi que você chegou até aqui buscando algo. Talvez um alívio, uma resposta ou apenas alguém para ouvir.

O que você sente que precisa mudar hoje para ficar um pouco melhor?`;

export function useChat(
  userId: string | undefined,
  onboardingAnswers: OnboardingAnswers | null,
  onMessageSent?: () => void,
  isLastFreeMessage?: boolean,
  sessionId?: string
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
      } else if (sessionId) {
        // Insert welcome message
        const { data: newMsg } = await supabase
          .from("chat_messages")
          .insert({
            user_id: userId,
            role: "assistant",
            content: WELCOME_MESSAGE,
            session_id: sessionId
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
  }, [userId, sessionId]);

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
      const { error: msgError } = await supabase.from("chat_messages").insert({
        user_id: userId,
        role: "user",
        content,
        session_id: sessionId
      });

      if (msgError) {
        console.error("Error saving chat message:", msgError);
      }

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [
              ...messages.map((m) => ({ role: m.role, content: m.content })),
              { role: "user", content },
            ],
            onboardingContext: onboardingAnswers
              ? {
                  frequency_impact: onboardingAnswers["frequency_impact"],
                  main_triggers: onboardingAnswers["main_triggers"],
                  high_risk_times: onboardingAnswers["high_risk_times"],
                  previous_attempts: onboardingAnswers["previous_attempts"],
                  primary_goal: onboardingAnswers["primary_goal"],
                }
              : null,
            isLastFreeMessage,
          }),
        });

        if (!response.ok) {
          const rawText = await response.text();
          console.error("AI Error Response:", rawText);
          try {
            const errorData = JSON.parse(rawText);
            throw new Error(errorData.error || `Erro ${response.status}: ${rawText}`);
          } catch (e) {
            // If on localhost and 404/500, hint about proxy
            if (window.location.hostname === "localhost" && (response.status === 404 || response.status === 500)) {
               console.warn("Proxy configuration might be incorrect or Vercel project not found.");
            }
            throw new Error(`Erro ${response.status}: ${rawText}`);
          }
        }
        if (!response.body) throw new Error("Resposta vazia da IA");

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let aiResponse = "";
        
        // Create placeholder for AI message
        const aiMessageId = `ai-${Date.now()}`;
        setMessages((prev) => [
          ...prev,
          {
            id: aiMessageId,
            role: "assistant",
            content: "",
            timestamp: new Date(),
          },
        ]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");
          
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.choices?.[0]?.delta?.content) {
                  aiResponse += data.choices[0].delta.content;
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === aiMessageId
                        ? { ...msg, content: aiResponse }
                        : msg
                    )
                  );
                }
              } catch (e) {
                console.error("Error parsing stream:", e);
              }
            }
          }
        }

        // Save AI message to database
        await supabase.from("chat_messages").insert({
          user_id: userId,
          role: "assistant",
          content: aiResponse,
        });

        if (onMessageSent) {
          onMessageSent();
        }
      } catch (err) {
        console.error("Chat error:", err);
        setError(err instanceof Error ? err.message : "Não foi possível conectar com a IA. Tente novamente.");
        setIsTyping(false);
      } finally {
        setIsTyping(false);
      }
    },
    [userId, messages, onboardingAnswers, onMessageSent, isLastFreeMessage]
  );

  return {
    messages,
    isTyping,
    error,
    sendMessage,
  };
}

