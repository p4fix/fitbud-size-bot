
import { useState } from "react";
import WelcomeHero from "@/components/WelcomeHero";
import ProfileForm from "@/components/ProfileForm";
import ChatContainer from "@/components/ChatContainer";

enum AppState {
  WELCOME,
  PROFILE,
  CHAT
}

const Index = () => {
  const [appState, setAppState] = useState<AppState>(AppState.WELCOME);

  const handleGetStarted = () => {
    setAppState(AppState.PROFILE);
  };

  const handleProfileComplete = () => {
    setAppState(AppState.CHAT);
  };

  const renderCurrentState = () => {
    switch (appState) {
      case AppState.WELCOME:
        return <WelcomeHero onGetStarted={handleGetStarted} />;
      case AppState.PROFILE:
        return <ProfileForm onComplete={handleProfileComplete} />;
      case AppState.CHAT:
        return <ChatContainer />;
      default:
        return <WelcomeHero onGetStarted={handleGetStarted} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {renderCurrentState()}
    </div>
  );
};

export default Index;
