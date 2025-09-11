import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ExamTimerProps {
  initialMinutes?: number;
  onTimeUp: () => void;
  className?: string;
}

export const ExamTimer = ({ 
  initialMinutes = 5, 
  onTimeUp, 
  className 
}: ExamTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
  const [isTimeUp, setIsTimeUp] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsTimeUp(true);
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const displayTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const getTimerColor = () => {
    if (isTimeUp) return "text-success";
    if (timeLeft <= 60) return "text-destructive";
    if (timeLeft <= 120) return "text-warning";
    return "text-muted-foreground";
  };

  const getTimerMessage = () => {
    if (isTimeUp) return "Exam is now available!";
    return "Time until exam starts:";
  };

  return (
    <div className={cn("text-center space-y-2", className)}>
      <p 
        className="text-sm font-medium text-muted-foreground"
        aria-live="polite"
      >
        {getTimerMessage()}
      </p>
      <div 
        className={cn(
          "text-4xl font-bold tabular-nums transition-colors duration-300",
          getTimerColor()
        )}
        aria-live="assertive"
        aria-label={`${minutes} minutes and ${seconds} seconds remaining`}
      >
        {displayTime}
      </div>
      {isTimeUp && (
        <p className="text-xs text-success animate-fade-in">
          You may now start your exam
        </p>
      )}
    </div>
  );
};