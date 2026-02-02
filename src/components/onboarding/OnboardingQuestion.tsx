import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { OnboardingQuestion as QuestionType } from "@/types/onboarding";

interface OnboardingQuestionProps {
  question: QuestionType;
  onAnswer: (answer: string | string[], otherText?: string) => void;
  onSkip: () => void;
  onBack?: () => void;
  isFirst: boolean;
}

export function OnboardingQuestion({
  question,
  onAnswer,
  onSkip,
  onBack,
  isFirst,
}: OnboardingQuestionProps) {
  const [selectedSingle, setSelectedSingle] = useState<string>("");
  const [selectedMulti, setSelectedMulti] = useState<string[]>([]);
  const [otherText, setOtherText] = useState("");

  const isSingleChoice = question.inputType === "single_choice";
  const hasOtherSelected = question.hasOtherText && (
    isSingleChoice ? selectedSingle === "Outro" : selectedMulti.includes("Outro")
  );

  const handleContinue = () => {
    if (isSingleChoice) {
      onAnswer(selectedSingle, hasOtherSelected ? otherText : undefined);
    } else {
      onAnswer(selectedMulti, hasOtherSelected ? otherText : undefined);
    }
  };

  const canContinue = isSingleChoice 
    ? selectedSingle !== "" && (!hasOtherSelected || otherText.trim() !== "")
    : selectedMulti.length > 0 && (!hasOtherSelected || otherText.trim() !== "");

  const handleMultiToggle = (option: string) => {
    setSelectedMulti((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option]
    );
  };

  return (
    <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-soft slide-up">
      <p className="text-base font-medium mb-4">{question.question}</p>

      {isSingleChoice ? (
        <RadioGroup
          value={selectedSingle}
          onValueChange={setSelectedSingle}
          className="space-y-2"
        >
          {question.options.map((option) => (
            <div
              key={option}
              className={cn(
                "flex items-center space-x-3 p-3 rounded-xl border transition-all cursor-pointer",
                selectedSingle === option
                  ? "border-primary bg-primary/5"
                  : "border-border/50 hover:border-primary/30"
              )}
              onClick={() => setSelectedSingle(option)}
            >
              <RadioGroupItem value={option} id={option} />
              <Label htmlFor={option} className="cursor-pointer flex-1">
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      ) : (
        <div className="space-y-2">
          {question.options.map((option) => (
            <div
              key={option}
              className={cn(
                "flex items-center space-x-3 p-3 rounded-xl border transition-all cursor-pointer",
                selectedMulti.includes(option)
                  ? "border-primary bg-primary/5"
                  : "border-border/50 hover:border-primary/30"
              )}
              onClick={() => handleMultiToggle(option)}
            >
              <Checkbox
                checked={selectedMulti.includes(option)}
                onCheckedChange={() => handleMultiToggle(option)}
                id={option}
              />
              <Label htmlFor={option} className="cursor-pointer flex-1">
                {option}
              </Label>
            </div>
          ))}
        </div>
      )}

      {hasOtherSelected && (
        <div className="mt-3 slide-up">
          <Input
            placeholder="Especifique..."
            value={otherText}
            onChange={(e) => setOtherText(e.target.value)}
            className="rounded-xl"
          />
        </div>
      )}

      <div className="flex gap-2 mt-5">
        {!isFirst && onBack && (
          <Button variant="outline" onClick={onBack} className="flex-1">
            Voltar
          </Button>
        )}
        <Button variant="ghost" onClick={onSkip} className="flex-1">
          Pular
        </Button>
        <Button
          onClick={handleContinue}
          disabled={!canContinue}
          className="flex-1"
        >
          Continuar
        </Button>
      </div>
    </div>
  );
}
