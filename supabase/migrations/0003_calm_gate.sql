/*
  # Add profile creation trigger

  1. New Objects
    - Function to handle profile creation
    - Trigger to create profiles for new users

  2. Changes
    - Automatically creates a profile when a new user signs up
*/

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, streak, total_sessions, weekly_goal)
  VALUES (new.id, 0, 0, 3)
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();