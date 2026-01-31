import { useState } from "react";
import { ArrowLeft, AlertTriangle, Send, MapPin } from "lucide-react";

interface ReportScreenProps {
  onBack: () => void;
}

const ReportScreen = ({ onBack }: ReportScreenProps) => {
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
        <h1 className="text-2xl font-bold text-primary-foreground">Report Adulteration</h1>
        <p className="text-primary-foreground/80 text-sm mt-1">
          Help keep our community safe
        </p>
      </div>

      <div className="px-5 py-6">
        {/* Report Form */}
        <div className="bg-card rounded-2xl p-5 shadow-card">
          <h3 className="font-semibold text-card-foreground mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-primary" />
            Submit a Report
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
      </div>
    </div>
  );
};

export default ReportScreen;
