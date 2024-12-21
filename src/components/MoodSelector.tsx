import React from 'react';
import { 
  Smile, Frown, Angry, Heart, 
  CloudRain, Sun, Coffee, Moon 
} from 'lucide-react';

const moods = [
  { id: 'calm', icon: <Coffee />, label: 'Calm', color: 'bg-green-100 hover:bg-green-200' },
  { id: 'depressed', icon: <Sun />, label: 'Depressed', color: 'bg-gray-100 hover:bg-gray-200' },
  { id: 'mellow', icon: <Moon />, label: 'Mellow', color: 'bg-purple-100 hover:bg-purple-200' },
  { id: 'stressed', icon: <CloudRain />, label: 'Stressed', color: 'bg-red-100 hover:bg-red-200' },
  { id: 'anxious', icon: <Heart />, label: 'Anxious', color: 'bg-pink-100 hover:bg-pink-200' },
  { id: 'angry', icon: <Angry />, label: 'Angry', color: 'bg-orange-100 hover:bg-orange-200' },
  { id: 'sad', icon: <Frown />, label: 'Sad', color: 'bg-blue-100 hover:bg-blue-200' },
  { id: 'happy', icon: <Smile />, label: 'Happy', color: 'bg-emerald-100 hover:bg-emerald-200' },
];

type Props = {
  onSelect: (mood: string) => void;
  selected?: string;
};

export default function MoodSelector({ onSelect, selected }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      {moods.map((mood) => (
        <button
          key={mood.id}
          onClick={() => onSelect(mood.id)}
          className={`p-3 sm:p-4 rounded-lg ${mood.color} transition-all transform hover:scale-105 
            ${selected === mood.id ? 'ring-2 ring-blue-500 scale-105' : ''}`}
        >
          <div className="flex flex-col items-center space-y-2">
            <div className="w-6 h-6 sm:w-auto sm:h-auto">
              {mood.icon}
            </div>
            <span className="text-sm">{mood.label}</span>
          </div>
        </button>
      ))}
    </div>
  );
}