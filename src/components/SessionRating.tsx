import React from 'react';
import { Star } from 'lucide-react';

type Props = {
  value: number;
  onChange: (rating: number) => void;
};

export default function SessionRating({ value, onChange }: Props) {
  return (
    <div className="flex space-x-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onChange(star)}
          className={`transform transition-all hover:scale-110 
            ${star <= value ? 'text-yellow-400' : 'text-gray-300'}`}
        >
          <Star fill={star <= value ? 'currentColor' : 'none'} />
        </button>
      ))}
    </div>
  );
}