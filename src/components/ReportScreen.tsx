import { useState } from "react";
import { ArrowLeft, AlertTriangle, Send, MapPin } from "lucide-react";
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
      // Add the report to alerts
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
          <div className="bg-card rounded-2xl p-5 sm:p-6 shadow-card">
            <h3 className="font-semibold text-card-foreground mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-primary" />
              Submit a Report
            </h3>

            {submitted ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full gradient-success flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">✓</span>
                </div>
                <h4 className="font-semibold text-card-foreground mb-1">Report Submitted Successfully!</h4>
                <p className="text-muted-foreground text-sm">
                  Thank you for helping keep our community safe. Your report has been added to Nearby Alerts.
                </p>
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
        </div>
      </div>
    </div>
  );
};

export default ReportScreen;
