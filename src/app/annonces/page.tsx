// src/app/annonces/page.tsx
// ListingsPage.tsx
import React, { Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ListingBadge } from '@/components/ui/ListingCard';
import ListingsContent from './ListingsContent';
import { Listing } from '@/types/listing';
import { searchListings } from '@/lib/search';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Toutes les annonces - Grabi',
  description: 'Découvrez toutes les annonces disponibles sur Grabi, la plateforme de petites annonces du Sénégal.',
};

type SortBy = 'relevance' | 'price_asc' | 'price_desc' | 'date_desc' | 'date_asc';

interface AnnonceFromDB {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  picture: string;
  gallery: string[];
  createdAt: Date;
  updatedAt: Date;
  status: string;
  category: string | null;
  subcategory: string | null;
  condition: string | null;
  user?: {
    id: number;
    name: string;
    picture: string;
    mobile: string;
    accountType: string;
  };
}

interface SearchParams {
  q?: string;
  category?: string;
  subcategory?: string;
  location?: string;
  minPrice?: string;
  maxPrice?: string;
  condition?: string;
  userType?: string;
  sortBy?: string;
  page?: string;
}

// Fonction pour transformer une annonce de la DB en Listing
function transformAnnonceToListing(annonce: AnnonceFromDB): Listing {
  const badges = getBadgesFromAnnonce(annonce);
  
  return {
    id: annonce.id.toString(),
    title: annonce.title,
    description: annonce.description,
    price: annonce.price === 0 ? 'Gratuit' : annonce.price,
    location: annonce.location,
    postedAt: getRelativeTime(annonce.createdAt),
    imageUrl: annonce.picture || '/images/placeholder.jpg',
    badges,
    isSponsored: Math.random() > 0.8, // Simulation pour la démo
    seller: {
      name: annonce.user?.name || 'Utilisateur',
      rating: Math.round((4.2 + Math.random() * 0.8) * 10) / 10,
      reviewCount: Math.floor(Math.random() * 200) + 10,
      avatarUrl: annonce.user?.picture || `https://i.pravatar.cc/150?u=${annonce.user?.id || 'default'}`
    },
    condition: annonce.condition || 'Bon état',
    deliveryAvailable: Math.random() > 0.6 // Simulation pour la démo
  };
}

// Fonction pour déterminer les badges d'une annonce
function getBadgesFromAnnonce(annonce: AnnonceFromDB): ListingBadge[] {
  const badges: ListingBadge[] = [];
  
  // Badge pro si l'utilisateur a un type de compte business
  if (annonce.user?.accountType === 'business') {
    badges.push('pro');
  }
  
  // Badge urgent si l'annonce a été créée récemment (moins de 24h)
  const isRecent = new Date().getTime() - new Date(annonce.createdAt).getTime() < 24 * 60 * 60 * 1000;
  if (isRecent && annonce.price > 0) {
    badges.push('urgent');
  }
  
  // Badge new si l'annonce a été créée récemment (moins de 48h)
  const isNew = new Date().getTime() - new Date(annonce.createdAt).getTime() < 48 * 60 * 60 * 1000;
  if (isNew) {
    badges.push('new');
  }
  
  // Badge delivery si disponible (aléatoire pour la démo)
  if (Math.random() > 0.7) {
    badges.push('delivery');
  }
  
  return badges;
}

// Fonction pour calculer le temps relatif
function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);
  
  if (diffInHours < 1) {
    return 'il y a moins d\'1 heure';
  } else if (diffInHours < 24) {
    return `il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`;
  } else if (diffInDays < 7) {
    return `il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`;
  } else {
    return date.toLocaleDateString('fr-FR');
  }
}

// Récupération des annonces avec recherche avancée
async function getFilteredAnnonces(searchParams: SearchParams): Promise<Listing[]> {
  try {
    console.log('🔍 Utilisation de Prisma pour la recherche');
    console.log('📋 Paramètres de recherche:', searchParams);
    return await getPrismaResults(searchParams);
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des annonces:', error);
    return getFallbackData();
  }
}

// Recherche avec Prisma
async function getPrismaResults(searchParams: SearchParams): Promise<Listing[]> {
  const searchResults = await searchListings({
    query: searchParams.q,
    category: searchParams.category,
    subcategory: searchParams.subcategory,
    location: searchParams.location,
    minPrice: searchParams.minPrice ? parseFloat(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? parseFloat(searchParams.maxPrice) : undefined,
    condition: searchParams.condition,
    userType: searchParams.userType as 'individual' | 'business',
    sortBy: searchParams.sortBy as SortBy,
    page: searchParams.page ? parseInt(searchParams.page) : 1,
    limit: 20
  });

  console.log('📊 Résultats de la recherche:', {
    total: searchResults.total,
    listings: searchResults.listings.length,
    query: searchParams.q
  });

  return searchResults.listings.map(transformAnnonceToListing);
}

// Données de fallback en cas d'erreur
function getFallbackData(): Listing[] {
  return [
    {
      id: '1',
      title: "Samsung Galaxy S23 Ultra 256GB",
      description: "Smartphone Samsung Galaxy S23 Ultra en excellent état, 256GB de stockage, couleur lavande.",
      price: 850000,
      location: "Dakar",
      postedAt: "il y a 2 heures",
      imageUrl: "https://picsum.photos/400/300?random=1",
      badges: ['pro', 'urgent'],
      isSponsored: true,
      seller: {
        name: "TechStore Dakar",
        rating: 4.8,
        reviewCount: 127,
        avatarUrl: "https://i.pravatar.cc/150?u=techstore"
      },
      condition: "Comme neuf",
      deliveryAvailable: true
    },
    {
      id: '2',
      title: "iPhone 14 Pro Max 128GB",
      description: "iPhone 14 Pro Max en parfait état, acheté il y a 6 mois.",
      price: 1200000,
      location: "Thiès",
      postedAt: "il y a 5 heures",
      imageUrl: "https://picsum.photos/400/300?random=2",
      badges: ['delivery'],
      seller: {
        name: "Amadou Diallo",
        rating: 4.5,
        reviewCount: 23,
        avatarUrl: "https://i.pravatar.cc/150?u=amadou"
      },
      condition: "Excellent",
      deliveryAvailable: true
    }
  ];
}

// Export du type pour le composant client
export type { Listing };

// Main Listings Page component (Server Component)
export default async function ListingsPage(props: {
  searchParams: Promise<SearchParams>;
}) {
  // Await searchParams pour Next.js 15
  const searchParams = await props.searchParams;
  
  console.log('🔍 Paramètres de recherche reçus:', searchParams);
  
  const listings = await getFilteredAnnonces(searchParams);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Suspense fallback={
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement des annonces...</p>
            </div>
          }>
            <ListingsContent 
              listings={listings} 
              searchParams={searchParams}
            />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  );
}
