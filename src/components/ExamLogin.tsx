import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, GraduationCap, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExamTimer } from "@/components/ExamTimer";
import { ExamDetails } from "@/components/ExamDetails";
import { DeviceAccess } from "@/components/DeviceAccess";
import { useToast } from "@/hooks/use-toast";
import academicBackground from "@/assets/academic-background.jpg";

type PermissionStatus = "not-requested" | "granted" | "denied" | "requesting";

export const ExamLogin = () => {
  const navigate = useNavigate();
  const [userCode, setUserCode] = useState("");
  const [passcode, setPasscode] = useState("");
  const [showPasscode, setShowPasscode] = useState(false);
  const [isTimerComplete, setIsTimerComplete] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<PermissionStatus>("not-requested");
  const [micPermission, setMicPermission] = useState<PermissionStatus>("not-requested");
  const { toast } = useToast();

  const handleTimeUp = useCallback(() => {
    setIsTimerComplete(true);
    toast({
      title: "Timer Complete",
      description: "Time is up! Ensure camera and microphone permissions are granted to start.",
      variant: "default",
    });
  }, [toast]);

  const handlePermissionChange = useCallback((camera: PermissionStatus, microphone: PermissionStatus) => {
    setCameraPermission(camera);
    setMicPermission(microphone);
  }, []);

  // Check if all conditions are met to enable exam start
  const isExamEnabled = isTimerComplete && cameraPermission === "granted" && micPermission === "granted";

  const handleStartExam = () => {
    if (!userCode.trim() || !passcode.trim()) {
      toast({
        title: "Missing Credentials",
        description: "Please enter both your User Code and Passcode.",
        variant: "destructive",
      });
      return;
    }

    if (!isExamEnabled) {
      toast({
        title: "Requirements Not Met",
        description: "Please wait for the timer and ensure all permissions are granted.",
        variant: "destructive",
      });
      return;
    }

    const requestFullscreen = () => {
      const element = document.documentElement as any;
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.mozRequestFullScreen) { /* Firefox */
        element.mozRequestFullScreen();
      } else if (element.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) { /* IE/Edge */
        element.msRequestFullscreen();
      }
    };

    requestFullscreen();

    // Mock exam start - in real app, this would validate credentials and navigate
    toast({
      title: "Starting Exam",
      description: "Launching secure exam environment...",
      variant: "default",
    });
    
    // Simulate navigation delay
    setTimeout(() => {
      navigate("/exam");
    }, 1500);
  };

  const togglePasscodeVisibility = () => {
    setShowPasscode(!showPasscode);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat"
      style={{ 
        backgroundImage: `linear-gradient(rgba(220, 230, 240, 0.85), rgba(220, 230, 240, 0.85)), url(${academicBackground})` 
      }}
    >
      <Card className="w-full max-w-lg shadow-xl border-0 backdrop-blur-sm bg-card/95">
        <CardHeader className="text-center space-y-2 pb-4">
          <CardTitle className="text-2xl font-bold text-primary flex items-center justify-center gap-2">
            <GraduationCap className="h-6 w-6" />
            Prepare for Your Exam
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Exam Details Section */}
          <ExamDetails />

          {/* Credential Inputs */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userCode" className="text-sm font-medium">
                User Code
              </Label>
              <Input
                id="userCode"
                type="text"
                placeholder="Enter User Code"
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="passcode" className="text-sm font-medium">
                Passcode
              </Label>
              <div className="relative">
                <Input
                  id="passcode"
                  type={showPasscode ? "text" : "password"}
                  placeholder="Enter Passcode"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="pr-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={togglePasscodeVisibility}
                  aria-label={showPasscode ? "Hide passcode" : "Show passcode"}
                >
                  {showPasscode ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Device Access Section */}
          <DeviceAccess onPermissionChange={handlePermissionChange} />

          {/* Timer Section */}
          <ExamTimer 
            initialMinutes={0.1}
            onTimeUp={handleTimeUp}
            className="py-4"
          />

          {/* Start Exam Button */}
          <Button
            onClick={handleStartExam}
            disabled={!isExamEnabled}
            className={`w-full py-6 text-lg font-semibold transition-all duration-300 ${
              isExamEnabled
                ? "bg-success hover:bg-success/90 text-success-foreground animate-pulse-glow"
                : "bg-muted text-muted-foreground cursor-not-allowed opacity-60"
            }`}
            title={!isExamEnabled ? "Complete timer and grant all permissions to start exam" : ""}
          >
            <div className="flex items-center gap-2">
              {isExamEnabled && <CheckCircle className="h-5 w-5" />}
              {isExamEnabled ? "✅ Start Exam Now" : "Waiting for Requirements"}
            </div>
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Ensure stable internet connection and complete all requirements above to start your exam.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};