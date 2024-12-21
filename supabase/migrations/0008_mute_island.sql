/*
  # Update mood options

  1. Changes
    - Replace 'joyful' with 'depressed' in valid moods constraint

  2. Data Migration
    - Update existing records with 'joyful' to 'depressed'
*/

-- Update existing records
UPDATE meditation_sessions 
SET pre_mood = 'depressed' 
WHERE pre_mood = 'joyful';

UPDATE meditation_sessions 
SET post_mood = 'depressed' 
WHERE post_mood = 'joyful';

-- Drop and recreate the constraint
ALTER TABLE meditation_sessions 
DROP CONSTRAINT IF EXISTS valid_moods;

ALTER TABLE meditation_sessions 
ADD CONSTRAINT valid_moods CHECK (
  pre_mood = ANY(ARRAY['calm', 'depressed', 'mellow', 'stressed', 'anxious', 'angry', 'sad', 'happy']) AND
  post_mood = ANY(ARRAY['calm', 'depressed', 'mellow', 'stressed', 'anxious', 'angry', 'sad', 'happy'])
);