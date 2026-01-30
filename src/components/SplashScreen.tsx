import { useEffect, useState } from "react";
import { Leaf } from "lucide-react";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 300);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 gradient-header flex flex-col items-center justify-center transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="animate-scale-in flex flex-col items-center gap-6">
        {/* Logo */}
        <div className="relative">
          <div className="w-28 h-28 rounded-3xl bg-card/20 backdrop-blur-sm flex items-center justify-center shadow-elevated animate-pulse-glow">
            <Leaf className="w-16 h-16 text-primary-foreground" strokeWidth={1.5} />
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-accent flex items-center justify-center shadow-soft">
            <span className="text-accent-foreground text-sm font-bold">✓</span>
          </div>
        </div>

        {/* App Name */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary-foreground tracking-tight">
            PurePlate
          </h1>
          <p className="text-primary-foreground/80 text-lg mt-2 font-medium">
            Eat Safe. Live Safe.
          </p>
        </div>

        {/* Loading indicator */}
        <div className="mt-8 flex gap-2">
          <div className="w-2 h-2 rounded-full bg-primary-foreground/60 animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-2 h-2 rounded-full bg-primary-foreground/60 animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-2 h-2 rounded-full bg-primary-foreground/60 animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
