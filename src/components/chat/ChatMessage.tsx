import { cn } from "@/lib/utils";
import { Logo } from "@/components/icons/Logo";
import ReactMarkdown from "react-markdown";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 slide-up",
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
          "rounded-2xl px-4 py-3 max-w-[85%]",
          isUser
            ? "bg-chat-user text-foreground rounded-br-md ml-auto"
            : "bg-card border border-border/50 shadow-soft rounded-bl-md"
        )}
      >
        {isUser ? (
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
