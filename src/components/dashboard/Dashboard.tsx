import React from 'react';
import { useProfile } from '../../hooks/useProfile';
import { useSessions } from '../../hooks/useSessions';
import StreakCounter from './StreakCounter';
import MoodTrends from './MoodTrends';
import WeeklyProgress from './WeeklyProgress';
import SessionReport from './SessionReport';

export default function Dashboard() {
  const { profile, loading: profileLoading, error: profileError } = useProfile();
  const { sessions, loading: sessionsLoading } = useSessions();

  const handleWeeklyGoalUpdate = (newGoal: number) => {
    if (profile) {
      // Update local state immediately for better UX
      profile.weekly_goal = newGoal;
    }
  };

  if (profileLoading || sessionsLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-24 bg-gray-200 rounded-xl" />
        <div className="h-64 bg-gray-200 rounded-xl" />
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600">
        Unable to load profile data. Please try again later.
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="space-y-6">
      <StreakCounter
        streak={profile.streak}
        weeklyGoal={profile.weekly_goal}
        totalSessions={profile.total_sessions}
        onWeeklyGoalUpdate={handleWeeklyGoalUpdate}
      />
      
      <div className="space-y-6">
        <WeeklyProgress 
          sessions={sessions}
          weeklyGoal={profile.weekly_goal}
        />
        <MoodTrends sessions={sessions} />
      
        <SessionReport sessions={sessions} />
      </div>
    </div>
  );
}