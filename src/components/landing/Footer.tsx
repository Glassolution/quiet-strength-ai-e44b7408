import { Logo } from "@/components/icons/Logo";

export function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-white/10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Logo size="sm" />
          </div>
          <span className="font-display font-bold text-lg text-foreground">Axon</span>
        </div>
        
        <div className="flex flex-wrap items-center gap-8 text-sm text-muted-foreground">
          <a href="#" className="hover:text-primary transition-colors">Termos de Uso</a>
          <a href="#" className="hover:text-primary transition-colors">Política de Privacidade</a>
          <a href="#" className="hover:text-primary transition-colors">Suporte</a>
        </div>

        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Axon AI. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
