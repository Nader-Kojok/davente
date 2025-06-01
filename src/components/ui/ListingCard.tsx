// ListingCard.tsx
'use client';

import React from 'react';
import UnifiedListingCard, { UnifiedListing } from '@/components/ui/UnifiedListingCard';

export const ListingBadgeTypes = [
  'new',
  'pro',
  'verified',
  'urgent',
  'delivery',
] as const;

export type ListingBadge = typeof ListingBadgeTypes[number];

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number | 'Gratuit';
  location: string;
  imageUrl: string;
  postedAt: string;
  condition?: string;
  badges: ListingBadge[];
  isSponsored?: boolean;
  deliveryAvailable?: boolean;
  seller: {
    name: string;
    avatarUrl: string;
    rating: number;
    reviewCount: number;
  };
}

export default function ListingCard({ listing }: { listing: Listing }) {
  // Convertir les données pour correspondre au format attendu par UnifiedListingCard
  const convertToUnifiedFormat = (listing: Listing): UnifiedListing => ({
    id: listing.id,
    title: listing.title,
    description: listing.description,
    price: listing.price,
    location: listing.location,
    imageUrl: listing.imageUrl,
    postedAt: listing.postedAt,
    condition: listing.condition,
    seller: {
      name: listing.seller.name,
      avatarUrl: listing.seller.avatarUrl,
      rating: listing.seller.rating,
      reviewCount: listing.seller.reviewCount
    },
    badges: listing.badges || [],
    isSponsored: listing.isSponsored || false,
    deliveryAvailable: listing.deliveryAvailable || false
  });

  return (
    <UnifiedListingCard 
      listing={convertToUnifiedFormat(listing)} 
      variant="horizontal"
      showSeller={true}
    />
  );
}
