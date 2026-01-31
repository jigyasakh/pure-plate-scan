import { ArrowLeft, MapPin, AlertTriangle, Clock } from "lucide-react";

interface AlertsScreenProps {
  onBack: () => void;
}

const nearbyAlerts = [
  {
    id: 1,
    type: "Contaminated Milk",
    location: "Central Market, Sector 7",
    time: "2 hours ago",
    severity: "high",
  },
  {
    id: 2,
    type: "Fake Turmeric",
    location: "Spice Bazaar, Old Town",
    time: "5 hours ago",
    severity: "medium",
  },
  {
    id: 3,
    type: "Unsafe Street Food",
    location: "Railway Station Area",
    time: "1 day ago",
    severity: "high",
  },
  {
    id: 4,
    type: "Adulterated Honey",
    location: "Super Mart, Green Park",
    time: "2 days ago",
    severity: "low",
  },
  {
    id: 5,
    type: "Synthetic Colors in Sweets",
    location: "Festival Market, Main Road",
    time: "3 days ago",
    severity: "medium",
  },
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "high":
      return "bg-destructive/10 text-destructive";
    case "medium":
      return "bg-amber-100 text-amber-700";
    case "low":
      return "bg-primary/10 text-primary";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const AlertsScreen = ({ onBack }: AlertsScreenProps) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="gradient-header px-5 pt-12 pb-8 rounded-b-[2rem]">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back</span>
        </button>
        <h1 className="text-2xl font-bold text-primary-foreground">Nearby Alerts</h1>
        <p className="text-primary-foreground/80 text-sm mt-1">
          Stay informed about food safety issues
        </p>
      </div>

      <div className="px-5 py-6">
        {/* Alerts List */}
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Alerts in Your Area</h3>
        </div>

        <div className="space-y-3">
          {nearbyAlerts.map((alert, index) => (
            <div
              key={alert.id}
              className="bg-card rounded-xl p-4 shadow-soft hover:shadow-card transition-all animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                  <h4 className="font-medium text-card-foreground">{alert.type}</h4>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getSeverityColor(alert.severity)}`}>
                  {alert.severity}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {alert.location}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {alert.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlertsScreen;
