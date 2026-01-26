import { ArrowLeft, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/icons/Logo";

interface ChatHeaderProps {
  onBack: () => void;
}

export function ChatHeader({ onBack }: ChatHeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="h-9 w-9"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <Logo size="sm" />
          <div>
            <h1 className="font-semibold text-sm">Liberta</h1>
            <p className="text-xs text-muted-foreground">
              Seu assistente pessoal
            </p>
          </div>
        </div>
      </div>
      <Button variant="ghost" size="icon" className="h-9 w-9">
        <MoreVertical className="h-5 w-5" />
      </Button>
    </header>
  );
}
