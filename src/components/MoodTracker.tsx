import React from 'react';
import MoodSelector from './MoodSelector';
import MoodScoreSelector from './MoodScoreSelector';

type Props = {
  preMood?: string;
  postMood?: string;
  preMoodScore: number;
  postMoodScore: number;
  onPreMoodSelect: (mood: string) => void;
  onPostMoodSelect: (mood: string) => void;
  onPreMoodScoreSelect: (score: number) => void;
  onPostMoodScoreSelect: (score: number) => void;
  showPostMood: boolean;
};

export default function MoodTracker({ 
  preMood, 
  postMood, 
  preMoodScore,
  postMoodScore,
  onPreMoodSelect, 
  onPostMoodSelect,
  onPreMoodScoreSelect,
  onPostMoodScoreSelect,
  showPostMood 
}: Props) {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-700">
          {showPostMood ? 'How were you feeling before?' : 'How are you feeling?'}
        </h3>
        <MoodSelector onSelect={onPreMoodSelect} selected={preMood} />
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Rate your mood (1-5)
          </label>
          <MoodScoreSelector value={preMoodScore} onChange={onPreMoodScoreSelect} />
        </div>
      </div>

      {showPostMood && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-700">How are you feeling now?</h3>
          <MoodSelector onSelect={onPostMoodSelect} selected={postMood} />
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Rate your mood (1-5)
            </label>
            <MoodScoreSelector value={postMoodScore} onChange={onPostMoodScoreSelect} />
          </div>
        </div>
      )}
    </div>
  );
}