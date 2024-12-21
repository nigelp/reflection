export type Profile = {
  id: string;
  streak: number;
  total_sessions: number;
  total_minutes: number;
  weekly_goal: number;
  daily_goal: number;
  monthly_goal: number;
  last_session_date: string | null;
  created_at: string;
  updated_at: string;
};

export type MeditationSession = {
  id: string;
  user_id: string;
  duration: number;
  pre_mood: string;
  post_mood: string;
  pre_mood_score: number;
  post_mood_score: number;
  rating: number;
  notes?: string;
  created_at: string;
};

export type CreateSessionData = {
  userId: string;
  duration: number;
  preMood: string;
  preMoodScore: number;
  postMood: string;
  postMoodScore: number;
  rating: number;
  notes?: string;
};

export type Achievement = {
  id: string;
  name: string;
  description: string;
  earned: boolean;
  date?: Date;
};