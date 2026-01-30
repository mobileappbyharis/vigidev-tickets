'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/useToast';

export default function RegisterPage() {
  const { success, error } = useToast();
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('📧 Sending magic link to:', email);

      // Send magic link via email - NO PASSWORD REQUIRED
      const { error: signInError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: fullName,
          },
        },
      });

      if (signInError) {
        console.error('❌ Magic link send error:', signInError.message);
        error(signInError.message);
        setIsLoading(false);
        return;
      }

      console.log('✓ Magic link sent successfully');
      setEmailSent(true);
      success('Magic link envoyé! Vérifiez votre email pour continuer.');
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
            {emailSent ? 'Lien envoyé!' : 'Créer un compte client'}
          </p>

          {!emailSent ? (
            <>
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

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? 'Envoi en cours...' : 'Recevoir un lien magique'}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-slate-700">
                  Un lien de connexion a été envoyé à <strong>{email}</strong>
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <p className="text-sm text-slate-600">
                  ✅ <strong>Pas de mot de passe!</strong> Cliquez sur le lien dans l'email pour créer votre compte et accéder directement à VigiTickets.
                </p>
              </div>
              <button
                onClick={() => setEmailSent(false)}
                className="text-sm text-blue-600 hover:underline"
              >
                Retourner au formulaire
              </button>
            </div>
          )}

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
