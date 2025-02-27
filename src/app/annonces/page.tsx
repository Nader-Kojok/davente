'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/ui/Footer';
import FilterBar from '@/components/ui/FilterBar';
import { ListingBadge } from '@/components/ui/ListingCard';
import ListingCard from '@/components/ui/ListingCard';

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number | 'Gratuit';
  location: string;
  postedAt: string;
  imageUrl: string;
  badges: ListingBadge[];
  isSponsored?: boolean;
  seller: {
    name: string;
    rating: number;
    reviewCount: number;
    avatarUrl: string;
  };
  condition: string;
  deliveryAvailable: boolean;
}

// Example data (in a real app, this would come from an API)
const listings: Listing[] = [
  {
    id: '1',
    title: 'Video projecteur EPSON NEUF H692B LCD projector',
    description:
      'Mini pelle disponible pour location. Idéale pour travaux de jardinage et petits chantiers.',
    price: 520,
    location: 'Paris 75001 1er Arrondissement',
    postedAt: 'il y a 2 jours',
    imageUrl: 'https://picsum.photos/400/300?random=1',
    badges: ['pro'],
    isSponsored: true,
    seller: {
      name: 'Sissibou',
      rating: 5,
      reviewCount: 5,
      avatarUrl: 'https://i.pravatar.cc/30?img=1',
    },
    condition: 'État neuf',
    deliveryAvailable: true,
  },
  {
    id: '2',
    title: 'Vends vidéo projecteur laser UHD 4K',
    description:
      "Jeu d'échecs de voyage compact avec pièces magnétiques. Parfait état.",
    price: 1690,
    location: 'Schoelcher 97233',
    postedAt: 'il y a 3 heures',
    imageUrl: 'https://picsum.photos/400/300?random=2',
    badges: ['pro'],
    isSponsored: false,
    seller: {
      name: 'louloune',
      rating: 5,
      reviewCount: 4,
      avatarUrl: 'https://i.pravatar.cc/30?img=2',
    },
    condition: 'Très bon état',
    deliveryAvailable: false,
  },
  {
    id: '3',
    title: 'Ravalement Façade - Artisan Qualifié',
    description:
      'Service professionnel de ravalement de façade. Devis gratuit.',
    price: 'Gratuit',
    location: 'Thiès',
    postedAt: 'il y a 1 jour',
    imageUrl: 'https://picsum.photos/400/300?random=3',
    badges: ['pro', 'urgent'],
    isSponsored: false,
    seller: {
      name: 'John Doe',
      rating: 4,
      reviewCount: 10,
      avatarUrl: 'https://i.pravatar.cc/30?img=3',
    },
    condition: 'Neuf',
    deliveryAvailable: true,
  },
  {
    id: '4',
    title: 'Vélo électrique Citadin',
    description:
      'Vélo électrique urbain, autonomie 60km, excellent état, peu utilisé.',
    price: 800,
    location: 'Dakar',
    postedAt: 'il y a 5 heures',
    imageUrl: 'https://picsum.photos/400/300?random=4',
    badges: ['delivery'],
    isSponsored: false,
    seller: {
      name: 'Jane Smith',
      rating: 4.5,
      reviewCount: 25,
      avatarUrl: 'https://i.pravatar.cc/30?img=4',
    },
    condition: 'Occasion',
    deliveryAvailable: false,
  },
  {
    id: '5',
    title: 'Cours de cuisine traditionnelle',
    description:
      'Chef expérimenté propose des cours de cuisine sénégalaise traditionnelle.',
    price: 50,
    location: 'Saint-Louis',
    postedAt: 'il y a 1 jour',
    imageUrl: 'https://picsum.photos/400/300?random=5',
    badges: ['pro'],
    isSponsored: false,
    seller: {
      name: 'Fatou Diop',
      rating: 5,
      reviewCount: 15,
      avatarUrl: 'https://i.pravatar.cc/30?img=5',
    },
    condition: 'Neuf',
    deliveryAvailable: true,
  },
  {
    id: '6',
    title: 'iPhone 13 Pro - 256GB',
    description:
      'iPhone 13 Pro en parfait état, débloqué tout opérateur, avec facture et accessoires.',
    price: 600,
    location: 'Dakar',
    postedAt: 'il y a 4 heures',
    imageUrl: 'https://picsum.photos/400/300?random=6',
    badges: ['urgent'],
    isSponsored: true,
    seller: {
      name: 'Moussa Ndiaye',
      rating: 4.8,
      reviewCount: 30,
      avatarUrl: 'https://i.pravatar.cc/30?img=6',
    },
    condition: 'Occasion',
    deliveryAvailable: false,
  },
  {
    id: '7',
    title: 'Table de massage pliable',
    description:
      'Table de massage professionnelle pliable, avec housse de transport.',
    price: 150,
    location: 'Thiès',
    postedAt: 'il y a 3 jours',
    imageUrl: 'https://picsum.photos/400/300?random=7',
    badges: ['pro', 'delivery'],
    isSponsored: false,
    seller: {
      name: 'Awa Mbaye',
      rating: 4.2,
      reviewCount: 8,
      avatarUrl: 'https://i.pravatar.cc/30?img=7',
    },
    condition: 'Neuf',
    deliveryAvailable: true,
  },
  {
    id: '8',
    title: 'Consultation juridique',
    description:
      'Avocat propose consultation juridique en droit des affaires et droit immobilier.',
    price: 'Gratuit',
    location: 'Dakar',
    postedAt: 'il y a 6 heures',
    imageUrl: 'https://picsum.photos/400/300?random=8',
    badges: ['pro'],
    isSponsored: false,
    seller: {
      name: 'Omar Sow',
      rating: 4.9,
      reviewCount: 40,
      avatarUrl: 'https://i.pravatar.cc/30?img=8',
    },
    condition: 'Neuf',
    deliveryAvailable: false,
  },
  {
    id: '9',
    title: 'Drone DJI Mini 2',
    description:
      'Drone DJI Mini 2 avec 2 batteries et accessoires, parfait état.',
    price: 400,
    location: 'Saint-Louis',
    postedAt: 'il y a 2 jours',
    imageUrl: 'https://picsum.photos/400/300?random=9',
    badges: ['delivery'],
    isSponsored: false,
    seller: {
      name: 'Aminata Fall',
      rating: 4.7,
      reviewCount: 22,
      avatarUrl: 'https://i.pravatar.cc/30?img=9',
    },
    condition: 'Occasion',
    deliveryAvailable: true,
  },
];

// Pagination component
function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="flex justify-center items-center space-x-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed
                 hover:bg-gray-50 transition-colors duration-200"
      >
        <ChevronLeft className="w-5 h-5 text-gray-600" />
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 rounded-lg border ${
            currentPage === page
              ? 'bg-[#EC5A12] text-white border-[#EC5A12]'
              : 'border-gray-300 hover:bg-gray-50 text-gray-700'
          } 
            transition-colors duration-200`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed
                 hover:bg-gray-50 transition-colors duration-200"
      >
        <ChevronRight className="w-5 h-5 text-gray-600" />
      </button>
    </div>
  );
}

// Main Listings Page component
export default function ListingsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const listingsPerPage = 5;

  // Calculate pagination
  const indexOfLastListing = currentPage * listingsPerPage;
  const indexOfFirstListing: number = indexOfLastListing - listingsPerPage;
  const currentListings = listings.slice(
    indexOfFirstListing,
    indexOfLastListing
  );
  const totalPages = Math.ceil(listings.length / listingsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <FilterBar />
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Annonces</h1>
          <div className="space-y-6 flex flex-col items-start">
            {currentListings.map((listing, index) => (
              <React.Fragment key={listing.id}>
                <div className="w-full md:w-3/4">
                  <ListingCard listing={listing} />
                  {index < currentListings.length - 1 && (
                    <div className="border-b border-gray-300 my-4 w-full" />
                  )}
                </div>
              </React.Fragment>
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
