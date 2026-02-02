import { Button } from "@/components/ui/button";
import { Logo } from "@/components/icons/Logo";
import type { OnboardingAnswers } from "@/types/onboarding";

interface OnboardingSummaryProps {
  answers: OnboardingAnswers;
  onContinue: () => void;
}

export function OnboardingSummary({ answers, onContinue }: OnboardingSummaryProps) {
  const formatArray = (arr: string[] | null | undefined) => {
    if (!arr || arr.length === 0) return "não informado";
    return arr.join(", ");
  };

  return (
    <div className="flex gap-3 slide-up">
      <div className="flex-shrink-0 mt-1">
        <Logo size="sm" />
      </div>
      <div className="bg-card border border-border/50 rounded-2xl rounded-bl-md px-4 py-4 shadow-soft max-w-[85%]">
        <h3 className="font-semibold text-base mb-3">
          📋 Resumo rápido do que entendi:
        </h3>
        <ul className="space-y-2 text-sm text-muted-foreground mb-4">
          <li>
            <span className="font-medium text-foreground">Frequência/impacto:</span>{" "}
            {answers.frequency_impact || "não informado"}
          </li>
          <li>
            <span className="font-medium text-foreground">Gatilhos principais:</span>{" "}
            {formatArray(answers.main_triggers)}
            {answers.main_triggers_other && ` (${answers.main_triggers_other})`}
          </li>
          <li>
            <span className="font-medium text-foreground">Horários de risco:</span>{" "}
            {formatArray(answers.high_risk_times)}
          </li>
          <li>
            <span className="font-medium text-foreground">O que você já tentou:</span>{" "}
            {formatArray(answers.previous_attempts)}
            {answers.previous_attempts_other && ` (${answers.previous_attempts_other})`}
          </li>
          <li>
            <span className="font-medium text-foreground">Objetivo agora:</span>{" "}
            {answers.primary_goal || "não informado"}
          </li>
        </ul>
        <p className="text-sm leading-relaxed mb-4">
          Vou te guiar com passos bem práticos (sem julgamento) — começando por uma
          estratégia para os seus gatilhos e um plano de 24 horas.
        </p>
        <Button onClick={onContinue} className="w-full">
          Continuar para o chat
        </Button>
      </div>
    </div>
  );
}
