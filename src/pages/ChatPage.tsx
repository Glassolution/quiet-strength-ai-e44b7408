import { useRef, useEffect, useState } from "react";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { ProgressTracker } from "@/components/chat/ProgressTracker";
import { QuickActions } from "@/components/chat/QuickActions";
import { OnboardingQuestion } from "@/components/onboarding/OnboardingQuestion";
import { OnboardingSummary } from "@/components/onboarding/OnboardingSummary";
import { PremiumPaywall } from "@/components/premium/PremiumPaywall";
import { Logo } from "@/components/icons/Logo";
import { useChat } from "@/hooks/useChat";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useChatSession, FREE_MESSAGES_PER_DAY } from "@/hooks/useChatSession";
import { ONBOARDING_QUESTIONS } from "@/types/onboarding";
import { useToast } from "@/hooks/use-toast";

interface ChatPageProps {
  onBack: () => void;
  userId: string;
  isPremium: boolean;
  onboardingCompleted: boolean;
  onProfileUpdate: () => void;
}

type ChatPhase = "onboarding" | "onboarding_summary" | "paywall" | "chat";

export function ChatPage({
  onBack,
  userId,
  isPremium,
  onboardingCompleted,
  onProfileUpdate,
}: ChatPageProps) {
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Determine initial phase
  const getInitialPhase = (): ChatPhase => {
    if (!onboardingCompleted) return "onboarding";
    if (!isPremium) return "paywall";
    return "chat";
  };

  const [phase, setPhase] = useState<ChatPhase>(getInitialPhase);
  const [showPaywall, setShowPaywall] = useState(false);

  const {
    answers,
    currentQuestionIndex,
    isSaving,
    updateAnswer,
    nextQuestion,
    previousQuestion,
    saveAnswers,
    loadExistingAnswers,
  } = useOnboarding(userId);

  const { messagesRemaining, creditsRemaining, canSendMessage, incrementMessageCount, session } =
    useChatSession(userId, isPremium);

  const { messages, isTyping, error, sendMessage } = useChat(
    userId,
    answers,
    () => {
      incrementMessageCount();
    },
    messagesRemaining === 1
  );

  useEffect(() => {
    loadExistingAnswers();
  }, [loadExistingAnswers]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Erro",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleOnboardingAnswer = (
    answer: string | string[],
    otherText?: string
  ) => {
    const question = ONBOARDING_QUESTIONS[currentQuestionIndex];
    updateAnswer(question.key, answer, otherText);

    if (currentQuestionIndex < ONBOARDING_QUESTIONS.length - 1) {
      nextQuestion();
    } else {
      setPhase("onboarding_summary");
    }
  };

  const handleOnboardingSkip = () => {
    if (currentQuestionIndex < ONBOARDING_QUESTIONS.length - 1) {
      nextQuestion();
    } else {
      setPhase("onboarding_summary");
    }
  };

  const handleOnboardingComplete = async () => {
    const { error } = await saveAnswers();
    if (error) {
      console.error("Erro ao salvar onboarding (ignorado para permitir acesso):", error);
      // Não bloqueia o usuário se falhar o salvamento, para garantir acesso ao chat
      toast({
        title: "Aviso",
        description: "Houve um problema ao salvar suas respostas, mas você pode continuar.",
        duration: 3000,
      });
    }

    onProfileUpdate();

    if (!isPremium) {
      setPhase("paywall");
      setShowPaywall(true);
    } else {
      setPhase("chat");
    }
  };

  const handlePaywallSubscribe = () => {
    // TODO: Implement Stripe checkout
    toast({
      title: "Em breve!",
      description: "O pagamento será implementado em breve.",
    });
  };

  const handlePaywallSkip = () => {
    setShowPaywall(false);
    setPhase("chat");
  };

  const handleSendMessage = (content: string) => {
    if (!canSendMessage) {
      setShowPaywall(true);
      return;
    }
    sendMessage(content);
  };

  const showQuickActions = messages.length <= 1 && phase === "chat";
  const currentQuestion = ONBOARDING_QUESTIONS[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ChatHeader onBack={onBack} />

      {/* Progress Tracker */}
      <div className="px-4 py-3">
        <ProgressTracker />
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Onboarding Phase */}
        {phase === "onboarding" && (
          <>
            {currentQuestionIndex === 0 && (
              <div className="flex gap-3 slide-up">
                <div className="flex-shrink-0 mt-1">
                  <Logo size="sm" />
                </div>
                <div className="bg-card border border-border/50 rounded-2xl rounded-bl-md px-4 py-3 shadow-soft max-w-[85%]">
                  <p className="text-sm md:text-base leading-relaxed">
                    Antes da gente conversar, vou te fazer algumas perguntas
                    rápidas (1–2 min) pra entender como te ajudar melhor. Você
                    pode pular qualquer uma.
                  </p>
                </div>
              </div>
            )}

            <div className="mt-4">
              <div className="text-xs text-muted-foreground text-center mb-3">
                Pergunta {currentQuestionIndex + 1} de{" "}
                {ONBOARDING_QUESTIONS.length}
              </div>
              <OnboardingQuestion
                question={currentQuestion}
                onAnswer={handleOnboardingAnswer}
                onSkip={handleOnboardingSkip}
                onBack={currentQuestionIndex > 0 ? previousQuestion : undefined}
                isFirst={currentQuestionIndex === 0}
              />
            </div>
          </>
        )}

        {/* Onboarding Summary Phase */}
        {phase === "onboarding_summary" && (
          <OnboardingSummary
            answers={answers}
            onContinue={handleOnboardingComplete}
          />
        )}

        {/* Chat Phase */}
        {phase === "chat" && (
          <>
            {messages.map((message, index) => {
              const isLastMessage = index === messages.length - 1;
              const used = session?.messages_used_today || 0;
              const isLimitExceeded = !isPremium && used > FREE_MESSAGES_PER_DAY;
              const shouldBlur =
                isLimitExceeded && isLastMessage && message.role === "assistant";

              return (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isBlurred={shouldBlur}
                  onUnlock={() => setShowPaywall(true)}
                />
              );
            })}

            {isTyping && <TypingIndicator />}

            {showQuickActions && !isTyping && (
              <div className="pt-4 fade-in">
                <p className="text-sm text-muted-foreground mb-3 text-center">
                  Ou escolha uma opção rápida:
                </p>
                <QuickActions onActionClick={handleSendMessage} />
              </div>
            )}
          </>
        )}

        {/* Paywall Phase (shows messages behind paywall) */}
        {phase === "paywall" && !showPaywall && (
          <>
            {messages.map((message, index) => {
              const isLastMessage = index === messages.length - 1;
              const used = session?.messages_used_today || 0;
              const isLimitExceeded = !isPremium && used > FREE_MESSAGES_PER_DAY;
              const shouldBlur =
                isLimitExceeded && isLastMessage && message.role === "assistant";

              return (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isBlurred={shouldBlur}
                  onUnlock={() => setShowPaywall(true)}
                />
              );
            })}

            {isTyping && <TypingIndicator />}

            {showQuickActions && !isTyping && (
              <div className="pt-4 fade-in">
                <p className="text-sm text-muted-foreground mb-3 text-center">
                  Ou escolha uma opção rápida:
                </p>
                <QuickActions onActionClick={handleSendMessage} />
              </div>
            )}
          </>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      {(phase === "chat" || (phase === "paywall" && !showPaywall)) && (
        <div className="p-4 border-t border-border/50 bg-card/50 backdrop-blur-sm">
          <ChatInput
            onSendMessage={handleSendMessage}
            disabled={isTyping || (!canSendMessage && !isPremium)}
          />
          <p className="text-xs text-muted-foreground text-center mt-2">
            {!isPremium && creditsRemaining !== undefined
              ? `${creditsRemaining} créditos disponíveis`
              : "Suas conversas são privadas e seguras"}
          </p>
        </div>
      )}

      {/* Premium Paywall Dialog */}
      <PremiumPaywall
        open={showPaywall}
        onOpenChange={setShowPaywall}
        onSubscribe={handlePaywallSubscribe}
        onSkip={handlePaywallSkip}
      />
    </div>
  );
}
