import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UpgradeCTAProps {
  onUpgrade: () => void;
  messagesRemaining?: number;
}

export function UpgradeCTA({ onUpgrade, messagesRemaining }: UpgradeCTAProps) {
  return (
    <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-4 my-3 slide-up">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium mb-1">
            {messagesRemaining !== undefined && messagesRemaining > 0
              ? `Você tem ${messagesRemaining} mensagens gratuitas restantes hoje`
              : "Suas mensagens gratuitas acabaram hoje"}
          </p>
          <p className="text-xs text-muted-foreground mb-3">
            Desbloqueie conversas ilimitadas e plano personalizado
          </p>
          <Button 
            onClick={onUpgrade} 
            size="sm" 
            className="w-full whitespace-normal h-auto py-3 text-xs sm:text-sm leading-tight"
          >
            Seja Premium para continuar a falar com a IA
          </Button>
        </div>
      </div>
    </div>
  );
}
