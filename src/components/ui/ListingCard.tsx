// ListingCard.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Heart, Star } from 'lucide-react';
import { useState } from 'react';

export const ListingBadgeTypes = [
  'new',
  'pro',
  'verified',
  'urgent',
  'delivery',
] as const;
export type ListingBadge = typeof ListingBadgeTypes[number];

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

const SellerInfo = ({ seller }: { seller: Listing['seller'] }) => (
  <div className="flex items-center space-x-2 mb-2">
    <div className="relative w-6 h-6 rounded-full overflow-hidden">
      <Image
        src={seller.avatarUrl}
        alt={seller.name}
        fill
        sizes="24px"
        className="object-cover"
      />
    </div>
    <span className="text-sm font-medium text-gray-800">{seller.name}</span>
    <div className="flex items-center text-sm text-gray-600">
      <Star className="w-4 h-4 mr-1 text-yellow-500 fill-yellow-500" />
      <span>
        {seller.rating} ({seller.reviewCount})
      </span>
    </div>
  </div>
);

const ListingImage = ({ listing }: { listing: Listing }) => {
  const badgesToDisplay = listing.badges.filter((badge) =>
    ['pro', 'urgent'].includes(badge),
  );

  return (
    <div className="relative w-full sm:w-[180px] md:w-[200px] aspect-[3/4] rounded-lg overflow-hidden shadow-md">
      <Image
        src={listing.imageUrl}
        alt={listing.title}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 220px, 240px"
        className="object-cover transition-transform duration-300"
      />
      <div className="absolute top-2 left-2 flex space-x-1">
        {badgesToDisplay.map((badge) => {
          let bgColor = '';
          let text = '';

          if (badge === 'pro') {
            bgColor = 'purple-600';
            text = 'À la une';
          } else if (badge === 'urgent') {
            bgColor = 'red-600';
            text = 'Urgent';
          }

          return (
            <div
              key={badge}
              className={`bg-${bgColor} text-white px-2 py-1 text-xs rounded`}
            >
              {text}
            </div>
          );
        })}
      </div>
      <button
        className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-md hover:bg-gray-100 transition-colors"
        aria-label="Add to favorites"
      >
        <Heart className="w-4 h-4 text-gray-500" />
      </button>
    </div>
  );
};

const ListingDetails = ({ listing }: { listing: Listing }) => {
  const [expanded, setExpanded] = useState(false);
  const descriptionLength = 150; // Increased length
  const shortDescription = listing.description.substring(
    0,
    descriptionLength,
  );
  const showMore = listing.description.length > descriptionLength;

  return (
    <div className="relative flex flex-col justify-between h-full mt-6">
      <div>
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-[#EC5A12] transition-all duration-300 mb-2">
          {listing.title}
        </h2>
        <p className="text-sm text-gray-700 mb-3">
          {expanded ? listing.description : shortDescription}
          {showMore && !expanded && '...'}
          {showMore && (
            <button
              className="text-blue-500 ml-1 focus:outline-none"
              onClick={(e) => {
                e.preventDefault(); // Prevent link navigation
                setExpanded(!expanded);
              }}
            >
              {expanded ? 'Voir moins' : 'Voir plus'}
            </button>
          )}
        </p>
        <div className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
          {typeof listing.price === 'number'
            ? `${listing.price.toLocaleString()} €`
            : listing.price}
          {listing.condition && (
            <span className="text-sm font-normal text-gray-600 ml-1">
              • {listing.condition}
            </span>
          )}
        </div>
        <div className="text-xs text-gray-500 mb-3">
          Posté {listing.postedAt}
        </div>
      </div>

      {/* Bottom section with address and delivery badge stacked vertically */}
      <div className="mt-auto">
        <div className="flex flex-col space-y-3">
          <div className="flex items-center text-xs sm:text-sm text-gray-600">
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            <span className="truncate">{listing.location}</span>
          </div>
          {(listing.badges.includes('delivery') ||
            listing.deliveryAvailable) && (
            <div className="text-blue-800 text-xs sm:text-sm font-medium">
              <span className="bg-blue-50 rounded-full px-3 py-1 inline-block">
                Livraison possible
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Link
      href={`/annonces/${listing.id}`}
      className="group block w-full max-w-4xl transition-transform" // Reduced width here
    >
      <div className="flex flex-col sm:flex-row sm:space-x-4">
        <div className="w-full sm:w-auto sm:flex-shrink-0">
          <SellerInfo seller={listing.seller} />
          <ListingImage listing={listing} />
        </div>
        {/* Use flex-grow and min-h-full to force the details section to take up the full height */}
        <div className="flex-1 flex flex-col">
          <ListingDetails listing={listing} />
        </div>
      </div>
    </Link>
  );
}
