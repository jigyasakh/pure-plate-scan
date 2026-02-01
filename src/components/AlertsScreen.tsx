import { ArrowLeft, MapPin, AlertTriangle, Clock, Shield, ShieldAlert, ShieldCheck } from "lucide-react";
import { useAlerts, Alert } from "@/contexts/AlertsContext";

interface AlertsScreenProps {
  onBack: () => void;
}

const getSeverityConfig = (severity: string) => {
  switch (severity) {
    case "high":
      return {
        bg: "bg-destructive/10",
        text: "text-destructive",
        border: "border-destructive/20",
        icon: ShieldAlert,
        label: "High Risk",
        dot: "bg-destructive",
      };
    case "medium":
      return {
        bg: "bg-amber-50",
        text: "text-amber-600",
        border: "border-amber-200",
        icon: Shield,
        label: "Medium Risk",
        dot: "bg-amber-500",
      };
    case "low":
      return {
        bg: "bg-primary/10",
        text: "text-primary",
        border: "border-primary/20",
        icon: ShieldCheck,
        label: "Low Risk",
        dot: "bg-primary",
      };
    default:
      return {
        bg: "bg-muted",
        text: "text-muted-foreground",
        border: "border-border",
        icon: Shield,
        label: "Unknown",
        dot: "bg-muted-foreground",
      };
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
          {/* Header Bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground text-lg">Alerts in Your Area</h3>
            </div>
            <span className="text-sm text-muted-foreground bg-secondary px-3 py-1.5 rounded-full">
              {alerts.length} alerts
            </span>
          </div>

          {/* Alerts List - Vertical Stack */}
          <div className="space-y-4">
            {alerts.map((alert: Alert, index: number) => {
              const config = getSeverityConfig(alert.severity);
              const IconComponent = config.icon;

              return (
                <div
                  key={alert.id}
                  className={`bg-card rounded-2xl p-5 sm:p-6 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-0.5 border ${config.border} animate-fade-in-up`}
                  style={{ animationDelay: `${index * 0.05}s`, opacity: 0 }}
                >
                  <div className="flex items-start gap-4">
                    {/* Risk Indicator */}
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${config.bg} flex items-center justify-center flex-shrink-0`}>
                      <IconComponent className={`w-6 h-6 sm:w-7 sm:h-7 ${config.text}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h4 className="font-semibold text-card-foreground text-base sm:text-lg">
                          {alert.type}
                        </h4>
                        <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-semibold ${config.bg} ${config.text} flex-shrink-0`}>
                          <span className={`w-2 h-2 rounded-full ${config.dot}`} />
                          {config.label}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span>{alert.location}</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 flex-shrink-0" />
                          <span>{alert.time}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {alerts.length === 0 && (
            <div className="text-center py-12 bg-card rounded-2xl shadow-soft">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-muted-foreground" />
              </div>
              <h4 className="font-semibold text-card-foreground mb-2">No Alerts Found</h4>
              <p className="text-muted-foreground text-sm">Your area is currently safe!</p>
            </div>
          )}

          {/* Footer Badge */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 bg-secondary/80 px-4 py-2 rounded-full">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-medium text-muted-foreground">Prototype v1.1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertsScreen;
