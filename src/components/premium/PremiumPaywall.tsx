import { X, Check, Shield, MessageCircle, Target, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PremiumPaywallProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubscribe: () => void;
  onSkip: () => void;
}

const benefits = [
  { icon: MessageCircle, text: "Conversas ilimitadas com a IA" },
  { icon: Target, text: "Plano personalizado baseado nos seus gatilhos" },
  { icon: Clock, text: "Check-in diário e ajustes automáticos" },
  { icon: Shield, text: "Ferramentas rápidas para urge/craving (3–5 min)" },
];

export function PremiumPaywall({
  open,
  onOpenChange,
  onSubscribe,
  onSkip,
}: PremiumPaywallProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl text-center">
            Seja Premium para continuar a falar com a IA
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground text-center">
          No Premium, eu te acompanho com conversas ilimitadas, plano
          personalizado e check-ins diários.
        </p>

        <div className="space-y-3 my-4">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-accent/50 rounded-xl"
            >
              <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <benefit.icon className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm">{benefit.text}</span>
            </div>
          ))}
        </div>

        <Button onClick={onSubscribe} className="w-full" size="lg">
          Seja Premium para continuar a falar com a IA
        </Button>

        <Button
          variant="ghost"
          onClick={onSkip}
          className="w-full text-muted-foreground"
        >
          Agora não
        </Button>

        <p className="text-xs text-muted-foreground text-center mt-2">
          Este chat não substitui ajuda profissional. Se você estiver em risco
          de se machucar ou em crise, procure ajuda imediata (CVV: 188).
        </p>
      </DialogContent>
    </Dialog>
  );
}
