import React from 'react';
import { Clock } from 'lucide-react';

interface Round2TimerProps {
  timeDisplay: string;
  color: string;
}

export const Round2Timer: React.FC<Round2TimerProps> = ({ timeDisplay, color }) => {
  return (
    <div className="fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg border border-gray-200 px-4 py-2">
      <div className="flex items-center space-x-2">
        <Clock size={20} style={{ color }} />
        <span 
          className="font-bold text-xl"
          style={{ color }}
          aria-live="polite"
          aria-label={`Time remaining: ${timeDisplay}`}
        >
          {timeDisplay}
        </span>
      </div>
    </div>
  );
};