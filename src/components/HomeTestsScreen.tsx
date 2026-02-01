import { useState } from "react";
import { ArrowLeft, ChevronDown, ChevronUp, Info } from "lucide-react";

interface HomeTestsScreenProps {
  onBack: () => void;
}

const tests = [
  {
    id: "milk",
    emoji: "🥛",
    title: "Milk Purity Test",
    description: "Check for water dilution and synthetic additives",
    steps: [
      "Put a drop of milk on a polished surface",
      "Tilt the surface - pure milk flows slowly leaving a trail",
      "Adulterated milk flows quickly without leaving marks",
    ],
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop",
  },
  {
    id: "turmeric",
    emoji: "🌿",
    title: "Turmeric Powder Test",
    description: "Detect chalk powder or artificial colors",
    steps: [
      "Add a teaspoon of turmeric to a glass of water",
      "Pure turmeric settles at the bottom",
      "Adulterated turmeric leaves colored streaks",
    ],
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop",
  },
  {
    id: "oil",
    emoji: "🛢️",
    title: "Oil Purity Test",
    description: "Identify mixed or synthetic oils",
    steps: [
      "Rub a few drops between your palms",
      "Pure oil will make your palms feel smooth",
      "Adulterated oil leaves a sticky residue",
    ],
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=300&fit=crop",
  },
  {
    id: "honey",
    emoji: "🍯",
    title: "Honey Purity Test",
    description: "Check for sugar syrup adulteration",
    steps: [
      "Dip a matchstick in honey and try to light it",
      "Pure honey will light the match",
      "Adulterated honey won't light due to moisture",
    ],
    image: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400&h=300&fit=crop",
  },
];

const HomeTestsScreen = ({ onBack }: HomeTestsScreenProps) => {
  const [expandedTests, setExpandedTests] = useState<string[]>([]);

  const toggleExpand = (testId: string) => {
    setExpandedTests(prev => 
      prev.includes(testId) 
        ? prev.filter(id => id !== testId)
        : [...prev, testId]
    );
  };

  const isExpanded = (testId: string) => expandedTests.includes(testId);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="gradient-header px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-6 sm:pb-8 rounded-b-[2rem]">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary-foreground">Home Tests</h1>
          <p className="text-primary-foreground/80 text-sm sm:text-base mt-1">
            Simple DIY tests you can do at home
          </p>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
            {tests.map((test, index) => (
              <div
                key={test.id}
                className="bg-card rounded-3xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s`, opacity: 0 }}
              >
                {/* Image */}
                <div className="relative h-40 sm:h-48 lg:h-52">
                  <img
                    src={test.image}
                    alt={test.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center shadow-soft">
                      <span className="text-2xl">{test.emoji}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6">
                  <h3 className="font-bold text-card-foreground text-lg sm:text-xl mb-1.5">
                    {test.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-5">
                    {test.description}
                  </p>

                  {/* Steps */}
                  <div className="bg-secondary rounded-2xl p-4 sm:p-5 mb-4">
                    <h4 className="font-semibold text-secondary-foreground text-sm mb-3">How to test:</h4>
                    <ol className="space-y-3">
                      {/* Always show first step */}
                      <li className="flex items-start gap-3 text-sm text-muted-foreground">
                        <span className="w-6 h-6 rounded-full gradient-primary text-primary-foreground text-xs flex items-center justify-center flex-shrink-0 mt-0.5 shadow-soft font-bold">
                          1
                        </span>
                        <span className="pt-0.5">{test.steps[0]}</span>
                      </li>
                      
                      {/* Show remaining steps only when expanded */}
                      {isExpanded(test.id) && test.steps.slice(1).map((step, stepIndex) => (
                        <li 
                          key={stepIndex + 1} 
                          className="flex items-start gap-3 text-sm text-muted-foreground animate-fade-in"
                        >
                          <span className="w-6 h-6 rounded-full gradient-primary text-primary-foreground text-xs flex items-center justify-center flex-shrink-0 mt-0.5 shadow-soft font-bold">
                            {stepIndex + 2}
                          </span>
                          <span className="pt-0.5">{step}</span>
                        </li>
                      ))}
                      
                      {/* Show dots when collapsed */}
                      {!isExpanded(test.id) && (
                        <li className="flex items-center gap-1.5 text-muted-foreground pl-9">
                          <span className="w-2 h-2 rounded-full bg-primary/40" />
                          <span className="w-2 h-2 rounded-full bg-primary/30" />
                          <span className="w-2 h-2 rounded-full bg-primary/20" />
                        </li>
                      )}
                    </ol>
                  </div>

                  <button 
                    onClick={() => toggleExpand(test.id)}
                    className="w-full flex items-center justify-between py-3.5 px-5 gradient-primary rounded-2xl text-primary-foreground hover:shadow-elevated hover:-translate-y-0.5 transition-all shadow-soft"
                  >
                    <span className="font-semibold text-sm">
                      {isExpanded(test.id) ? "Hide Steps" : "Step-by-Step Tips"}
                    </span>
                    {isExpanded(test.id) ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Disclaimer */}
          <div className="mt-8 bg-secondary border border-border rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Info className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-card-foreground">Note</p>
                <p className="text-sm text-muted-foreground mt-1">
                  These home tests provide preliminary indications only. For accurate results, consult certified food testing laboratories.
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

export default HomeTestsScreen;
