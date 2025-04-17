
import { useState } from "react";
import WelcomeHero from "@/components/WelcomeHero";
import ProfileFormWrapper from "@/components/ProfileFormWrapper";
import ChatContainer from "@/components/ChatContainer";
import { useToast } from "@/hooks/use-toast";

enum AppState {
  WELCOME,
  PROFILE,
  CHAT
}

const Index = () => {
  const [appState, setAppState] = useState<AppState>(AppState.WELCOME);
  const { toast } = useToast();

  const handleGetStarted = () => {
    setAppState(AppState.PROFILE);
  };

  const handleProfileComplete = () => {
    setAppState(AppState.CHAT);
    toast({
      title: "Profile Updated",
      description: "Your profile has been saved successfully.",
    });
  };

  const handleUpdateProfile = () => {
    setAppState(AppState.PROFILE);
  };

  const renderCurrentState = () => {
    switch (appState) {
      case AppState.WELCOME:
        return <WelcomeHero onGetStarted={handleGetStarted} />;
      case AppState.PROFILE:
        return <ProfileFormWrapper onComplete={handleProfileComplete} />;
      case AppState.CHAT:
        return <ChatContainer onUpdateProfile={handleUpdateProfile} />;
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
