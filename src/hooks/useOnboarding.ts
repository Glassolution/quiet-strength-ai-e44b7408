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
          .insert({ id: userId, email: (await supabase.auth.getUser()).data.user?.email });

        if (createProfileError) {
           console.error("Failed to create missing profile:", createProfileError);
           // We try to proceed anyway, but it might fail due to FK constraint
        }
      }

try {
      // Ensure profile exists before saving answers to avoid foreign key constraint errors
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", userId)
        .single();

      if (!profile) {
        // If profile doesn't exist (race condition with trigger), try to create it
        const { error: createProfileError } = await supabase
          .from("profiles")
          .insert({ id: userId, email: (await supabase.auth.getUser()).data.user?.email })
          .select()
          .single();
          
        if (createProfileError) {
           console.warn("Could not ensure profile exists:", createProfileError);
           // We continue anyway, hoping the trigger caught up or it's a permission issue we can't fix here
        }
      }

      // Prepare rows for EAV table structure
      const rows = [];
      const timestamp = new Date().toISOString();

      if (answers.frequency_impact) {
        rows.push({
          user_id: userId,
          question_key: "frequency_impact",
          answer: answers.frequency_impact,
          updated_at: timestamp,
        });
      }

      if (answers.main_triggers && answers.main_triggers.length > 0) {
        rows.push({
          user_id: userId,
          question_key: "main_triggers",
          answer_array: answers.main_triggers,
          other_text: answers.main_triggers_other,
          updated_at: timestamp,
        });
      }

      if (answers.high_risk_times && answers.high_risk_times.length > 0) {
        rows.push({
          user_id: userId,
          question_key: "high_risk_times",
          answer_array: answers.high_risk_times,
          updated_at: timestamp,
        });
      }

      if (answers.previous_attempts && answers.previous_attempts.length > 0) {
        rows.push({
          user_id: userId,
          question_key: "previous_attempts",
          answer_array: answers.previous_attempts,
          other_text: answers.previous_attempts_other,
          updated_at: timestamp,
        });
      }

      if (answers.primary_goal) {
        rows.push({
          user_id: userId,
          question_key: "primary_goal",
          answer: answers.primary_goal,
          updated_at: timestamp,
        });
      }

      if (answers.consent_privacy) {
        rows.push({
          user_id: userId,
          question_key: "consent_privacy",
          answer: answers.consent_privacy,
          updated_at: timestamp,
        });
      }

      // Upsert onboarding answers
      if (rows.length > 0) {
        const { error: answersError } = await supabase
          .from("onboarding_answers")
          .upsert(rows, { onConflict: "user_id,question_key" });

        if (answersError) throw answersError;
      }

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

    const { data } = await supabase
      .from("onboarding_answers")
      .select("*")
      .eq("user_id", userId);

    if (data && data.length > 0) {
      const newAnswers = { ...INITIAL_ANSWERS };
      
      data.forEach((row) => {
        switch (row.question_key) {
          case "frequency_impact":
            newAnswers.frequency_impact = row.answer;
            break;
          case "main_triggers":
            newAnswers.main_triggers = row.answer_array || [];
            newAnswers.main_triggers_other = row.other_text;
            break;
          case "high_risk_times":
            newAnswers.high_risk_times = row.answer_array || [];
            break;
          case "previous_attempts":
            newAnswers.previous_attempts = row.answer_array || [];
            newAnswers.previous_attempts_other = row.other_text;
            break;
          case "primary_goal":
            newAnswers.primary_goal = row.answer;
            break;
          case "consent_privacy":
            newAnswers.consent_privacy = row.answer;
            break;
        }
      });
      
      setAnswers(newAnswers);
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
