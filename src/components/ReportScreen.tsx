import { useState } from "react";
import { ArrowLeft, AlertTriangle, Send, MapPin, Clock, Info } from "lucide-react";
import { useAlerts } from "@/contexts/AlertsContext";

interface ReportScreenProps {
  onBack: () => void;
}

const ReportScreen = ({ onBack }: ReportScreenProps) => {
  const { addAlert } = useAlerts();
  const [formData, setFormData] = useState({
    productName: "",
    location: "",
    description: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.productName && formData.location) {
      addAlert(formData.productName, formData.location);
      
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ productName: "", location: "", description: "" });
      }, 3000);
    }
  };

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
          <h1 className="text-2xl sm:text-3xl font-bold text-primary-foreground">Report Adulteration</h1>
          <p className="text-primary-foreground/80 text-sm sm:text-base mt-1">
            Help keep our community safe
          </p>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-2xl mx-auto">
          {/* Report Form */}
          <div className="bg-card rounded-3xl p-6 sm:p-8 shadow-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center shadow-soft">
                <AlertTriangle className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-bold text-card-foreground text-lg">Submit a Report</h3>
                <p className="text-muted-foreground text-sm">Your report helps protect others</p>
              </div>
            </div>

            {submitted ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 rounded-2xl gradient-success flex items-center justify-center mx-auto mb-5 shadow-soft">
                  <span className="text-4xl">✓</span>
                </div>
                <h4 className="font-bold text-card-foreground text-xl mb-2">Report Submitted Successfully!</h4>
                <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                  Thank you for helping keep our community safe. Your report has been added to Nearby Alerts.
                </p>
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Report filed just now</span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-card-foreground mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={formData.productName}
                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                    placeholder="e.g., XYZ Brand Milk"
                    className="w-full px-5 py-4 rounded-2xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-card-foreground mb-2">
                    Location *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Where did you purchase this?"
                      className="w-full pl-14 pr-5 py-4 rounded-2xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-card-foreground mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe what you noticed..."
                    rows={4}
                    className="w-full px-5 py-4 rounded-2xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full gradient-primary text-primary-foreground font-semibold py-4 rounded-2xl shadow-card hover:shadow-elevated hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Submit Report
                </button>
              </form>
            )}
          </div>

          {/* Info Card */}
          <div className="mt-6 bg-secondary rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Info className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-secondary-foreground">What happens next?</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Your report will be visible to other users in the Nearby Alerts section to help them stay informed.
                </p>
              </div>
            </div>
          </div>

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

export default ReportScreen;
