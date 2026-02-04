import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { OnboardingAnswers } from "@/types/onboarding";

const INITIAL_ANSWERS: OnboardingAnswers = {
  frequency_impact: null,
  main_triggers: [],
  main_triggers_other: null,
  high_risk_times: [],
  previous_attempts: [],
  previous_attempts_other: null,
  primary_goal: null,
  consent_privacy: null,
};

export function useOnboarding(userId: string | undefined) {
  const [answers, setAnswers] = useState<OnboardingAnswers>(INITIAL_ANSWERS);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const updateAnswer = useCallback(
    (key: keyof OnboardingAnswers, value: string | string[], otherText?: string) => {
      setAnswers((prev) => {
        const updates: Partial<OnboardingAnswers> = {
          [key]: value,
        };

        // Handle "other" text fields
        if (otherText !== undefined) {
          if (key === "main_triggers") {
            updates.main_triggers_other = otherText;
          } else if (key === "previous_attempts") {
            updates.previous_attempts_other = otherText;
          }
        }

        return { ...prev, ...updates };
      });
    },
    []
  );

  const nextQuestion = useCallback(() => {
    setCurrentQuestionIndex((prev) => prev + 1);
  }, []);

  const previousQuestion = useCallback(() => {
    setCurrentQuestionIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const saveAnswers = useCallback(async () => {
    if (!userId) return { error: new Error("User not authenticated") };

    setIsSaving(true);
    try {
      // Ensure profile exists before saving answers
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", userId)
        .single();

      if (!profile) {
        // Create profile if it doesn't exist (fallback for users who missed the trigger)
        const { error: createProfileError } = await supabase
          .from("profiles")
          .insert({ id: userId, user_id: userId });

        if (createProfileError) {
           console.error("Failed to create missing profile:", createProfileError);
           // We try to proceed anyway, but it might fail due to FK constraint
        }
      }

      // Prepare single row for Wide table structure
      const row = {
        user_id: userId,
        frequency_impact: answers.frequency_impact,
        main_triggers: answers.main_triggers,
        main_triggers_other: answers.main_triggers_other,
        high_risk_times: answers.high_risk_times,
        previous_attempts: answers.previous_attempts,
        previous_attempts_other: answers.previous_attempts_other,
        primary_goal: answers.primary_goal,
        consent_privacy: answers.consent_privacy,
        updated_at: new Date().toISOString(),
      };

      // Upsert onboarding answers
      const { error: answersError } = await supabase
        .from("onboarding_answers")
        .upsert(row, { onConflict: "user_id" });

      if (answersError) throw answersError;

      // Update profile to mark onboarding as completed
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ onboarding_completed: true })
        .eq("id", userId);

      if (profileError) {
        console.warn("Could not update profile onboarding status", profileError);
        // Don't throw here, as answering is more important than the flag
      }

      setIsCompleted(true);
      return { error: null };
    } catch (error) {
      return { error };
    } finally {
      setIsSaving(false);
    }
  }, [userId, answers]);

  const loadExistingAnswers = useCallback(async () => {
    if (!userId) return;

    const { data, error } = await supabase
      .from("onboarding_answers")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Error loading onboarding answers:", error);
      return;
    }

    if (data) {
      setAnswers({
        frequency_impact: data.frequency_impact || "",
        main_triggers: data.main_triggers || [],
        main_triggers_other: data.main_triggers_other || "",
        high_risk_times: data.high_risk_times || [],
        previous_attempts: data.previous_attempts || [],
        previous_attempts_other: data.previous_attempts_other || "",
        primary_goal: data.primary_goal || "",
        consent_privacy: data.consent_privacy || "",
      });
    }
  }, [userId]);

  return {
    answers,
    currentQuestionIndex,
    isCompleted,
    isSaving,
    updateAnswer,
    nextQuestion,
    previousQuestion,
    saveAnswers,
    loadExistingAnswers,
    setIsCompleted,
  };
}
