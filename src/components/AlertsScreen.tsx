import { ArrowLeft, MapPin, AlertTriangle, Clock } from "lucide-react";
import { useAlerts, Alert } from "@/contexts/AlertsContext";

interface AlertsScreenProps {
  onBack: () => void;
}

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
  const { alerts } = useAlerts();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="gradient-header px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-6 sm:pb-8 rounded-b-[2rem]">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary-foreground">Nearby Alerts</h1>
          <p className="text-primary-foreground/80 text-sm sm:text-base mt-1">
            Stay informed about food safety issues
          </p>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Alerts List */}
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Alerts in Your Area</h3>
            <span className="ml-auto text-sm text-muted-foreground">{alerts.length} alerts</span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {alerts.map((alert: Alert, index: number) => (
              <div
                key={alert.id}
                className="bg-card rounded-xl p-4 shadow-soft hover:shadow-card transition-all animate-fade-in-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0" />
                    <h4 className="font-medium text-card-foreground truncate">{alert.type}</h4>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ml-2 ${getSeverityColor(alert.severity)}`}>
                    {alert.severity}
                  </span>
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{alert.location}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                    {alert.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertsScreen;
