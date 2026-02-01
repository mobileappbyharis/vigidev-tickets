'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/useToast';

export default function SetupPage() {
  const router = useRouter();
  const { success, error } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const createProfile = async () => {
      try {
        console.log('👤 Getting current user...');
        const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser();

        if (authError || !currentUser) {
          console.error('❌ No authenticated user found');
          error('No authenticated user found');
          setIsLoading(false);
          return;
        }

        console.log('✓ User authenticated:', currentUser.id);
        setUser(currentUser);

        // Get full_name from metadata
        const fullName = currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'User';

        console.log('📝 Creating profile for user:', {
          id: currentUser.id,
          email: currentUser.email,
          full_name: fullName,
          role: 'client',
        });

        // Create profile
        const { error: profileError } = await supabase
          .from('vigitckets_profiles')
          .insert([
            {
              id: currentUser.id,
              email: currentUser.email,
              full_name: fullName,
              role: 'client',
            },
          ]);

        if (profileError) {
          // Check if it's a duplicate error (profile might already exist)
          if (profileError.code === '23505') {
            console.log('ℹ️ Profile already exists, proceeding...');
          } else {
            console.error('❌ Profile creation error:', {
              message: profileError.message,
              code: profileError.code,
              details: profileError.details,
              hint: profileError.hint,
            });
            error(`Failed to create profile: ${profileError.message}`);
            setIsLoading(false);
            return;
          }
        } else {
          console.log('✓ Profile created successfully');
        }

        success('Profile setup complete!');

        // Redirect to dashboard
        setTimeout(() => {
          router.push('/client/projects');
        }, 1000);
      } catch (err) {
        console.error('❌ Setup error:', err);
        error('An unexpected error occurred');
        setIsLoading(false);
      }
    };

    createProfile();
  }, [error, success, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            VigiTickets
          </h1>
          <p className="text-slate-600 mb-8">
            {isLoading ? 'Configuration en cours...' : 'Profil créé avec succès!'}
          </p>

          {isLoading && (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}

          {user && !isLoading && (
            <div className="text-left space-y-3 bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-slate-700">
                <strong>Email:</strong> {user.email}
              </p>
              <p className="text-sm text-slate-700">
                <strong>Redirection vers le tableau de bord...</strong>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
