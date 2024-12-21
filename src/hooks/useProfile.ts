import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchProfile, createProfile } from '../lib/api/profile';
import type { Profile } from '../types';

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const initProfile = useCallback(async () => {
    if (!user) return;
    
    try {
      let userProfile: Profile;
      
      try {
        userProfile = await fetchProfile(user.id);
      } catch (err) {
        // If profile doesn't exist, create it
        if (err instanceof Error && err.message.includes('not found')) {
          userProfile = await createProfile(user.id);
        } else {
          throw err;
        }
      }

      setProfile(userProfile);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to initialize profile'));
      console.error('Profile initialization error:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    initProfile();
  }, [user, initProfile]);

  return { profile, loading, error };
}