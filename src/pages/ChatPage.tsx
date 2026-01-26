import { useRef, useEffect } from "react";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { ProgressTracker } from "@/components/chat/ProgressTracker";
import { QuickActions } from "@/components/chat/QuickActions";
import { useChat } from "@/hooks/useChat";

interface ChatPageProps {
  onBack: () => void;
}

export function ChatPage({ onBack }: ChatPageProps) {
  const { messages, isTyping, sendMessage } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const showQuickActions = messages.length <= 1;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ChatHeader onBack={onBack} />

      {/* Progress Tracker */}
      <div className="px-4 py-3">
        <ProgressTracker daysFree={3} />
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {isTyping && <TypingIndicator />}

        {showQuickActions && !isTyping && (
          <div className="pt-4 fade-in">
            <p className="text-sm text-muted-foreground mb-3 text-center">
              Ou escolha uma opção rápida:
            </p>
            <QuickActions onActionClick={sendMessage} />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border/50 bg-card/50 backdrop-blur-sm">
        <ChatInput onSendMessage={sendMessage} disabled={isTyping} />
        <p className="text-xs text-muted-foreground text-center mt-2">
          Suas conversas são privadas e seguras
        </p>
      </div>
    </div>
  );
}
