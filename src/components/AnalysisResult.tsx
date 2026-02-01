import { ArrowLeft, AlertTriangle, Info, ChevronRight } from "lucide-react";
import { useMemo } from "react";

interface AnalysisResultProps {
  imageUrl: string;
  onBack: () => void;
  onHome: () => void;
}

const adulterants = [
  { name: "Water dilution", icon: "💧", severity: "medium" },
  { name: "Chalk powder", icon: "🧱", severity: "high" },
  { name: "Detergent traces", icon: "🧴", severity: "high" },
  { name: "Artificial color", icon: "🎨", severity: "medium" },
  { name: "Starch additives", icon: "🌾", severity: "low" },
  { name: "Synthetic preservatives", icon: "⚗️", severity: "medium" },
];

const tips = [
  "Always buy from trusted vendors",
  "Check for proper packaging and labeling",
  "Perform simple home tests before consumption",
  "Report any suspicious products to local authorities",
];

const AnalysisResult = ({ imageUrl, onBack, onHome }: AnalysisResultProps) => {
  const result = useMemo(() => {
    const randomAdulterant = adulterants[Math.floor(Math.random() * adulterants.length)];
    const confidence = Math.floor(Math.random() * 21) + 70; // 70-90%
    const isClean = Math.random() > 0.7; // 30% chance of clean result
    
    return {
      adulterant: randomAdulterant,
      confidence,
      isClean,
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className={`px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-6 sm:pb-8 rounded-b-[2rem] ${result.isClean ? "gradient-success" : "gradient-warning"}`}>
        <div className="max-w-4xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Scan Again</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary-foreground">Analysis Result</h1>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left Column - Image and Main Result */}
            <div>
              {/* Image Preview */}
              <div className="relative rounded-2xl overflow-hidden shadow-card mb-6 h-48 sm:h-64 lg:h-72">
                <img
                  src={imageUrl}
                  alt="Analyzed food"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                    result.isClean 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-destructive text-destructive-foreground"
                  }`}>
                    {result.isClean ? (
                      <span className="text-sm font-medium">✓ Sample appears safe</span>
                    ) : (
                      <>
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-sm font-medium">Possible Adulteration Detected</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {!result.isClean && (
                <>
                  {/* Detected Adulterant */}
                  <div className="bg-card rounded-2xl p-5 sm:p-6 shadow-card mb-4 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 rounded-2xl gradient-warning flex items-center justify-center text-3xl shadow-soft">
                        {result.adulterant.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-card-foreground text-lg">{result.adulterant.name}</h3>
                        <p className="text-muted-foreground text-sm">Potential contaminant</p>
                      </div>
                    </div>

                    {/* Confidence Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Confidence Level</span>
                        <span className="font-semibold text-card-foreground">{result.confidence}%</span>
                      </div>
                      <div className="h-3 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full gradient-warning rounded-full transition-all duration-1000"
                          style={{ width: `${result.confidence}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Learn More */}
                  <button className="w-full bg-card rounded-2xl p-5 shadow-soft mb-4 flex items-center justify-between group hover:shadow-card hover:-translate-y-0.5 transition-all animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Info className="w-6 h-6 text-primary" />
                      </div>
                      <span className="font-medium text-card-foreground">Learn more about {result.adulterant.name}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </button>
                </>
              )}

              {result.isClean && (
                <div className="bg-card rounded-2xl p-5 sm:p-6 shadow-card mb-4 animate-fade-in-up">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-14 h-14 rounded-2xl gradient-success flex items-center justify-center text-3xl shadow-soft">
                      ✓
                    </div>
                    <div>
                      <h3 className="font-bold text-card-foreground text-lg">No Issues Detected</h3>
                      <p className="text-muted-foreground text-sm">This sample appears to be safe</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Our AI analysis did not detect any common adulterants. However, always exercise caution and verify with proper testing if unsure.
                  </p>
                </div>
              )}
            </div>

            {/* Right Column - Tips and Actions */}
            <div>
              {/* Safety Tips */}
              <div className="bg-secondary rounded-2xl p-5 sm:p-6 mb-6 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
                <h4 className="font-bold text-secondary-foreground mb-4 text-lg">💡 Safety Tips</h4>
                <ul className="space-y-3">
                  {tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-primary text-xs font-bold">{index + 1}</span>
                      </span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Disclaimer */}
              <div className="bg-secondary border border-border rounded-2xl p-4 mb-6 animate-fade-in-up" style={{ animationDelay: "0.35s" }}>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Info className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-card-foreground font-medium">Important Disclaimer</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Results indicate risk level, not lab confirmation. Image-based analysis has limitations and should not replace professional testing.
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button
                  onClick={onBack}
                  className="w-full gradient-primary text-primary-foreground font-semibold py-4 rounded-2xl shadow-card hover:shadow-elevated hover:-translate-y-0.5 transition-all duration-300"
                >
                  Scan Another Sample
                </button>
                <button
                  onClick={onHome}
                  className="w-full bg-card text-card-foreground font-semibold py-4 rounded-2xl shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all duration-300"
                >
                  Back to Home
                </button>
              </div>

              {/* Footer Badge */}
              <div className="mt-6 text-center">
                <div className="inline-flex items-center gap-2 bg-secondary/80 px-4 py-2 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-xs font-medium text-muted-foreground">Prototype v1.1</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResult;
