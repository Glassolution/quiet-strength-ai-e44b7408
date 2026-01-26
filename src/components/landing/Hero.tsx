import { Button } from "@/components/ui/button";
import { Logo } from "@/components/icons/Logo";
import { Shield, Lock, Heart } from "lucide-react";

interface HeroProps {
  onStartChat: () => void;
}

export function Hero({ onStartChat }: HeroProps) {
  return (
    <section className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <span className="font-semibold text-foreground">Liberta</span>
          </div>
          <Button variant="ghost" size="sm" onClick={onStartChat}>
            Entrar
          </Button>
        </div>
      </header>

      {/* Main Hero */}
      <main className="flex-1 flex items-center justify-center px-6 pb-20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="fade-in-up" style={{ animationDelay: "0.1s" }}>
            <Logo size="lg" className="mx-auto mb-8" />
          </div>

          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-tight mb-6 fade-in-up text-balance"
            style={{ animationDelay: "0.2s" }}
          >
            Uma IA criada para te ajudar a{" "}
            <span className="gradient-text">retomar o controle</span>
          </h1>

          <p
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto fade-in-up text-balance"
            style={{ animationDelay: "0.3s" }}
          >
            Converse, acompanhe seu progresso e receba apoio diário para vencer
            o vício em pornografia — com privacidade total.
          </p>

          <div
            className="fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            <Button variant="hero" size="xl" onClick={onStartChat}>
              Começar agora
            </Button>
          </div>

          {/* Trust indicators */}
          <div
            className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground fade-in-up"
            style={{ animationDelay: "0.5s" }}
          >
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" />
              <span>100% Privado</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <span>Sem julgamentos</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-primary" />
              <span>Apoio empático</span>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}
