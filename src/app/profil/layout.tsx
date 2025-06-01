import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mon Profil | Grabi',
  description: 'Gérez vos informations personnelles et votre profil utilisateur sur Grabi.',
  robots: 'noindex, nofollow',
};

export default function ProfilLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 