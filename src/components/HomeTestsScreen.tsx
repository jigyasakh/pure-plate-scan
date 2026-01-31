import { useState } from "react";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";

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
      <div className="gradient-header px-5 pt-12 pb-8 rounded-b-[2rem]">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back</span>
        </button>
        <h1 className="text-2xl font-bold text-primary-foreground">Home Tests</h1>
        <p className="text-primary-foreground/80 text-sm mt-1">
          Simple DIY tests you can do at home
        </p>
      </div>

      <div className="px-5 py-6">
        <div className="space-y-4">
          {tests.map((test, index) => (
            <div
              key={test.id}
              className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image */}
              <div className="relative h-36">
                <img
                  src={test.image}
                  alt={test.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <span className="text-3xl">{test.emoji}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-card-foreground text-lg mb-1">
                  {test.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {test.description}
                </p>

                {/* Steps - Show only first step initially */}
                <div className="bg-secondary rounded-xl p-4 mb-4">
                  <h4 className="font-medium text-secondary-foreground text-sm mb-2">How to test:</h4>
                  <ol className="space-y-2">
                    {/* Always show first step */}
                    <li className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                        1
                      </span>
                      {test.steps[0]}
                    </li>
                    
                    {/* Show remaining steps only when expanded */}
                    {isExpanded(test.id) && test.steps.slice(1).map((step, stepIndex) => (
                      <li 
                        key={stepIndex + 1} 
                        className="flex items-start gap-2 text-sm text-muted-foreground animate-fade-in"
                      >
                        <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                          {stepIndex + 2}
                        </span>
                        {step}
                      </li>
                    ))}
                    
                    {/* Show dots when collapsed */}
                    {!isExpanded(test.id) && (
                      <li className="flex items-center gap-1 text-muted-foreground pl-7">
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
                      </li>
                    )}
                  </ol>
                </div>

                <button 
                  onClick={() => toggleExpand(test.id)}
                  className="w-full flex items-center justify-between py-3 px-4 bg-primary/10 rounded-xl text-primary hover:bg-primary/20 transition-colors"
                >
                  <span className="font-medium text-sm">
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
      </div>
    </div>
  );
};

export default HomeTestsScreen;
