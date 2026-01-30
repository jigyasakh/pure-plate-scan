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
      <div className="gradient-header px-6 pt-12 pb-20 rounded-b-[2.5rem]">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-card/20 backdrop-blur-sm flex items-center justify-center">
            <Leaf className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-primary-foreground">PurePlate</h1>
        </div>
        <p className="text-primary-foreground/80 text-sm ml-1">
          Your food safety companion
        </p>
      </div>

      {/* Menu Cards */}
      <div className="px-5 -mt-12">
        <div className="grid grid-cols-2 gap-4">
          {menuItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="bg-card rounded-2xl p-5 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 text-left group"
              style={{
                animation: `fade-in-up 0.5s ease-out ${index * 0.1}s forwards`,
                opacity: 0,
              }}
            >
              <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mb-4 group-hover:animate-pulse-glow transition-all">
                <span className="text-2xl">{item.emoji}</span>
              </div>
              <h3 className="font-semibold text-card-foreground text-lg mb-1">
                {item.label}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {item.description}
              </p>
            </button>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 bg-card rounded-2xl p-5 shadow-soft">
          <h3 className="font-semibold text-card-foreground mb-4">Community Impact</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">12K+</p>
              <p className="text-xs text-muted-foreground">Scans Done</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">850</p>
              <p className="text-xs text-muted-foreground">Reports Filed</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">98%</p>
              <p className="text-xs text-muted-foreground">Accuracy</p>
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
  );
};

export default WelcomeScreen;
