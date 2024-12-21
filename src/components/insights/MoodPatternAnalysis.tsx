import React from 'react';
import { MeditationSession } from '../../types';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

type Props = {
  sessions: MeditationSession[];
};

type MoodChange = {
  mood: string;
  improvement: number;
  count: number;
};

export default function MoodPatternAnalysis({ sessions }: Props) {
  // Only analyze last 30 days of sessions
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentSessions = sessions.filter(
    session => new Date(session.created_at) >= thirtyDaysAgo
  );

  // Calculate mood improvements
  const moodChanges = recentSessions.reduce((acc: Record<string, MoodChange>, session) => {
    const improvement = session.post_mood_score - session.pre_mood_score;
    
    if (!acc[session.pre_mood]) {
      acc[session.pre_mood] = { mood: session.pre_mood, improvement: 0, count: 0 };
    }
    
    acc[session.pre_mood].improvement += improvement;
    acc[session.pre_mood].count += 1;
    
    return acc;
  }, {});

  // Convert to array and calculate averages
  const moodStats = Object.values(moodChanges)
    .map(stat => ({
      ...stat,
      averageImprovement: stat.improvement / stat.count
    }))
    .sort((a, b) => b.averageImprovement - a.averageImprovement);

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 text-blue-600">
        <TrendingUp size={18} />
        <h3 className="font-medium">Mood Pattern Analysis</h3>
      </div>
      
      <div className="grid gap-3">
        {moodStats.map(({ mood, averageImprovement, count }) => (
          <div 
            key={mood}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div>
              <div className="font-medium capitalize">{mood}</div>
              <div className="text-sm text-gray-500">
                {count} session{count !== 1 ? 's' : ''}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`text-sm ${
                averageImprovement > 0 
                  ? 'text-green-600' 
                  : averageImprovement < 0 
                    ? 'text-red-600' 
                    : 'text-gray-600'
              }`}>
                {Math.abs(averageImprovement).toFixed(1)} points
              </div>
              {averageImprovement > 0 ? (
                <ArrowUpRight size={16} className="text-green-600" />
              ) : averageImprovement < 0 ? (
                <ArrowDownRight size={16} className="text-red-600" />
              ) : (
                <Minus size={16} className="text-gray-600" />
              )}
            </div>
          </div>
        ))}
      </div>
      
      <p className="text-sm text-gray-600 mt-4">
        Based on your last 30 days of meditation. The analysis shows average mood improvement for each starting mood.
      </p>
    </div>
  );
}