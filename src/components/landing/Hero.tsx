import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/icons/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ArrowRight, Sparkles, Activity, Calendar, User as UserIcon } from "lucide-react";

interface HeroProps {
  onStartChat: () => void;
  user?: User | null;
}

export function Hero({ onStartChat, user }: HeroProps) {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden selection:bg-primary/20">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="blob top-0 left-1/4 -translate-x-1/2 opacity-40 animate-pulse" style={{ animationDuration: "8s" }} />
        <div className="blob bottom-0 right-1/4 translate-x-1/2 opacity-40 animate-pulse" style={{ animationDuration: "10s", animationDelay: "1s" }} />
      </div>

      {/* Header */}
      <header className="relative z-50 w-full px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full" />
              <Logo size="sm" className="relative" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">Axon</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {user ? (
              <div className="flex items-center gap-4 animate-in fade-in">
                <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                  <UserIcon className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
                <Button variant="default" className="font-medium shadow-lg shadow-primary/20" onClick={onStartChat}>
                  Ir para o Chat
                </Button>
              </div>
            ) : (
              <Button variant="ghost" className="font-medium hover:bg-primary/10" onClick={onStartChat}>
                Entrar
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pt-10 pb-20">
        <div className="max-w-5xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column: Text */}
          <div className="text-center lg:text-left space-y-8 max-w-2xl mx-auto lg:mx-0">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-primary/20 text-primary text-sm font-medium animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Sparkles className="w-4 h-4" />
              <span>Inteligência Artificial Avançada</span>
            </div>
            
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
              Sua mente, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600 dark:to-blue-400">
                fortalecida.
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg mx-auto lg:mx-0 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              Converse, acompanhe seu progresso e receba apoio diário para vencer o vício. 
              Privacidade total, sem julgamentos.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
              <Button 
                size="xl" 
                onClick={onStartChat}
                className="w-full sm:w-auto rounded-full px-8 text-lg h-14 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300"
              >
                Começar Agora
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <p className="text-sm text-muted-foreground">
                100% gratuito e anônimo
              </p>
            </div>
          </div>

          {/* Right Column: Floating Cards Visual */}
          <div className="relative h-[400px] md:h-[500px] w-full hidden lg:block perspective-1000">
            {/* Central Card */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 glass-card p-6 rounded-2xl glow-border animate-in zoom-in duration-1000 delay-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Logo size="sm" />
                </div>
                <div>
                  <div className="h-2 w-24 bg-primary/20 rounded-full mb-2" />
                  <div className="h-2 w-16 bg-primary/10 rounded-full" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-2 w-full bg-muted rounded-full" />
                <div className="h-2 w-5/6 bg-muted rounded-full" />
                <div className="h-2 w-4/6 bg-muted rounded-full" />
              </div>
            </div>

            {/* Floating Card 1: Stats */}
            <div className="absolute top-20 right-10 glass-card p-4 rounded-xl animate-bounce-slow" style={{ animationDuration: "6s" }}>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Progresso</div>
                  <div className="font-bold text-sm">+12% essa semana</div>
                </div>
              </div>
            </div>

            {/* Floating Card 2: Calendar */}
            <div className="absolute bottom-20 left-10 glass-card p-4 rounded-xl animate-bounce-slow" style={{ animationDuration: "7s", animationDelay: "1s" }}>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Sequência</div>
                  <div className="font-bold text-sm">15 dias limpo</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
}
