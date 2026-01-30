import { useState } from "react";
import SplashScreen from "@/components/SplashScreen";
import WelcomeScreen from "@/components/WelcomeScreen";
import ScanFoodScreen from "@/components/ScanFoodScreen";
import HomeTestsScreen from "@/components/HomeTestsScreen";
import ReportAlertsScreen from "@/components/ReportAlertsScreen";

type Screen = "splash" | "welcome" | "scan" | "tests" | "report" | "alerts";

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>("splash");

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen as Screen);
  };

  const handleBack = () => {
    setCurrentScreen("welcome");
  };

  return (
    <div className="max-w-lg mx-auto min-h-screen bg-background">
      {currentScreen === "splash" && (
        <SplashScreen onComplete={() => setCurrentScreen("welcome")} />
      )}
      
      {currentScreen === "welcome" && (
        <WelcomeScreen onNavigate={handleNavigate} />
      )}
      
      {currentScreen === "scan" && (
        <ScanFoodScreen onBack={handleBack} />
      )}
      
      {currentScreen === "tests" && (
        <HomeTestsScreen onBack={handleBack} />
      )}
      
      {(currentScreen === "report" || currentScreen === "alerts") && (
        <ReportAlertsScreen onBack={handleBack} />
      )}
    </div>
  );
};

export default Index;
