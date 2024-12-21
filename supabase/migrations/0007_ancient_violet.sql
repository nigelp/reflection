/*
  # Enhanced Meditation Tracking System

  1. Updates
    - Add total_minutes to profiles
    - Add daily_goal and monthly_goal to profiles
    - Add last_session_date to profiles for streak tracking
    - Add mood_score to meditation_sessions for numerical mood tracking

  2. Functions
    - Add function to update streaks
    - Add function to update total minutes
*/

-- Add new columns to profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS total_minutes integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS daily_goal integer DEFAULT 10,
  ADD COLUMN IF NOT EXISTS monthly_goal integer DEFAULT 300,
  ADD COLUMN IF NOT EXISTS last_session_date date;

-- Add mood score to meditation_sessions
ALTER TABLE meditation_sessions
  ADD COLUMN IF NOT EXISTS pre_mood_score integer CHECK (pre_mood_score BETWEEN 1 AND 10),
  ADD COLUMN IF NOT EXISTS post_mood_score integer CHECK (post_mood_score BETWEEN 1 AND 10);

-- Function to update streak and total minutes
CREATE OR REPLACE FUNCTION update_profile_stats()
RETURNS TRIGGER AS $$
DECLARE
  last_date date;
BEGIN
  -- Get the last session date
  SELECT last_session_date INTO last_date
  FROM profiles
  WHERE id = NEW.user_id;

  -- Update total minutes
  UPDATE profiles
  SET total_minutes = total_minutes + NEW.duration / 60
  WHERE id = NEW.user_id;

  -- Update streak
  IF last_date IS NULL OR NEW.created_at::date = CURRENT_DATE THEN
    -- First session or already logged today - don't change streak
    NULL;
  ELSIF NEW.created_at::date = last_date + interval '1 day' THEN
    -- Consecutive day - increment streak
    UPDATE profiles
    SET streak = streak + 1
    WHERE id = NEW.user_id;
  ELSIF NEW.created_at::date > last_date + interval '1 day' THEN
    -- Streak broken - reset to 1
    UPDATE profiles
    SET streak = 1
    WHERE id = NEW.user_id;
  END IF;

  -- Update last session date
  UPDATE profiles
  SET last_session_date = NEW.created_at::date
  WHERE id = NEW.user_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for meditation session creation
DROP TRIGGER IF EXISTS on_meditation_session_created ON meditation_sessions;
CREATE TRIGGER on_meditation_session_created
  AFTER INSERT ON meditation_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_profile_stats();