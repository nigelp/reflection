import React from 'react';

type Props = {
  value: number;
  onChange: (score: number) => void;
};

export default function MoodScoreSelector({ value, onChange }: Props) {
  return (
    <div className="flex space-x-2">
      {[1, 2, 3, 4, 5].map((score) => (
        <button
          key={score}
          onClick={() => onChange(score)}
          className={`w-10 h-10 rounded-full transition-all ${
            score === value
              ? 'bg-blue-500 text-white ring-2 ring-blue-300'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          {score}
        </button>
      ))}
    </div>
  );
}