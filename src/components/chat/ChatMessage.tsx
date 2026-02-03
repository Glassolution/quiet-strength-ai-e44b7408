import { cn } from "@/lib/utils";
import { Logo } from "@/components/icons/Logo";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
  isBlurred?: boolean;
  onUnlock?: () => void;
}

export function ChatMessage({ message, isBlurred, onUnlock }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 slide-up animate-in fade-in duration-500",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {!isUser && (
        <div className="flex-shrink-0 mt-1">
          <Logo size="sm" />
        </div>
      )}

      <div
        className={cn(
          "rounded-2xl px-4 py-3 max-w-[85%] relative overflow-hidden",
          isUser
            ? "bg-chat-user text-foreground rounded-br-md ml-auto"
            : "bg-card border border-border/50 shadow-soft rounded-bl-md"
        )}
      >
        {isBlurred && !isUser ? (
          <div className="relative">
            {/* Blurry Content */}
            <div className="prose prose-sm md:prose-base prose-slate dark:prose-invert max-w-none select-none">
              <div className="h-[4.5rem] overflow-hidden relative">
                <ReactMarkdown
                  components={{
                    p: ({ children }) => (
                      <p className="text-sm md:text-base leading-relaxed mb-2 last:mb-0">
                        {children}
                      </p>
                    ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>
                {/* Gradient Mask */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card/50 to-card" />
              </div>
              
              <div className="mt-2 space-y-2 filter blur-sm opacity-50 select-none pointer-events-none">
                <p className="text-sm md:text-base leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <p className="text-sm md:text-base leading-relaxed">
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>
            </div>

            {/* Paywall Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 bg-card/30 backdrop-blur-[2px]">
              <div className="bg-background/80 p-4 rounded-xl border border-primary/20 shadow-lg animate-in zoom-in-95 duration-300">
                <Lock className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium mb-3 max-w-[200px]">
                  Sou uma IA e posso continuar te acompanhando se você desbloquear o Premium.
                </p>
                <Button size="sm" onClick={onUnlock} className="w-full">
                  Desbloquear Premium
                </Button>
              </div>
            </div>
          </div>
        ) : isUser ? (
          <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        ) : (
          <div className="prose prose-sm md:prose-base prose-slate dark:prose-invert max-w-none">
            <ReactMarkdown
              components={{
                p: ({ children }) => (
                  <p className="text-sm md:text-base leading-relaxed mb-2 last:mb-0">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>
                ),
                li: ({ children }) => (
                  <li className="text-sm md:text-base">{children}</li>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-foreground">{children}</strong>
                ),
                em: ({ children }) => (
                  <em className="italic">{children}</em>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
