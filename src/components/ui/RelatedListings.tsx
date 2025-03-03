'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface RelatedListing {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  condition: string;
  seller: {
    name: string;
    avatarUrl: string;
  };
}

interface RelatedListingsProps {
  listings: RelatedListing[];
  currentListingId: string;
}

export default function RelatedListings({ listings, currentListingId }: RelatedListingsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const cardWidth = 280;
    const cardSpacing = 16;
    const scrollAmount = cardWidth + cardSpacing;
    const currentScroll = container.scrollLeft;
    const newPosition =
      direction === 'left'
        ? currentScroll - scrollAmount
        : currentScroll + scrollAmount;

    container.scrollTo({
      left: newPosition,
      behavior: 'smooth',
    });
  };

  const filteredListings = listings.filter(listing => listing.id !== currentListingId);

  if (filteredListings.length === 0) return null;

  return (
    <section className="mt-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Annonces similaires</h2>
        
        <div className="relative">
          {/* Left scroll button */}
          <button
            onClick={() => scroll('left')}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 
                     bg-white/80 rounded-full p-2 shadow-md 
                     hover:bg-white transition-colors duration-200 
                     focus:outline-none focus:ring-2 focus:ring-[#EC5A12]"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>

          {/* Listings container */}
          <div
            ref={scrollContainerRef}
            className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide"
            style={{
              scrollBehavior: 'smooth',
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
            }}
          >
            {filteredListings.map((listing) => (
              <div
                key={listing.id}
                className="flex-none w-[280px] bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                {/* Seller info */}
                <div className="p-3 flex items-center space-x-2 border-b border-gray-100">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                    <Image
                      src={listing.seller.avatarUrl}
                      alt={listing.seller.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="font-medium text-sm text-gray-900">
                    {listing.seller.name}
                  </span>
                </div>

                {/* Product image */}
                <Link href={`/annonces/${listing.id}`}>
                  <div className="relative aspect-square">
                    <Image
                      src={listing.imageUrl}
                      alt={listing.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Product info */}
                  <div className="p-3">
                    <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">
                      {listing.title}
                    </h3>
                    <div className="flex items-baseline space-x-2">
                      <p className="text-lg font-semibold text-gray-900">
                        {listing.price.toLocaleString()} €
                      </p>
                      {listing.originalPrice && (
                        <p className="text-sm text-gray-500 line-through">
                          {listing.originalPrice.toLocaleString()} €
                        </p>
                      )}
                    </div>
                    {listing.condition && (
                      <p className="text-sm text-gray-600 mt-1">{listing.condition}</p>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Right scroll button */}
          <button
            onClick={() => scroll('right')}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 
                     bg-white/80 rounded-full p-2 shadow-md 
                     hover:bg-white transition-colors duration-200 
                     focus:outline-none focus:ring-2 focus:ring-[#EC5A12]"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>
    </section>
  );
}