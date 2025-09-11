import { useState, useCallback } from "react";
import { Eye, EyeOff, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExamTimer } from "@/components/ExamTimer";
import { useToast } from "@/hooks/use-toast";
import academicBackground from "@/assets/academic-background.jpg";

export const ExamLogin = () => {
  const [userCode, setUserCode] = useState("");
  const [passcode, setPasscode] = useState("");
  const [showPasscode, setShowPasscode] = useState(false);
  const [isExamEnabled, setIsExamEnabled] = useState(false);
  const { toast } = useToast();

  const handleTimeUp = useCallback(() => {
    setIsExamEnabled(true);
    toast({
      title: "Exam Available",
      description: "You can now start your exam. Please enter your credentials.",
      variant: "default",
    });
  }, [toast]);

  const handleStartExam = () => {
    if (!userCode.trim() || !passcode.trim()) {
      toast({
        title: "Missing Credentials",
        description: "Please enter both your User Code and Passcode.",
        variant: "destructive",
      });
      return;
    }

    // Mock exam start - in real app, this would validate credentials and navigate
    toast({
      title: "Starting Exam",
      description: "Redirecting to exam dashboard...",
      variant: "default",
    });
    
    // Simulate navigation delay
    setTimeout(() => {
      console.log("Navigate to exam dashboard");
    }, 1500);
  };

  const togglePasscodeVisibility = () => {
    setShowPasscode(!showPasscode);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat"
      style={{ 
        backgroundImage: `linear-gradient(rgba(220, 230, 240, 0.8), rgba(220, 230, 240, 0.8)), url(${academicBackground})` 
      }}
    >
      <Card className="w-full max-w-md shadow-lg border-0 backdrop-blur-sm bg-card/95">
        <CardHeader className="text-center space-y-2 pb-6">
          <CardTitle className="text-2xl font-bold text-primary flex items-center justify-center gap-2">
            <UserCheck className="h-6 w-6" />
            Enter Exam Credentials
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userCode" className="text-sm font-medium">
                User Code
              </Label>
              <Input
                id="userCode"
                type="text"
                placeholder="Enter your User Code"
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

          <ExamTimer 
            initialMinutes={5}
            onTimeUp={handleTimeUp}
            className="py-4"
          />

          <Button
            onClick={handleStartExam}
            disabled={!isExamEnabled}
            className={`w-full py-6 text-lg font-semibold transition-all duration-300 ${
              isExamEnabled
                ? "bg-success hover:bg-success/90 text-success-foreground animate-pulse-glow"
                : "bg-muted text-muted-foreground cursor-not-allowed opacity-60"
            }`}
          >
            {isExamEnabled ? "Start Exam Now" : "Waiting for Exam Time"}
          </Button>

          <p className="text-xs text-center text-muted-foreground mt-4">
            Please ensure you have a stable internet connection before starting your exam.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};