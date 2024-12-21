import React from 'react';

type Props = {
  minutes: number;
  seconds: number;
  disabled?: boolean;
};

export default function TimerDisplay({ minutes, seconds, disabled }: Props) {
  return (
    <div className={`text-5xl sm:text-6xl font-light tabular-nums ${
      disabled ? 'text-gray-400' : 'text-gray-700'
    }`}>
      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </div>
  );
}