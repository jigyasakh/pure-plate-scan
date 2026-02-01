import { Camera, FlaskConical, AlertTriangle, MapPin, Leaf } from "lucide-react";

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

const WelcomeScreen = ({ onNavigate }: WelcomeScreenProps) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="gradient-header px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-16 sm:pb-20 rounded-b-[2.5rem]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-card/20 backdrop-blur-sm flex items-center justify-center">
              <Leaf className="w-6 h-6 sm:w-7 sm:h-7 text-primary-foreground" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-foreground">PurePlate</h1>
          </div>
          <p className="text-primary-foreground/80 text-sm sm:text-base ml-1">
            Your food safety companion
          </p>
        </div>
      </div>

      {/* Menu Cards */}
      <div className="px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {menuItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="bg-card rounded-2xl p-4 sm:p-5 lg:p-6 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 text-left group"
                style={{
                  animation: `fade-in-up 0.5s ease-out ${index * 0.1}s forwards`,
                  opacity: 0,
                }}
              >
                <div className="w-12 sm:w-14 lg:w-16 h-12 sm:h-14 lg:h-16 rounded-2xl gradient-primary flex items-center justify-center mb-3 sm:mb-4 group-hover:animate-pulse-glow transition-all">
                  <span className="text-xl sm:text-2xl lg:text-3xl">{item.emoji}</span>
                </div>
                <h3 className="font-semibold text-card-foreground text-base sm:text-lg mb-1">
                  {item.label}
                </h3>
                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                  {item.description}
                </p>
              </button>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="mt-6 sm:mt-8 bg-card rounded-2xl p-4 sm:p-5 lg:p-6 shadow-soft">
            <h3 className="font-semibold text-card-foreground mb-4">Community Impact</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary">12K+</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Scans Done</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary">850</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Reports Filed</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary">98%</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Accuracy</p>
              </div>
            </div>
          </div>

          {/* Footer tip */}
          <div className="mt-6 mb-8 text-center">
            <p className="text-sm text-muted-foreground">
              Tip: Scan in good lighting for best results
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
