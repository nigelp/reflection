import React from 'react';
import { Play, Pause, RefreshCw, Square, Check, X } from 'lucide-react';

type Props = {
  isActive: boolean;
  onToggle: () => void;
  onReset: () => void;
  onStop: () => void;
  onConfirmStop: () => void;
  onDiscard: () => void;
  disabled?: boolean;
  disabledMessage?: string;
  showConfirmStop?: boolean;
};

export default function TimerControls({
  isActive,
  onToggle,
  onReset,
  onStop,
  onConfirmStop,
  onDiscard,
  disabled,
  disabledMessage,
  showConfirmStop
}: Props) {
  return (
    <div className="flex flex-col items-center space-y-3">
      <div className="flex space-x-3">
        {!showConfirmStop ? (
          <>
            <button
              onClick={onToggle}
              disabled={disabled}
              className={`p-4 rounded-full transition-colors ${
                disabled 
                  ? 'bg-gray-100 cursor-not-allowed' 
                  : isActive ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-blue-50 hover:bg-blue-100'
              }`}
              aria-label={isActive ? 'Pause' : 'Start'}
            >
              {isActive ? <Pause size={24} /> : <Play size={24} />}
            </button>
            {isActive && (
              <button
                onClick={onStop}
                className="p-4 rounded-full bg-red-50 hover:bg-red-100 transition-colors"
                aria-label="Stop"
              >
                <Square size={24} className="text-red-600" />
              </button>
            )}
            {!isActive && (
              <button
                onClick={onReset}
                disabled={disabled}
                className={`p-4 rounded-full transition-colors ${
                  disabled 
                    ? 'bg-gray-100 cursor-not-allowed' 
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
                aria-label="Reset"
              >
                <RefreshCw size={24} />
              </button>
            )}
          </>
        ) : (
          <>
            <button
              onClick={onConfirmStop}
              className="p-4 rounded-full bg-green-50 hover:bg-green-100 transition-colors"
              aria-label="Complete Session"
            >
              <Check size={24} className="text-green-600" />
            </button>
            <button
              onClick={onDiscard}
              className="p-4 rounded-full bg-red-50 hover:bg-red-100 transition-colors"
              aria-label="Discard Session"
            >
              <X size={24} className="text-red-600" />
            </button>
          </>
        )}
      </div>
      {showConfirmStop && (
        <button
          className="text-sm text-gray-600 text-center"
        >
          Complete session or discard?
        </button>
      )}
      {disabled && disabledMessage && (
        <p className="text-sm text-gray-500">{disabledMessage}</p>
      )}
    </div>
  );
}