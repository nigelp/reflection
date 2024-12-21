import React, { useState, useEffect, useCallback } from 'react';
import TimerPresets from './timer/TimerPresets';
import TimerDisplay from './timer/TimerDisplay';
import TimerControls from './timer/TimerControls';

interface Props {
  onComplete?: (duration: number) => void;
  disabled?: boolean;
  disabledMessage?: string;
  onDiscard?: () => void;
};

export default function Timer({ onComplete, disabled, disabledMessage, onDiscard }: Props) {
  const [selectedMinutes, setSelectedMinutes] = useState(5);
  const [timeLeft, setTimeLeft] = useState(selectedMinutes * 60);
  const [isActive, setIsActive] = useState(false);
  const [showConfirmStop, setShowConfirmStop] = useState(false);
  
  const reset = useCallback(() => {
    setIsActive(false);
    setTimeLeft(selectedMinutes * 60);
    setShowConfirmStop(false);
  }, [selectedMinutes]);

  const handleStop = () => {
    setShowConfirmStop(true);
    setIsActive(false);
  };

  const handleConfirmStop = () => {
    const elapsedTime = selectedMinutes * 60 - timeLeft;
    onComplete?.(elapsedTime);
    reset();
  };

  const handleDiscard = () => {
    onDiscard?.();
    reset();
  };

  useEffect(() => {
    reset();
  }, [selectedMinutes, reset]);

  useEffect(() => {
    let interval: number;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            setIsActive(false);
            onComplete?.(selectedMinutes * 60 - timeLeft);
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isActive]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="flex flex-col items-center space-y-8">
      <TimerPresets 
        onSelect={setSelectedMinutes} 
        selected={selectedMinutes} 
      />
      
      <TimerDisplay 
        minutes={minutes} 
        seconds={seconds} 
        disabled={disabled}
      />
      
      <TimerControls 
        isActive={isActive}
        onToggle={() => !disabled && setIsActive(!isActive)}
        onStop={handleStop}
        onReset={reset}
        disabled={disabled}
        disabledMessage={disabledMessage}
        showConfirmStop={showConfirmStop}
        onConfirmStop={handleConfirmStop}
        onDiscard={handleDiscard}
      />
    </div>
  );
}