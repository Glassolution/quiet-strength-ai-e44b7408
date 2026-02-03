import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const FREE_MESSAGES_PER_DAY = 3;

interface ChatSession {
  id: string;
  user_id: string;
  mode: "free_limited" | "premium";
  messages_used_today: number;
  session_date: string;
}

export function useChatSession(userId: string | undefined, isPremium: boolean) {
  const [session, setSession] = useState<ChatSession | null>(null);
  const [loading, setLoading] = useState(true);

  const messagesRemaining = isPremium
    ? Infinity
    : Math.max(0, FREE_MESSAGES_PER_DAY - (session?.messages_used_today || 0));

  // Allow sending if user has messages remaining OR if they are at the limit (to trigger the blurred response)
  const canSendMessage = isPremium || (session?.messages_used_today || 0) <= FREE_MESSAGES_PER_DAY;

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const loadOrCreateSession = async () => {
      const today = new Date().toISOString().split("T")[0];

      // Try to find existing session for today
      const { data: existingSession } = await supabase
        .from("chat_sessions")
        .select("*")
        .eq("user_id", userId)
        .eq("session_date", today)
        .single();

      if (existingSession) {
        setSession(existingSession as ChatSession);
      } else {
        // Create new session for today
        const { data: newSession } = await supabase
          .from("chat_sessions")
          .insert({
            user_id: userId,
            mode: isPremium ? "premium" : "free_limited",
            session_date: today,
          })
          .select()
          .single();

        if (newSession) {
          setSession(newSession as ChatSession);
        }
      }

      setLoading(false);
    };

    loadOrCreateSession();
  }, [userId, isPremium]);

  const incrementMessageCount = useCallback(async () => {
    if (!session || isPremium) return;

    const newCount = session.messages_used_today + 1;

    const { data } = await supabase
      .from("chat_sessions")
      .update({
        messages_used_today: newCount,
        last_message_at: new Date().toISOString(),
      })
      .eq("id", session.id)
      .select()
      .single();

    if (data) {
      setSession(data as ChatSession);
    }
  }, [session, isPremium]);

  return {
    session,
    loading,
    messagesRemaining: isPremium ? undefined : messagesRemaining,
    canSendMessage,
    incrementMessageCount,
  };
}
