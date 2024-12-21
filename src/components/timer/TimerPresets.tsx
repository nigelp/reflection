import React from 'react';
import { Clock } from 'lucide-react';

type Props = {
  onSelect: (minutes: number) => void;
  selected: number;
};

const presets = [5, 10, 20, 40, 60];

export default function TimerPresets({ onSelect, selected }: Props) {
  return (
    <div className="flex flex-wrap gap-2 justify-center w-full">
      {presets.map((minutes) => (
        <button
          key={minutes}
          onClick={() => onSelect(minutes)}
          className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all text-sm sm:text-base
            ${selected === minutes 
              ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-500' 
              : 'bg-gray-50 hover:bg-gray-100'}`}
        >
          <Clock size={16} />
          <span>{minutes}m</span>
        </button>
      ))}
    </div>
  );
}