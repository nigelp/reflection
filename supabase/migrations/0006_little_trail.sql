/*
  # Add pre/post session mood tracking

  1. Changes
    - Add pre_mood and post_mood columns to meditation_sessions table
    - Remove existing mood column
    - Add check constraints for valid moods

  2. Security
    - Existing RLS policies will cover the new columns
*/

ALTER TABLE meditation_sessions 
  DROP COLUMN IF EXISTS mood,
  ADD COLUMN pre_mood text NOT NULL,
  ADD COLUMN post_mood text NOT NULL,
  ADD CONSTRAINT valid_moods CHECK (
    pre_mood = ANY(ARRAY['calm', 'joyful', 'mellow', 'stressed', 'anxious', 'angry', 'sad', 'happy']) AND
    post_mood = ANY(ARRAY['calm', 'joyful', 'mellow', 'stressed', 'anxious', 'angry', 'sad', 'happy'])
  );