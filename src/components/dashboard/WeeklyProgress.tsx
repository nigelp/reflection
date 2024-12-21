import React from 'react';
import { MeditationSession } from '../../types';

type Props = {
  sessions: MeditationSession[];
  weeklyGoal: number;
};

export default function WeeklyProgress({ sessions, weeklyGoal }: Props) {
  const today = new Date();
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
  
  const thisWeekSessions = sessions.filter(session => 
    new Date(session.created_at) >= startOfWeek
  );

  const progress = (thisWeekSessions.length / weeklyGoal) * 100;

  return (
    <div className="bg-white rounded-xl p-6">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Weekly Progress</h3>
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>{thisWeekSessions.length} sessions</span>
          <span>Goal: {weeklyGoal}</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div 
            className="h-full bg-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}