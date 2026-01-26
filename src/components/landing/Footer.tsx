import { Logo } from "@/components/icons/Logo";

export function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-border/50">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Logo size="sm" />
          <span className="font-medium text-foreground">Liberta</span>
        </div>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Liberta. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
