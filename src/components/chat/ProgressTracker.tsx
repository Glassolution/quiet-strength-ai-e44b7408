import { useState } from "react";
import { Flame, Trophy, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressTrackerProps {
  daysFree: number;
  className?: string;
}

export function ProgressTracker({ daysFree, className }: ProgressTrackerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const milestones = [
    { days: 1, label: "1 dia", achieved: daysFree >= 1 },
    { days: 7, label: "1 semana", achieved: daysFree >= 7 },
    { days: 14, label: "2 semanas", achieved: daysFree >= 14 },
    { days: 30, label: "1 mês", achieved: daysFree >= 30 },
    { days: 90, label: "3 meses", achieved: daysFree >= 90 },
  ];

  const nextMilestone = milestones.find((m) => !m.achieved) || milestones[milestones.length - 1];
  const progress = nextMilestone
    ? Math.min((daysFree / nextMilestone.days) * 100, 100)
    : 100;

  return (
    <div className={cn("bg-card border border-border/50 rounded-2xl shadow-soft", className)}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
            <Flame className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Seu progresso</p>
            <p className="font-semibold text-lg">
              {daysFree} {daysFree === 1 ? "dia" : "dias"} livre
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 fade-in">
          {/* Progress bar */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Próxima conquista</span>
              <span className="font-medium">{nextMilestone.label}</span>
            </div>
            <div className="h-2 bg-progress-bg rounded-full overflow-hidden">
              <div
                className="h-full bg-progress-fill rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Milestones */}
          <div className="flex flex-wrap gap-2">
            {milestones.map((milestone) => (
              <div
                key={milestone.days}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium",
                  milestone.achieved
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {milestone.achieved && <Trophy className="w-3 h-3" />}
                {milestone.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
