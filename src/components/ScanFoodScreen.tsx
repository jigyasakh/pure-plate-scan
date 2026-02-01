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
  const [isInitializing, setIsInitializing] = useState(false);
  
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
    
    // Stop any existing stream first
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    try {
      // Request camera permission with getUserMedia
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
        
        // Wait for video to be ready
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
          // Try again with basic constraints
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
      
      // Ensure video has valid dimensions
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        setCameraError("Unable to capture photo. Please try again.");
        return;
      }
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Handle mirror effect for front camera
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
      <div className="gradient-header px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-6 sm:pb-8 rounded-b-[2rem]">
        <div className="max-w-4xl mx-auto">
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
          <h1 className="text-2xl sm:text-3xl font-bold text-primary-foreground">Scan Food</h1>
          <p className="text-primary-foreground/80 text-sm sm:text-base mt-1">
            Capture or upload a food image for analysis
          </p>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-4xl mx-auto">
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
                
                {/* Camera Controls Overlay */}
                {!isInitializing && (
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                    <button
                      onClick={switchCamera}
                      className="w-12 h-12 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center shadow-soft hover:bg-card transition-colors"
                      title="Switch Camera"
                    >
                      <SwitchCamera className="w-6 h-6 text-card-foreground" />
                    </button>
                    
                    <button
                      onClick={capturePhoto}
                      className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-card hover:opacity-90 transition-opacity"
                      title="Capture Photo"
                    >
                      <div className="w-12 h-12 rounded-full border-4 border-primary-foreground" />
                    </button>
                    
                    <button
                      onClick={stopCamera}
                      className="w-12 h-12 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center shadow-soft hover:bg-card transition-colors"
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
                  className="w-full bg-card rounded-2xl p-6 sm:p-8 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 group"
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-full gradient-primary flex items-center justify-center group-hover:animate-pulse-glow">
                      <Camera className="w-8 sm:w-10 h-8 sm:h-10 text-primary-foreground" />
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
                  <div className="bg-destructive/10 text-destructive rounded-xl p-4 text-sm text-center">
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
                  className="w-full bg-card rounded-2xl p-5 sm:p-6 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 border-2 border-dashed border-primary/30 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Upload className="w-6 sm:w-7 h-6 sm:h-7 text-primary" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-card-foreground">Upload from Gallery</h3>
                      <p className="text-muted-foreground text-sm mt-0.5">
                        Select an existing photo
                      </p>
                    </div>
                  </div>
                </button>

                {/* Hidden File Input - Only for gallery */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </div>

              {/* Tips */}
              <div className="bg-secondary rounded-2xl p-5 h-fit">
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
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    Center the food in frame
                  </li>
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
                <div className="max-w-md mx-auto">
                  <button
                    onClick={handleAnalyze}
                    className="w-full gradient-primary text-primary-foreground font-semibold py-4 rounded-2xl shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-0.5"
                  >
                    Analyze Food Sample
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScanFoodScreen;
