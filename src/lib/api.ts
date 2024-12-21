import { supabase } from './supabase';
import type { Profile } from '../types';

export async function createUserProfile(userId: string): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .insert([{ 
      id: userId, 
      streak: 0, 
      total_sessions: 0, 
      weekly_goal: 3 
    }])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create profile: ${error.message}`);
  }

  return data;
}