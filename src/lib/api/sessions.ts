import { supabase } from '../supabase';
import type { MeditationSession, CreateSessionData } from '../../types';
import { updateProfile } from './profile';

export async function createSession(sessionData: CreateSessionData): Promise<MeditationSession> {
  // Validate required fields
  if (!sessionData.userId || !sessionData.preMood || !sessionData.postMood || !sessionData.rating) {
    throw new Error('Missing required fields');
  }

  // Validate score ranges
  if (sessionData.preMoodScore < 1 || sessionData.preMoodScore > 5 ||
      sessionData.postMoodScore < 1 || sessionData.postMoodScore > 5 ||
      sessionData.rating < 1 || sessionData.rating > 5) {
    throw new Error('Invalid score range');
  }

  // Start a transaction
  const { data: session, error: sessionError } = await supabase
    .from('meditation_sessions')
    .insert({
      user_id: sessionData.userId,
      duration: sessionData.duration,
      pre_mood: sessionData.preMood,
      pre_mood_score: sessionData.preMoodScore,
      post_mood: sessionData.postMood,
      post_mood_score: sessionData.postMoodScore,
      rating: sessionData.rating,
      notes: sessionData.notes
    } as const)
    .select()
    .single();

  if (sessionError) throw new Error(`Failed to create session: ${sessionError.message}`);
  
  // Update profile total_sessions
  try {
    await updateProfile(sessionData.userId, {
      total_sessions: supabase.rpc('increment_total_sessions')
    });
  } catch (error) {
    console.error('Failed to update total sessions:', error);
  }

  return session;
}