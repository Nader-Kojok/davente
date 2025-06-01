'use client';

import React from 'react';
import { Listing } from '@/app/annonces/page';
import UnifiedListingCard, { UnifiedListing } from '@/components/ui/UnifiedListingCard';

interface ListingCardGridProps {
  listing: Listing;
}

const ListingCardGrid: React.FC<ListingCardGridProps> = ({ listing }) => {
  // Convertir les données pour correspondre au format attendu par UnifiedListingCard
  const convertToUnifiedFormat = (listing: Listing): UnifiedListing => ({
    id: listing.id,
    title: listing.title,
    description: listing.description || listing.title,
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
      variant="grid"
      showSeller={true}
    />
  );
};

export default ListingCardGrid; 