import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface CTAProps {
  onStartChat: () => void;
}

export function CTA({ onStartChat }: CTAProps) {
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="glass-card rounded-3xl p-8 md:p-16 text-center relative overflow-hidden">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-blue-500/10 pointer-events-none" />
          
          <div className="relative z-10">
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
              Pronto para começar sua jornada?
            </h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto">
              O primeiro passo é o mais importante. Estou aqui para te ajudar, sem
              julgamentos, apenas apoio.
            </p>
            <Button 
              size="xl" 
              onClick={onStartChat}
              className="rounded-full px-8 text-lg h-14 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300"
            >
              Começar agora
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
