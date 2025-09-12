import { useState, useEffect, useCallback } from 'react';
import { TimerState } from '@/types/exam';

export const useTimer = (initialMinutes: number = 25, onTimeUp?: () => void) => {
  const [timer, setTimer] = useState<TimerState>({
    minutes: initialMinutes,
    seconds: 0,
    isRunning: true,
  });

  const getTimerColor = useCallback(() => {
    const totalSeconds = timer.minutes * 60 + timer.seconds;
    if (totalSeconds <= 300) return '#E74C3C'; // Red - final 5 minutes
    if (totalSeconds <= 600) return '#F39C12'; // Orange - final 10 minutes
    return '#27AE60'; // Green
  }, [timer.minutes, timer.seconds]);

  const formatTime = useCallback(() => {
    return `${timer.minutes.toString().padStart(2, '0')}:${timer.seconds.toString().padStart(2, '0')}`;
  }, [timer.minutes, timer.seconds]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timer.isRunning) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev.minutes === 0 && prev.seconds === 0) {
            onTimeUp?.();
            return { ...prev, isRunning: false };
          }

          if (prev.seconds > 0) {
            return { ...prev, seconds: prev.seconds - 1 };
          } else {
            return { minutes: prev.minutes - 1, seconds: 59, isRunning: true };
          }
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timer.isRunning, onTimeUp]);

  const stopTimer = () => setTimer(prev => ({ ...prev, isRunning: false }));
  const startTimer = () => setTimer(prev => ({ ...prev, isRunning: true }));

  return {
    timer,
    formatTime,
    getTimerColor,
    stopTimer,
    startTimer,
  };
};