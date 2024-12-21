import { supabase } from '../supabase';
import type { Profile } from '../../types';

async function profileExists(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .single();
    
  return !error && data !== null;
}

export async function fetchProfile(userId: string): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) throw new Error(`Failed to fetch profile: ${error.message}`);
  if (!data) throw new Error('Profile not found');
  
  return data;
}

export async function createProfile(userId: string): Promise<Profile> {
  // Check if profile already exists
  const exists = await profileExists(userId);
  if (exists) {
    return fetchProfile(userId);
  }

  const { data, error } = await supabase
    .from('profiles')
    .upsert({ 
      id: userId, 
      streak: 0, 
      total_sessions: 0, 
      weekly_goal: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create profile: ${error.message}`);
  if (!data) throw new Error('Failed to create profile: No data returned');

  return data;
}

export async function updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw new Error(`Failed to update profile: ${error.message}`);
  if (!data) throw new Error('Failed to update profile: No data returned');

  return data;
}