import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import { BuildInfo } from '@/components/BuildInfo';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'VigiTickets - Plateforme de gestion de tickets',
  description:
    'Plateforme SaaS de gestion de tickets pour Vigidev et ses clients',
  authors: [{ name: 'VigiDev' }],
  keywords: [
    'tickets',
    'gestion',
    'support',
    'vigidev',
    'sécurité',
    'surveillance',
  ],
  viewport: 'width=device-width, initial-scale=1.0',
  robots: 'index, follow',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        {children}
        <Toaster position="top-right" />
        <BuildInfo />
      </body>
    </html>
  );
}
