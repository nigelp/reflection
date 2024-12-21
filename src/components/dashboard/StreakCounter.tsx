import React from 'react';
import { Award, Target, History, Trophy, Edit2 } from 'lucide-react';
import { updateProfile } from '../../lib/api/profile';
import { useAuth } from '../../contexts/AuthContext';
import { useSessions } from '../../hooks/useSessions';

type Props = {
  streak: number;
  weeklyGoal: number;
  totalSessions: number;
  onWeeklyGoalUpdate: (goal: number) => void;
};

export default function StreakCounter({ 
  streak, 
  weeklyGoal, 
  totalSessions,
  onWeeklyGoalUpdate 
}: Props) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [tempGoal, setTempGoal] = React.useState(weeklyGoal);
  const { sessions } = useSessions();
  const { user } = useAuth();

  // Calculate weekly goal completion
  const today = new Date();
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
  const weeklySessionCount = sessions?.filter(session => 
    new Date(session.created_at) >= startOfWeek
  ).length || 0;
  const weeklyGoalMet = weeklySessionCount >= weeklyGoal;

  const handleSaveGoal = async () => {
    if (!user) return;
    
    try {
      await updateProfile(user.id, { weekly_goal: tempGoal });
      onWeeklyGoalUpdate(tempGoal);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update weekly goal:', error);
    }
  };

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-4">
      <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
        <div className="flex items-center justify-center mb-2">
          <Award className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500 fill-yellow-100" />
        </div>
        <div className="text-2xl font-bold text-gray-800">{streak}</div>
        <div className="text-sm text-gray-600">Day Streak</div>
      </div>
      
      <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
        <div className="flex items-center justify-center mb-2">
          <Target className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500 fill-blue-100" />
        </div>
        {isEditing ? (
          <div className="space-y-2">
            <input
              type="number"
              value={tempGoal}
              onChange={(e) => setTempGoal(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-16 text-center p-1 border rounded-md"
              min="1"
            />
            <div className="flex justify-center space-x-2">
              <button
                onClick={handleSaveGoal}
                className="text-xs px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setTempGoal(weeklyGoal);
                  setIsEditing(false);
                }}
                className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold text-gray-800 flex items-center justify-center">
              {weeklyGoal}
              <button
                onClick={() => setIsEditing(true)}
                className="ml-2 text-gray-400 hover:text-gray-600"
                aria-label="Edit weekly goal"
              >
                <Edit2 className="h-4 w-4" />
              </button>
            </div>
            <div className="text-sm text-gray-600">Weekly Goal</div>
          </>
        )}
      </div>

      <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
        <div className="flex items-center justify-center mb-2">
          <History className="h-5 w-5 sm:h-6 sm:w-6 text-green-500 fill-green-100" />
        </div>
        <div className="text-2xl font-bold text-gray-800">{totalSessions}</div>
        <div className="text-sm text-gray-600">Total Sessions</div>
      </div>
      
      <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
        <div className="flex items-center justify-center mb-2">
          <Trophy className={`h-5 w-5 sm:h-6 sm:w-6 ${
            weeklyGoalMet 
              ? 'text-yellow-500 fill-yellow-100' 
              : 'text-gray-400 fill-gray-100'
          }`} />
        </div>
        <div className="text-xl sm:text-2xl font-bold text-gray-800">
          {weeklySessionCount}/{weeklyGoal}
        </div>
        <div className="text-sm text-gray-600">Weekly Goal</div>
      </div>
      
      <div className="col-span-4 mt-1 sm:mt-2">
        <p className="text-sm text-gray-500 text-center">
          {weeklyGoalMet 
            ? '🎉 Congratulations! You\'ve met your weekly meditation goal!'
            : streak > 0 
              ? `🔥 ${streak} day streak! Keep it up!`
              : 'Start your meditation streak today!'}
        </p>
      </div>
    </div>
  );
}