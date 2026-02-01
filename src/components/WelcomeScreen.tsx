import { useState, useEffect } from "react";
import { Camera, FlaskConical, AlertTriangle, MapPin, Leaf, TrendingUp, Users, Target, Info, X, ChevronRight } from "lucide-react";

interface WelcomeScreenProps {
  onNavigate: (screen: string) => void;
}

const menuItems = [
  {
    id: "scan",
    icon: Camera,
    label: "Scan Food",
    description: "AI-powered food analysis",
    emoji: "📷",
  },
  {
    id: "tests",
    icon: FlaskConical,
    label: "Home Tests",
    description: "Simple DIY purity tests",
    emoji: "🧪",
  },
  {
    id: "report",
    icon: AlertTriangle,
    label: "Report Adulteration",
    description: "Help protect your community",
    emoji: "🚨",
  },
  {
    id: "alerts",
    icon: MapPin,
    label: "Nearby Alerts",
    description: "Stay informed about local issues",
    emoji: "📍",
  },
];

const futureFeatures = [
  { title: "Lab Verification Integration", description: "Connect with certified labs for accurate testing" },
  { title: "Authority Reporting", description: "Direct reporting to FSSAI / municipal bodies" },
  { title: "User Verification", description: "Verified user profiles for trusted reports" },
  { title: "Case History", description: "Track past adulteration cases in your area" },
];

interface AnimatedNumberProps {
  value: number;
  suffix?: string;
}

const AnimatedNumber = ({ value, suffix = "" }: AnimatedNumberProps) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const steps = 40;
    const stepValue = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += stepValue;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <span>
      {displayValue.toLocaleString()}{suffix}
    </span>
  );
};

const WelcomeScreen = ({ onNavigate }: WelcomeScreenProps) => {
  const [showFutureScope, setShowFutureScope] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="gradient-header px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-20 sm:pb-24 rounded-b-[2.5rem]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-card/20 backdrop-blur-sm flex items-center justify-center shadow-soft">
              <Leaf className="w-7 h-7 sm:w-8 sm:h-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-foreground">PurePlate</h1>
              <p className="text-primary-foreground/80 text-sm sm:text-base">
                Your food safety companion
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Cards - 2x2 Grid */}
      <div className="px-4 sm:px-6 lg:px-8 -mt-14 sm:-mt-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {menuItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="bg-card rounded-3xl p-6 sm:p-7 lg:p-8 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1.5 text-left group"
                style={{
                  animation: `fade-in-up 0.5s ease-out ${index * 0.1}s forwards`,
                  opacity: 0,
                }}
              >
                <div className="flex items-start gap-4 sm:gap-5">
                  <div className="w-14 sm:w-16 lg:w-18 h-14 sm:h-16 lg:h-18 rounded-2xl gradient-primary flex items-center justify-center group-hover:animate-pulse-glow transition-all shadow-soft flex-shrink-0">
                    <span className="text-2xl sm:text-3xl lg:text-4xl">{item.emoji}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-card-foreground text-lg sm:text-xl lg:text-2xl mb-1.5">
                      {item.label}
                    </h3>
                    <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                </div>
              </button>
            ))}
          </div>

          {/* Community Impact */}
          <div className="mt-8 sm:mt-10 bg-card rounded-3xl p-6 sm:p-8 shadow-card animate-fade-in-up" style={{ animationDelay: "0.4s", opacity: 0 }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-card-foreground text-lg sm:text-xl">Community Impact</h3>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary px-3 py-1.5 rounded-full">
                <Info className="w-3.5 h-3.5" />
                <span>Demo metrics</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 sm:gap-6">
              <div className="text-center p-4 rounded-2xl bg-secondary/50">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-3">
                  <Target className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
                </div>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary">
                  <AnimatedNumber value={12} suffix="K+" />
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">Scans Done</p>
              </div>
              <div className="text-center p-4 rounded-2xl bg-secondary/50">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-3">
                  <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
                </div>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary">
                  <AnimatedNumber value={850} />
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">Reports Filed</p>
              </div>
              <div className="text-center p-4 rounded-2xl bg-secondary/50">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
                </div>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary">
                  <AnimatedNumber value={98} suffix="%" />
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">Accuracy</p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground text-center mt-5 italic">
              Demo metrics based on pilot usage simulation.
            </p>
          </div>

          {/* Future Scope Button */}
          <button
            onClick={() => setShowFutureScope(true)}
            className="mt-6 w-full bg-secondary hover:bg-secondary/80 rounded-2xl p-4 sm:p-5 flex items-center justify-between group transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-secondary-foreground">Future Scope</p>
                <p className="text-sm text-muted-foreground">Planned features & roadmap</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </button>

          {/* Footer */}
          <div className="mt-8 mb-8 text-center space-y-3">
            <p className="text-sm text-muted-foreground">
              💡 Tip: Scan in good lighting for best results
            </p>
            <div className="inline-flex items-center gap-2 bg-secondary/80 px-4 py-2 rounded-full">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-medium text-muted-foreground">Prototype v1.1</span>
            </div>
          </div>
        </div>
      </div>

      {/* Future Scope Modal */}
      {showFutureScope && (
        <div className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-elevated animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-card-foreground text-xl">🚀 Future Scope</h3>
                <p className="text-sm text-muted-foreground mt-1">Planned features</p>
              </div>
              <button
                onClick={() => setShowFutureScope(false)}
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="space-y-4">
              {futureFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 bg-secondary/50 rounded-2xl"
                >
                  <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary-foreground text-sm font-bold">{index + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-card-foreground">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground mt-0.5">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-primary/10 rounded-2xl">
              <p className="text-sm text-primary text-center font-medium">
                ✨ These features are on our roadmap and will be available in future updates.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WelcomeScreen;
