'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

/**
 * Root page - Redirects to appropriate dashboard based on user role
 */
export default function RootPage() {
  const router = useRouter();
  const { isLoading, isAuthenticated, isClient, isVigidev } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    // Redirect based on role
    if (isClient) {
      router.push('/client/projects');
    } else if (isVigidev) {
      router.push('/vigidev/tickets');
    } else {
      router.push('/auth/login');
    }
  }, [isLoading, isAuthenticated, isClient, isVigidev, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-slate-600">Chargement...</p>
      </div>
    </div>
  );
}
