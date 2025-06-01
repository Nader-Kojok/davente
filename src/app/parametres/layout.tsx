import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Paramètres | Grabi',
  description: 'Configurez votre compte, sécurité, notifications et préférences de confidentialité sur Grabi.',
  robots: 'noindex, nofollow',
};

export default function ParametresLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 