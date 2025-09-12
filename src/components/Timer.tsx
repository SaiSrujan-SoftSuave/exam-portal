import React from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  timeDisplay: string;
  color: string;
  className?: string;
}

export const Timer: React.FC<TimerProps> = ({ timeDisplay, color, className = '' }) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Clock size={20} style={{ color }} />
      <span 
        className="font-bold text-lg sm:text-xl"
        style={{ color }}
        aria-live="polite"
        aria-label={`Time remaining: ${timeDisplay}`}
      >
        {timeDisplay}
      </span>
    </div>
  );
};