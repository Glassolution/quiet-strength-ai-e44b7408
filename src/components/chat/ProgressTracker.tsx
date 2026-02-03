import { useState } from "react";
import { Flame, Trophy, ChevronDown, ChevronUp, RotateCcw, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProgress } from "@/hooks/useProgress";
import { Button } from "@/components/ui/button";

interface ProgressTrackerProps {
  className?: string;
}

export function ProgressTracker({ className }: ProgressTrackerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { daysFree, startDate, startJourney, resetJourney } = useProgress();

  const milestones = [
    { days: 1, label: "1 dia", achieved: daysFree >= 1 },
    { days: 7, label: "1 semana", achieved: daysFree >= 7 },
    { days: 14, label: "2 semanas", achieved: daysFree >= 14 },
    { days: 30, label: "1 mês", achieved: daysFree >= 30 },
    { days: 90, label: "3 meses", achieved: daysFree >= 90 },
  ];

  const nextMilestone = milestones.find((m) => !m.achieved) || milestones[milestones.length - 1];
  
  // Calculate progress to next milestone
  // If next milestone is 7 days, and we are at 3 days, progress is 3/7 * 100
  // But we want progress relative to previous milestone to show filling of the bar segment
  // For simplicity, let's use absolute progress towards next milestone from 0
  const progress = nextMilestone
    ? Math.min((daysFree / nextMilestone.days) * 100, 100)
    : 100;

  return (
    <div className={cn("bg-card/50 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg shadow-black/10", className)}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between text-left group"
      >
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300",
            startDate ? "bg-primary/20 shadow-glow" : "bg-white/5"
          )}>
            <Flame className={cn(
              "w-6 h-6 transition-colors duration-300",
              startDate ? "text-primary fill-primary/20" : "text-muted-foreground"
            )} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">Sua Jornada</p>
            <p className="font-bold text-xl tracking-tight text-foreground">
              {startDate ? (
                <span>{daysFree} {daysFree === 1 ? "dia" : "dias"} <span className="text-primary">livre</span></span>
              ) : (
                <span className="text-muted-foreground">Começar agora</span>
              )}
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
        )}
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-6 fade-in border-t border-white/5 pt-4">
          
          {!startDate ? (
            <div className="text-center py-4 space-y-3">
              <p className="text-sm text-muted-foreground">
                Dê o primeiro passo para retomar o controle.
              </p>
              <Button onClick={startJourney} variant="hero" className="w-full">
                Iniciar Contagem
              </Button>
            </div>
          ) : (
            <>
              {/* Progress bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Próxima conquista</span>
                  <span className="font-semibold text-primary">{nextMilestone.label}</span>
                </div>
                <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-blue-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(37,99,235,0.5)]"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground text-right">
                  {Math.round(progress)}% completado
                </p>
              </div>

              {/* Milestones */}
              <div className="flex flex-wrap gap-2 justify-center">
                {milestones.map((milestone) => (
                  <div
                    key={milestone.days}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-300",
                      milestone.achieved
                        ? "bg-primary/20 border-primary/30 text-primary shadow-[0_0_10px_rgba(37,99,235,0.2)]"
                        : "bg-white/5 border-white/5 text-muted-foreground"
                    )}
                  >
                    {milestone.achieved && <Trophy className="w-3 h-3" />}
                    {milestone.label}
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="pt-2 flex justify-between items-center text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Iniciou em {new Date(startDate).toLocaleDateString()}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={resetJourney}
                  className="h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <RotateCcw className="w-3 h-3 mr-1.5" />
                  Recomeçar (Relapse)
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
