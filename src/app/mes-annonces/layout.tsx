import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mes Annonces | Grabi',
  description: 'Gérez toutes vos annonces publiées sur Grabi. Modifiez, supprimez ou activez/désactivez vos annonces.',
  robots: 'noindex, nofollow',
};

export default function MesAnnoncesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 