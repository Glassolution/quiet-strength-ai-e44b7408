import { useState } from "react";
import { LandingPage } from "./LandingPage";
import { ChatPage } from "./ChatPage";

type View = "landing" | "chat";

const Index = () => {
  const [currentView, setCurrentView] = useState<View>("landing");

  const handleStartChat = () => {
    setCurrentView("chat");
  };

  const handleBackToLanding = () => {
    setCurrentView("landing");
  };

  if (currentView === "chat") {
    return <ChatPage onBack={handleBackToLanding} />;
  }

  return <LandingPage onStartChat={handleStartChat} />;
};

export default Index;
