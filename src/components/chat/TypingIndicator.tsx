import { Logo } from "@/components/icons/Logo";

export function TypingIndicator() {
  return (
    <div className="flex gap-3 slide-up">
      <div className="flex-shrink-0 mt-1">
        <Logo size="sm" />
      </div>
      <div className="bg-card border border-border/50 shadow-soft rounded-2xl rounded-bl-md px-4 py-4">
        <div className="flex gap-1.5">
          <span className="typing-dot" />
          <span className="typing-dot" />
          <span className="typing-dot" />
        </div>
      </div>
    </div>
  );
}
