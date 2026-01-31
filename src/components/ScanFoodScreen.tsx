import { useState, useRef, useEffect, useCallback } from "react";
import { ArrowLeft, Camera, Upload, X, Loader2, SwitchCamera } from "lucide-react";
import AnalysisResult from "./AnalysisResult";

interface ScanFoodScreenProps {
  onBack: () => void;
}

const ScanFoodScreen = ({ onBack }: ScanFoodScreenProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  const startCamera = useCallback(async () => {
    setCameraError(null);
    
    try {
      // Request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      
      setCameraActive(true);
    } catch (error) {
      console.error("Camera error:", error);
      if (error instanceof Error) {
        if (error.name === "NotAllowedError") {
          setCameraError("Camera permission denied. Please allow camera access in your browser settings.");
        } else if (error.name === "NotFoundError") {
          setCameraError("No camera found on this device.");
        } else {
          setCameraError("Unable to access camera. Please try again.");
        }
      }
    }
  }, [facingMode]);

  const switchCamera = useCallback(async () => {
    stopCamera();
    setFacingMode(prev => prev === "user" ? "environment" : "user");
  }, [stopCamera]);

  useEffect(() => {
    if (cameraActive && facingMode) {
      startCamera();
    }
  }, [facingMode]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL("image/jpeg", 0.8);
        setSelectedImage(imageData);
        stopCamera();
      }
    }
  };

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
    
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResult(true);
    }, 3500);
  };

  const handleReset = () => {
    setSelectedImage(null);
    setShowResult(false);
    setIsAnalyzing(false);
    setCameraError(null);
  };

  if (showResult) {
    return <AnalysisResult imageUrl={selectedImage!} onBack={handleReset} onHome={onBack} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Header */}
      <div className="gradient-header px-5 pt-12 pb-8 rounded-b-[2rem]">
        <button
          onClick={() => {
            stopCamera();
            onBack();
          }}
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
        {cameraActive ? (
          <>
            {/* Live Camera View */}
            <div className="relative rounded-2xl overflow-hidden shadow-card mb-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-72 object-cover bg-black"
                style={{ transform: facingMode === "user" ? "scaleX(-1)" : "none" }}
              />
              
              {/* Camera Controls Overlay */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                <button
                  onClick={switchCamera}
                  className="w-12 h-12 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center shadow-soft hover:bg-card transition-colors"
                >
                  <SwitchCamera className="w-6 h-6 text-card-foreground" />
                </button>
                
                <button
                  onClick={capturePhoto}
                  className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-card hover:opacity-90 transition-opacity"
                >
                  <div className="w-12 h-12 rounded-full border-4 border-primary-foreground" />
                </button>
                
                <button
                  onClick={stopCamera}
                  className="w-12 h-12 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center shadow-soft hover:bg-card transition-colors"
                >
                  <X className="w-6 h-6 text-card-foreground" />
                </button>
              </div>
            </div>
            
            <p className="text-center text-muted-foreground text-sm">
              Position the food item in frame and tap to capture
            </p>
          </>
        ) : !selectedImage ? (
          <>
            {/* Camera Button */}
            <button
              onClick={startCamera}
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

            {cameraError && (
              <div className="bg-destructive/10 text-destructive rounded-xl p-4 mb-4 text-sm text-center">
                {cameraError}
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
