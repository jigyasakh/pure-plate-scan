import { useState, useRef, useEffect, useCallback } from "react";
import { ArrowLeft, Camera, Upload, X, Loader2, SwitchCamera, Check, Image, Scan } from "lucide-react";
import AnalysisResult from "./AnalysisResult";

interface ScanFoodScreenProps {
  onBack: () => void;
}

const steps = [
  { id: 1, label: "Capture", icon: Camera },
  { id: 2, label: "Analyzing", icon: Scan },
  { id: 3, label: "Results", icon: Check },
];

const ScanFoodScreen = ({ onBack }: ScanFoodScreenProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [isInitializing, setIsInitializing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setIsInitializing(false);
  }, []);

  const startCamera = useCallback(async (mode: "user" | "environment") => {
    setCameraError(null);
    setIsInitializing(true);
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: mode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        await new Promise<void>((resolve, reject) => {
          if (!videoRef.current) {
            reject(new Error("Video element not found"));
            return;
          }
          
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play()
              .then(() => resolve())
              .catch(reject);
          };
          
          videoRef.current.onerror = () => {
            reject(new Error("Video element error"));
          };
        });
      }
      
      setCameraActive(true);
      setIsInitializing(false);
    } catch (error) {
      console.error("Camera error:", error);
      setIsInitializing(false);
      
      if (error instanceof Error) {
        if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
          setCameraError("Camera access denied. Please allow camera access in your browser settings and try again.");
        } else if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
          setCameraError("No camera found on this device. Please connect a camera and try again.");
        } else if (error.name === "NotReadableError" || error.name === "TrackStartError") {
          setCameraError("Camera is in use by another application. Please close other apps using the camera.");
        } else if (error.name === "OverconstrainedError") {
          try {
            const basicStream = await navigator.mediaDevices.getUserMedia({
              video: true,
              audio: false
            });
            streamRef.current = basicStream;
            if (videoRef.current) {
              videoRef.current.srcObject = basicStream;
              await videoRef.current.play();
            }
            setCameraActive(true);
            return;
          } catch {
            setCameraError("Camera access denied or not supported.");
          }
        } else {
          setCameraError("Camera access denied or not supported. Please check your browser permissions.");
        }
      } else {
        setCameraError("Camera access denied or not supported.");
      }
    }
  }, []);

  const handleOpenCamera = useCallback(() => {
    startCamera(facingMode);
  }, [startCamera, facingMode]);

  const switchCamera = useCallback(() => {
    const newMode = facingMode === "user" ? "environment" : "user";
    setFacingMode(newMode);
    if (cameraActive) {
      startCamera(newMode);
    }
  }, [facingMode, cameraActive, startCamera]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        setCameraError("Unable to capture photo. Please try again.");
        return;
      }
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext("2d");
      if (ctx) {
        if (facingMode === "user") {
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
        }
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL("image/jpeg", 0.9);
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
    setCurrentStep(2);
    
    setTimeout(() => {
      setIsAnalyzing(false);
      setCurrentStep(3);
      setShowResult(true);
    }, 3500);
  };

  const handleReset = () => {
    setSelectedImage(null);
    setShowResult(false);
    setIsAnalyzing(false);
    setCameraError(null);
    setCurrentStep(1);
  };

  if (showResult) {
    return <AnalysisResult imageUrl={selectedImage!} onBack={handleReset} onHome={onBack} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Header */}
      <div className="gradient-header px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-6 sm:pb-8 rounded-b-[2rem]">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => {
              stopCamera();
              onBack();
            }}
            className="flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-4 transition-colors"
            disabled={isAnalyzing}
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary-foreground">Scan Food</h1>
          <p className="text-primary-foreground/80 text-sm sm:text-base mt-1">
            Capture or upload a food image for analysis
          </p>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Step Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between max-w-md mx-auto">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = currentStep >= step.id;
                const isCurrent = currentStep === step.id;
                
                return (
                  <div key={step.id} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                        isActive 
                          ? "gradient-primary shadow-soft" 
                          : "bg-secondary"
                      } ${isCurrent && isAnalyzing ? "animate-pulse-glow" : ""}`}>
                        <StepIcon className={`w-5 h-5 ${isActive ? "text-primary-foreground" : "text-muted-foreground"}`} />
                      </div>
                      <span className={`text-xs mt-2 font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                        {step.label}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-12 sm:w-20 h-1 mx-2 rounded-full transition-all duration-300 ${
                        currentStep > step.id ? "gradient-primary" : "bg-secondary"
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {cameraActive || isInitializing ? (
            <>
              {/* Live Camera View */}
              <div className="relative rounded-2xl overflow-hidden shadow-card mb-4 bg-black">
                {isInitializing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
                    <div className="text-center">
                      <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-2" />
                      <p className="text-primary-foreground text-sm">Initializing camera...</p>
                    </div>
                  </div>
                )}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-72 sm:h-96 lg:h-[28rem] object-cover"
                  style={{ transform: facingMode === "user" ? "scaleX(-1)" : "none" }}
                />
                
                {!isInitializing && (
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                    <button
                      onClick={switchCamera}
                      className="w-12 h-12 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center shadow-soft hover:bg-card hover:-translate-y-0.5 transition-all"
                      title="Switch Camera"
                    >
                      <SwitchCamera className="w-6 h-6 text-card-foreground" />
                    </button>
                    
                    <button
                      onClick={capturePhoto}
                      className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center shadow-card hover:shadow-elevated hover:scale-105 transition-all"
                      title="Capture Photo"
                    >
                      <div className="w-12 h-12 rounded-full border-4 border-primary-foreground" />
                    </button>
                    
                    <button
                      onClick={stopCamera}
                      className="w-12 h-12 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center shadow-soft hover:bg-card hover:-translate-y-0.5 transition-all"
                      title="Close Camera"
                    >
                      <X className="w-6 h-6 text-card-foreground" />
                    </button>
                  </div>
                )}
              </div>
              
              <p className="text-center text-muted-foreground text-sm">
                Position the food item in frame and tap the capture button
              </p>
            </>
          ) : !selectedImage ? (
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-4">
                {/* Camera Button */}
                <button
                  onClick={handleOpenCamera}
                  className="w-full bg-card rounded-3xl p-7 sm:p-8 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1.5 group"
                >
                  <div className="flex flex-col items-center gap-5">
                    <div className="w-18 sm:w-20 h-18 sm:h-20 rounded-2xl gradient-primary flex items-center justify-center group-hover:animate-pulse-glow shadow-soft">
                      <Camera className="w-9 sm:w-10 h-9 sm:h-10 text-primary-foreground" />
                    </div>
                    <div className="text-center">
                      <h3 className="font-bold text-card-foreground text-xl">Open Camera</h3>
                      <p className="text-muted-foreground text-sm mt-1.5">
                        Take a photo of your food
                      </p>
                    </div>
                  </div>
                </button>

                {cameraError && (
                  <div className="bg-destructive/10 text-destructive rounded-2xl p-4 text-sm text-center border border-destructive/20">
                    {cameraError}
                  </div>
                )}

                {/* Divider - mobile only */}
                <div className="flex items-center gap-4 sm:hidden">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-muted-foreground text-sm">or</span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                {/* Gallery Upload */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-card rounded-3xl p-6 sm:p-7 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 border-2 border-dashed border-primary/30 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Image className="w-7 sm:w-8 h-7 sm:h-8 text-primary" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-card-foreground text-lg">Upload from Gallery</h3>
                      <p className="text-muted-foreground text-sm mt-0.5">
                        Select an existing photo
                      </p>
                    </div>
                  </div>
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </div>

              {/* Tips */}
              <div className="bg-secondary rounded-3xl p-6 h-fit">
                <h4 className="font-bold text-secondary-foreground mb-4 text-lg">📸 Tips for best results</h4>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {["Ensure good lighting", "Focus on the food item clearly", "Avoid blurry or dark images", "Center the food in frame"].map((tip, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary text-xs font-bold">{i + 1}</span>
                      </span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <>
              {/* Image Preview */}
              <div className="relative rounded-2xl overflow-hidden shadow-card mb-6 max-w-2xl mx-auto">
                <img
                  src={selectedImage}
                  alt="Selected food"
                  className="w-full h-64 sm:h-80 lg:h-96 object-cover"
                />
                {!isAnalyzing && (
                  <button
                    onClick={handleReset}
                    className="absolute top-3 right-3 w-10 h-10 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center shadow-soft hover:bg-card hover:scale-105 transition-all"
                  >
                    <X className="w-5 h-5 text-card-foreground" />
                  </button>
                )}

                {isAnalyzing && (
                  <div className="absolute inset-0 bg-foreground/70 backdrop-blur-sm flex flex-col items-center justify-center">
                    {/* Scan Line Animation */}
                    <div className="absolute inset-0 overflow-hidden">
                      <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan-line" />
                    </div>
                    
                    <div className="relative w-32 h-32">
                      <div className="absolute inset-0 rounded-full border-4 border-primary-foreground/30" />
                      <div className="absolute inset-0 rounded-full border-4 border-t-primary-foreground animate-spin-slow" />
                      <div className="absolute inset-4 rounded-full bg-primary/30 backdrop-blur-sm flex items-center justify-center">
                        <Scan className="w-10 h-10 text-primary-foreground animate-pulse" />
                      </div>
                    </div>
                    <p className="text-primary-foreground font-semibold mt-6 text-lg">Analyzing food sample...</p>
                    <p className="text-primary-foreground/70 text-sm mt-1">AI is checking for adulterants</p>
                  </div>
                )}
              </div>

              {!isAnalyzing && (
                <div className="max-w-md mx-auto space-y-4">
                  <button
                    onClick={handleAnalyze}
                    className="w-full gradient-primary text-primary-foreground font-semibold py-4 rounded-2xl shadow-card hover:shadow-elevated hover:-translate-y-0.5 transition-all duration-300"
                  >
                    Analyze Food Sample
                  </button>
                  <button
                    onClick={handleReset}
                    className="w-full bg-card text-card-foreground font-semibold py-4 rounded-2xl shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all duration-300"
                  >
                    Retake Photo
                  </button>
                </div>
              )}
            </>
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

export default ScanFoodScreen;
