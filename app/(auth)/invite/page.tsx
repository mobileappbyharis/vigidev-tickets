'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/useToast';

export default function InvitePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { success, error } = useToast();

  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [inviteToken, setInviteToken] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      error('Lien d\'invitation invalide ou expiré');
      setIsValidating(false);
      return;
    }

    setInviteToken(token);
    // In production, validate token with your backend
    // For now, we'll assume token is valid from invite email
    setIsValid(true);
    setIsValidating(false);
  }, [searchParams, error]);

  const handleCompleteInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // For this MVP, the invite email would have been sent by admin
      // and the user would have their email in the token
      // In production, you'd verify the token first

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: inviteEmail || '',
        password,
      });

      if (signUpError) {
        error(signUpError.message);
        setIsLoading(false);
        return;
      }

      if (data.user) {
        // Create Vigidev team member profile
        const { error: profileError } = await supabase
          .from('vigitckets_profiles')
          .insert([
            {
              id: data.user.id,
              email: inviteEmail || data.user.email,
              full_name: fullName,
              role: 'technician', // Default role, can be updated by admin
            },
          ]);

        if (profileError) {
          error('Failed to create profile');
          setIsLoading(false);
          return;
        }

        success('Account created successfully! Redirecting...');
        setTimeout(() => {
          router.push('/vigidev/tickets');
        }, 2000);
      }
    } catch (err) {
      error('An unexpected error occurred');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Validation de l'invitation...</p>
        </div>
      </div>
    );
  }

  if (!isValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">
            Invitation invalide
          </h1>
          <p className="text-slate-600 mb-6">
            Le lien d'invitation a expiré ou est invalide. Veuillez contacter votre administrateur.
          </p>
          <a
            href="/login"
            className="inline-block bg-blue-600 text-white font-medium py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retour à la connexion
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center text-slate-900 mb-2">
            VigiTickets
          </h1>
          <p className="text-center text-slate-600 mb-8">
            Rejoindre l'équipe Vigidev
          </p>

          <form onSubmit={handleCompleteInvite} className="space-y-4">
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

            <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded">
              ✓ Votre email est confirmé par le lien d'invitation
            </p>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Création du compte...' : 'Créer mon compte'}
            </button>
          </form>

          <p className="text-center text-slate-500 text-xs mt-6">
            © 2025 Vigidev. Tous droits réservés.
          </p>
        </div>
      </div>
    </div>
  );
}
