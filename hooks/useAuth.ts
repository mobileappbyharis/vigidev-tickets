'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { AuthUser, UserProfile } from '@/types';

/**
 * Hook to manage authentication state
 */
export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();
        setUser(authUser);

        if (authUser) {
          const { data, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authUser.id)
            .single();

          if (profileError) throw profileError;
          setProfile(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      const authUser = session?.user || null;
      setUser(authUser);

      if (authUser) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();

        setProfile(data);
      } else {
        setProfile(null);
      }

      setIsLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const isAuthenticated = !!user && !!profile;
  const isClient = profile?.role === 'client';
  const isVigidev =
    profile?.role === 'technician' ||
    profile?.role === 'developer' ||
    profile?.role === 'admin';
  const isAdmin = profile?.role === 'admin';

  return {
    user,
    profile,
    isLoading,
    error,
    isAuthenticated,
    isClient,
    isVigidev,
    isAdmin,
  };
}
