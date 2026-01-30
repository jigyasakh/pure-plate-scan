import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Camera, Upload, X, Loader2 } from "lucide-react";
import AnalysisResult from "./AnalysisResult";

interface ScanFoodScreenProps {
  onBack: () => void;
}

const ScanFoodScreen = ({ onBack }: ScanFoodScreenProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [cameraSupported, setCameraSupported] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check camera support
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraSupported(false);
    }
  }, []);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = () => {
    if (!selectedImage) return;
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResult(true);
    }, 3500);
  };

  const handleReset = () => {
    setSelectedImage(null);
    setShowResult(false);
    setIsAnalyzing(false);
  };

  if (showResult) {
    return <AnalysisResult imageUrl={selectedImage!} onBack={handleReset} onHome={onBack} />;
  }

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
        <h1 className="text-2xl font-bold text-primary-foreground">Scan Food</h1>
        <p className="text-primary-foreground/80 text-sm mt-1">
          Capture or upload a food image for analysis
        </p>
      </div>

      <div className="px-5 py-6">
        {!selectedImage ? (
          <>
            {/* Camera Button */}
            <button
              onClick={() => cameraInputRef.current?.click()}
              className="w-full bg-card rounded-2xl p-8 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 mb-4 group"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center group-hover:animate-pulse-glow">
                  <Camera className="w-10 h-10 text-primary-foreground" />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-card-foreground text-lg">Open Camera</h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    Take a photo of your food
                  </p>
                </div>
              </div>
            </button>

            {/* Hidden Camera Input */}
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageSelect}
              className="hidden"
            />

            {!cameraSupported && (
              <div className="bg-destructive/10 text-destructive rounded-xl p-4 mb-4 text-sm text-center">
                Camera not supported on this device. Please use gallery upload.
              </div>
            )}

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-border" />
              <span className="text-muted-foreground text-sm">or</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Gallery Upload */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-card rounded-2xl p-6 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 border-2 border-dashed border-primary/30 group"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Upload className="w-7 h-7 text-primary" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-card-foreground">Upload from Gallery</h3>
                  <p className="text-muted-foreground text-sm mt-0.5">
                    Select an existing photo
                  </p>
                </div>
              </div>
            </button>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />

            {/* Tips */}
            <div className="mt-8 bg-secondary rounded-2xl p-5">
              <h4 className="font-semibold text-secondary-foreground mb-3">📸 Tips for best results</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Ensure good lighting
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Focus on the food item clearly
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Avoid blurry or dark images
                </li>
              </ul>
            </div>
          </>
        ) : (
          <>
            {/* Image Preview */}
            <div className="relative rounded-2xl overflow-hidden shadow-card mb-6">
              <img
                src={selectedImage}
                alt="Selected food"
                className="w-full h-64 object-cover"
              />
              <button
                onClick={handleReset}
                className="absolute top-3 right-3 w-10 h-10 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center shadow-soft hover:bg-card transition-colors"
              >
                <X className="w-5 h-5 text-card-foreground" />
              </button>

              {isAnalyzing && (
                <div className="absolute inset-0 bg-foreground/60 backdrop-blur-sm flex flex-col items-center justify-center">
                  {/* Scanning animation */}
                  <div className="relative w-32 h-32">
                    <div className="absolute inset-0 rounded-full border-4 border-primary-foreground/30" />
                    <div className="absolute inset-0 rounded-full border-4 border-t-primary-foreground animate-spin-slow" />
                    <div className="absolute inset-4 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center">
                      <Loader2 className="w-10 h-10 text-primary-foreground animate-spin" />
                    </div>
                  </div>
                  <p className="text-primary-foreground font-medium mt-4">Analyzing food sample...</p>
                  <p className="text-primary-foreground/70 text-sm mt-1">Please wait</p>
                </div>
              )}
            </div>

            {!isAnalyzing && (
              <button
                onClick={handleAnalyze}
                className="w-full gradient-primary text-primary-foreground font-semibold py-4 rounded-2xl shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-0.5"
              >
                Analyze Food Sample
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ScanFoodScreen;
