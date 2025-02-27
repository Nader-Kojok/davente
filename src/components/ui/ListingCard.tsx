'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Heart, Star } from 'lucide-react';

export const ListingBadgeTypes = ['new', 'pro', 'verified', 'urgent', 'delivery'] as const;
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

const ListingImage = ({ listing }: { listing: Listing }) => (
  <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-md w-full">
    <Image
      src={listing.imageUrl}
      alt={listing.title}
      fill
      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
      className="object-cover transition-transform duration-300"
    />
    {listing.badges.includes('pro') && (
      <div className="absolute top-2 left-2 bg-purple-600 text-white px-2 py-1 text-xs rounded">
        À la une
      </div>
    )}
    {listing.badges.includes('urgent') && (
      <div className="absolute top-2 left-[72px] bg-red-600 text-white px-2 py-1 text-xs rounded">
        Urgent
      </div>
    )}
    <button
      className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-md hover:bg-gray-100 transition-colors"
      aria-label="Add to favorites"
    >
      <Heart className="w-4 h-4 text-gray-500" />
    </button>
  </div>
);

const ListingDetails = ({ listing }: { listing: Listing }) => (
  <div className="flex flex-col justify-between h-full">
    <div>
      <h2 className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-[#EC5A12] transition-all duration-300 mb-2">
        {listing.title}
      </h2>
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
    </div>

    <div className="space-y-2">
      {listing.badges.includes('delivery') || listing.deliveryAvailable ? (
        <div className="bg-blue-50 rounded-full px-2 py-0.5 text-xs sm:text-sm font-medium text-blue-800 inline-block">
          Livraison possible
        </div>
      ) : null}
      <div className="flex items-center space-x-1 text-xs sm:text-sm text-gray-600">
        <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
        <span className="truncate">{listing.location}</span>
      </div>
    </div>
  </div>
);

export default function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Link
      href={`/annonces/${listing.id}`}
      className="group block w-full transition-transform"
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-4">
        <div className="w-full sm:w-auto sm:flex-shrink-0 sm:max-w-[220px] md:max-w-[240px]">
          <SellerInfo seller={listing.seller} />
          <ListingImage listing={listing} />
        </div>
        <div className="flex-1 mt-2 sm:mt-6">
          <ListingDetails listing={listing} />
        </div>
      </div>
    </Link>
  );
}
