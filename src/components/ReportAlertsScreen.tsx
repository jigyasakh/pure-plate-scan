import { useState } from "react";
import { ArrowLeft, MapPin, AlertTriangle, Send, Clock } from "lucide-react";

interface ReportAlertsScreenProps {
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
];

const ReportAlertsScreen = ({ onBack }: ReportAlertsScreenProps) => {
  const [formData, setFormData] = useState({
    productName: "",
    location: "",
    description: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.productName && formData.location) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ productName: "", location: "", description: "" });
      }, 3000);
    }
  };

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
        <h1 className="text-2xl font-bold text-primary-foreground">Report & Alerts</h1>
        <p className="text-primary-foreground/80 text-sm mt-1">
          Report issues & stay informed
        </p>
      </div>

      <div className="px-5 py-6">
        {/* Report Form */}
        <div className="bg-card rounded-2xl p-5 shadow-card mb-6">
          <h3 className="font-semibold text-card-foreground mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-primary" />
            Report Adulteration
          </h3>

          {submitted ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full gradient-success flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✓</span>
              </div>
              <h4 className="font-semibold text-card-foreground mb-1">Report Submitted!</h4>
              <p className="text-muted-foreground text-sm">Thank you for helping keep our community safe.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  placeholder="e.g., XYZ Brand Milk"
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Location *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Where did you purchase this?"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe what you noticed..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full gradient-primary text-primary-foreground font-semibold py-4 rounded-xl shadow-card hover:shadow-elevated transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Submit Report
              </button>
            </form>
          )}
        </div>

        {/* Nearby Alerts */}
        <div>
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Nearby Alerts
          </h3>

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
    </div>
  );
};

export default ReportAlertsScreen;
