import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface CTAProps {
  onStartChat: () => void;
}

export function CTA({ onStartChat }: CTAProps) {
  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-semibold mb-4">
          Pronto para começar sua jornada?
        </h2>
        <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
          O primeiro passo é o mais importante. Estou aqui para te ajudar, sem
          julgamentos, apenas apoio.
        </p>
        <Button variant="hero" size="xl" onClick={onStartChat}>
          Começar agora
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </section>
  );
}
