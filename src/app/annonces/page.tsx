'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/ui/Footer';
import FilterBar from '@/components/ui/FilterBar';
import Badge, { ListingBadge } from '@/components/ui/Badge';

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
}

// Example data (in a real app, this would come from an API)
const listings: Listing[] = [
  {
    id: '1',
    title: 'Location mini pelle 2.5t',
    description: 'Mini pelle disponible pour location. Idéale pour travaux de jardinage et petits chantiers.',
    price: 200,
    location: 'Dakar',
    postedAt: 'il y a 2 jours',
    imageUrl: 'https://picsum.photos/400/300?random=1',
    badges: ['pro', 'delivery'],
    isSponsored: true
  },
  {
    id: '2',
    title: 'Échiquier voyage magnétique',
    description: 'Jeu d\'échecs de voyage compact avec pièces magnétiques. Parfait état.',
    price: 30,
    location: 'Saint-Louis',
    postedAt: 'il y a 3 heures',
    imageUrl: 'https://picsum.photos/400/300?random=2',
    badges: ['delivery']
  },
  {
    id: '3',
    title: 'Ravalement Façade - Artisan Qualifié',
    description: 'Service professionnel de ravalement de façade. Devis gratuit.',
    price: 'Gratuit',
    location: 'Thiès',
    postedAt: 'il y a 1 jour',
    imageUrl: 'https://picsum.photos/400/300?random=3',
    badges: ['pro', 'urgent']
  },
  {
    id: '4',
    title: 'Vélo électrique Citadin',
    description: 'Vélo électrique urbain, autonomie 60km, excellent état, peu utilisé.',
    price: 800,
    location: 'Dakar',
    postedAt: 'il y a 5 heures',
    imageUrl: 'https://picsum.photos/400/300?random=4',
    badges: ['delivery']
  },
  {
    id: '5',
    title: 'Cours de cuisine traditionnelle',
    description: 'Chef expérimenté propose des cours de cuisine sénégalaise traditionnelle.',
    price: 50,
    location: 'Saint-Louis',
    postedAt: 'il y a 1 jour',
    imageUrl: 'https://picsum.photos/400/300?random=5',
    badges: ['pro']
  },
  {
    id: '6',
    title: 'iPhone 13 Pro - 256GB',
    description: 'iPhone 13 Pro en parfait état, débloqué tout opérateur, avec facture et accessoires.',
    price: 600,
    location: 'Dakar',
    postedAt: 'il y a 4 heures',
    imageUrl: 'https://picsum.photos/400/300?random=6',
    badges: ['urgent'],
    isSponsored: true
  },
  {
    id: '7',
    title: 'Table de massage pliable',
    description: 'Table de massage professionnelle pliable, avec housse de transport.',
    price: 150,
    location: 'Thiès',
    postedAt: 'il y a 3 jours',
    imageUrl: 'https://picsum.photos/400/300?random=7',
    badges: ['pro', 'delivery']
  },
  {
    id: '8',
    title: 'Consultation juridique',
    description: 'Avocat propose consultation juridique en droit des affaires et droit immobilier.',
    price: 'Gratuit',
    location: 'Dakar',
    postedAt: 'il y a 6 heures',
    imageUrl: 'https://picsum.photos/400/300?random=8',
    badges: ['pro']
  },
  {
    id: '9',
    title: 'Drone DJI Mini 2',
    description: 'Drone DJI Mini 2 avec 2 batteries et accessoires, parfait état.',
    price: 400,
    location: 'Saint-Louis',
    postedAt: 'il y a 2 jours',
    imageUrl: 'https://picsum.photos/400/300?random=9',
    badges: ['delivery']
  }
];

// ListingCard component
function ListingCard({ listing }: { listing: Listing }) {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden 
      ${listing.isSponsored ? 'ring-2 ring-[#EC5A12] ring-opacity-50' : ''}`}>
      <Link href={`/annonces/${listing.id}`} className="flex flex-col sm:flex-row group">
        {/* Image container */}
        <div className="relative w-full sm:w-40 h-52">
          <Image
            src={listing.imageUrl}
            alt={listing.title}
            fill
            className="object-cover transition-transform duration-300"
          />
          {listing.isSponsored && (
            <div className="absolute top-2 left-2 bg-[#EC5A12] text-white px-2 py-1 text-xs rounded">
              Sponsorisé
            </div>
          )}
        </div>

        {/* Content container */}
        <div className="p-5 flex-1">
          <div className="flex flex-wrap gap-2 mb-2">
            {listing.badges.map((badge) => (
              <Badge key={badge} type={badge} />
            ))}
          </div>

          <h2 className="text-xl font-semibold text-gray-900 group-hover:text-[#EC5A12] 
            transition-colors duration-200 mb-2">
            {listing.title}
          </h2>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {listing.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center text-gray-500 text-sm">
                <MapPin className="w-4 h-4 mr-1" />
                {listing.location}
              </div>
              <div className="flex items-center text-gray-500 text-sm">
                <Clock className="w-4 h-4 mr-1" />
                {listing.postedAt}
              </div>
            </div>
            <div className="text-xl font-bold text-[#EC5A12]">
              {typeof listing.price === 'number' ? `${listing.price} €` : listing.price}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

// Pagination component
function Pagination({ currentPage, totalPages, onPageChange }: {
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
          className={`px-4 py-2 rounded-lg border ${currentPage === page
            ? 'bg-[#EC5A12] text-white border-[#EC5A12]'
            : 'border-gray-300 hover:bg-gray-50 text-gray-700'} 
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
  const indexOfFirstListing = indexOfLastListing - listingsPerPage;
  const currentListings = listings.slice(indexOfFirstListing, indexOfLastListing);
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
          <div className="space-y-6">
            {currentListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
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