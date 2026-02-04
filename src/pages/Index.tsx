import { useState, useEffect } from "react";
import { LandingPage } from "./LandingPage";
import { ChatPage } from "./ChatPage";
import { AuthForm } from "@/components/auth/AuthForm";
import { useAuth } from "@/hooks/useAuth";

type View = "landing" | "auth" | "chat";

const Index = () => {
  const {
    user,
    profile,
    loading,
    signIn,
    signUp,
    refetchProfile,
  } = useAuth();

  const [currentView, setCurrentView] = useState<View>("landing");

  // Redirect to chat if user is logged in
  useEffect(() => {
    if (user && (currentView === "auth" || currentView === "landing")) {
      setCurrentView("chat");
    }
  }, [user, currentView]);

  const handleStartChat = () => {
    if (user) {
      setCurrentView("chat");
    } else {
      setCurrentView("auth");
    }
  };

  const handleBackToLanding = () => {
    setCurrentView("landing");
  };

  const handleSignIn = async (email: string, password: string) => {
    const result = await signIn(email, password);
    if (!result.error) {
      setCurrentView("chat");
    }
    return result;
  };

  const handleSignUp = async (email: string, password: string) => {
    return await signUp(email, password);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  if (currentView === "auth") {
    return (
      <AuthForm
        onSignIn={handleSignIn}
        onSignUp={handleSignUp}
        onBack={handleBackToLanding}
      />
    );
  }

  if (currentView === "chat" && user) {
    return (
      <ChatPage
        onBack={handleBackToLanding}
        userId={user.id}
        isPremium={profile?.is_premium ?? false}
        onboardingCompleted={profile?.onboarding_completed ?? false}
        onProfileUpdate={refetchProfile}
      />
    );
  }

  return <LandingPage onStartChat={handleStartChat} user={user} />;
};

export default Index;
