'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/useToast';

export default function RegisterPage() {
  const router = useRouter();
  const { success, error } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Sign up with Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        error(signUpError.message);
        setIsLoading(false);
        return;
      }

      if (data.user) {
        console.log('✓ User created successfully:', data.user.id);

        // Create profile in vigitckets_profiles table
        console.log('📝 Attempting to insert profile with data:', {
          id: data.user.id,
          email,
          full_name: fullName,
          role: 'client',
        });

        const { data: profileData, error: profileError } = await supabase
          .from('vigitckets_profiles')
          .insert([
            {
              id: data.user.id,
              email,
              full_name: fullName,
              role: 'client',
            },
          ]);

        if (profileError) {
          console.error('❌ Profile insert error:', {
            message: profileError.message,
            code: profileError.code,
            details: profileError.details,
            hint: profileError.hint,
            status: profileError.status,
          });
          error(`Failed to create profile: ${profileError.message}`);
          setIsLoading(false);
          return;
        }

        console.log('✓ Profile created successfully:', profileData);
        success('Registration successful! Please check your email to verify your account.');

        // Redirect to login after a short delay
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch (err) {
      error('An unexpected error occurred');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center text-slate-900 mb-2">
            VigiTickets
          </h1>
          <p className="text-center text-slate-600 mb-8">
            Créer un compte client
          </p>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nom complet
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="Jean Dupont"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="vous@exemple.com"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                minLength={6}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
              <p className="text-xs text-slate-500 mt-1">Min. 6 caractères</p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Inscription en cours...' : 'S\'inscrire'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-center text-slate-600 text-sm mb-4">
              Vous avez déjà un compte?
            </p>
            <Link
              href="/login"
              className="block w-full text-center bg-slate-100 text-slate-700 font-medium py-2 rounded-lg hover:bg-slate-200 transition-colors"
            >
              Se connecter
            </Link>
          </div>

          <p className="text-center text-slate-500 text-xs mt-6">
            © 2025 Vigidev. Tous droits réservés.
          </p>
        </div>
      </div>
    </div>
  );
}
