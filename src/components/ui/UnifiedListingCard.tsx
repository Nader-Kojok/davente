'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Clock, Star, Eye, Shield, Zap, Package } from 'lucide-react';
import { getRelativeTime } from '@/lib/utils/formatDate';
import BookmarkButton from '@/components/ui/BookmarkButton';

interface Seller {
  name: string;
  avatarUrl: string;
  rating: number;
  reviewCount?: number;
}

interface UnifiedListing {
  id: string;
  title: string;
  description?: string;
  price: number | 'Gratuit';
  location: string;
  imageUrl: string;
  postedAt: string;
  condition?: string;
  seller: Seller;
  badges?: string[];
  isSponsored?: boolean;
  deliveryAvailable?: boolean;
}

interface UnifiedListingCardProps {
  listing: UnifiedListing;
  variant?: 'grid' | 'horizontal' | 'compact';
  showSeller?: boolean;
  className?: string;
}

const UnifiedListingCard: React.FC<UnifiedListingCardProps> = ({ 
  listing, 
  variant = 'grid',
  showSeller = true,
  className = ''
}) => {
  const formatPrice = (price: number | 'Gratuit') => {
    if (price === 'Gratuit') return 'Gratuit';
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  const getBadgeConfig = (badge: string) => {
    switch (badge) {
      case 'pro':
        return { icon: Shield, color: 'bg-blue-500 text-white shadow-sm', label: 'Pro' };
      case 'urgent':
        return { icon: Zap, color: 'bg-red-500 text-white shadow-sm', label: 'Urgent' };
      case 'delivery':
        return { icon: Package, color: 'bg-green-500 text-white shadow-sm', label: 'Livraison' };
      default:
        return null;
    }
  };

  const getFormattedTime = (postedAt: string) => {
    if (postedAt.includes('il y a') || postedAt.includes('maintenant') || postedAt.includes('à l\'instant')) {
      return postedAt;
    }
    
    try {
      const date = new Date(postedAt);
      return getRelativeTime(date);
    } catch {
      return postedAt;
    }
  };

  const renderBadges = () => {
    if (!listing.badges || listing.badges.length === 0) return null;
    
    return (
      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
        {listing.badges.slice(0, 2).map((badge, index) => {
          const badgeConfig = getBadgeConfig(badge);
          if (!badgeConfig) return null;
          
          const { icon: Icon, color, label } = badgeConfig;
          return (
            <span
              key={index}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold ${color} backdrop-blur-sm`}
            >
              <Icon className="w-3 h-3" />
              {label}
            </span>
          );
        })}
      </div>
    );
  };

  const renderSellerInfo = () => {
    if (!showSeller) return null;

    return (
      <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
        <div className="relative">
          <Image
            src={listing.seller.avatarUrl}
            alt={listing.seller.name}
            width={32}
            height={32}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-100"
          />
          {listing.seller.rating > 4 && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
              <Star className="w-2.5 h-2.5 text-white fill-current" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">
            {listing.seller.name}
          </p>
          {listing.seller.rating > 0 && (
            <div className="flex items-center gap-1.5 mt-1">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < Math.floor(listing.seller.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-medium text-gray-600">
                {listing.seller.rating.toFixed(1)} ({listing.seller.reviewCount || 0})
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Variante compacte (pour CurrentListings)
  if (variant === 'compact') {
    return (
      <Link href={`/annonce/${listing.id}`} className={`block h-full ${className}`}>
        <div className="group cursor-pointer h-full">
          {/* Image Container */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gray-100 mb-4 shadow-sm">
            <Image
              src={listing.imageUrl}
              alt={listing.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            
            {renderBadges()}

            {/* Bookmark Button */}
            <div className="absolute top-3 right-3">
              <BookmarkButton
                annonceId={parseInt(listing.id)}
                size="sm"
                variant="default"
              />
            </div>

            {/* Sponsored Badge */}
            {listing.isSponsored && (
              <div className="absolute bottom-3 left-3">
                <span className="bg-yellow-400 text-yellow-900 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm backdrop-blur-sm">
                  Sponsorisé
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="space-y-3 px-2">
            {/* Price */}
            <div className="flex items-center justify-between">
              <p className="text-lg font-bold text-gray-900 tracking-tight">
                {formatPrice(listing.price)}
              </p>
              {listing.deliveryAvailable && (
                <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
                  <Package className="w-3 h-3 text-green-600" />
                  <span className="text-xs font-medium text-green-700">Livraison</span>
                </div>
              )}
            </div>

            {/* Title */}
            <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm leading-snug group-hover:text-[#E00201] transition-colors duration-200">
              {listing.title}
            </h3>

            {/* Location and Time */}
            <div className="flex items-center justify-between text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-gray-400" />
                <span className="truncate font-medium">{listing.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-gray-400" />
                <span>{getFormattedTime(listing.postedAt)}</span>
              </div>
            </div>

            {showSeller && renderSellerInfo()}
          </div>
        </div>
      </Link>
    );
  }

  // Variante horizontale (pour ListingCard)
  if (variant === 'horizontal') {
    return (
      <div className={`group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-gray-200 ${className}`}>
        <Link href={`/annonce/${listing.id}`} className="block p-6">
          <div className="flex flex-col lg:flex-row lg:gap-6">
            {/* Left Column - Image */}
            <div className="w-full lg:w-auto lg:flex-shrink-0">
              <div className="relative w-full lg:w-60 aspect-[4/3] rounded-xl overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <Image
                  src={listing.imageUrl}
                  alt={listing.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                
                {renderBadges()}

                {/* Bookmark Button */}
                <div className="absolute top-3 right-3">
                  <BookmarkButton
                    annonceId={parseInt(listing.id)}
                    size="sm"
                    variant="default"
                  />
                </div>

                {listing.isSponsored && (
                  <div className="absolute bottom-3 left-3">
                    <span className="bg-yellow-400 text-yellow-900 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm backdrop-blur-sm">
                      Sponsorisé
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Right Column - Details */}
            <div className="flex-1 mt-6 lg:mt-0">
              <div className="flex flex-col justify-between h-full py-2">
                <div className="space-y-4">
                  {/* Title and Price */}
                  <div className="space-y-2">
                    <h2 className="text-xl font-bold text-gray-900 group-hover:text-[#E00201] transition-colors duration-300 leading-tight">
                      {listing.title}
                    </h2>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-gray-900 tracking-tight">
                        {formatPrice(listing.price)}
                      </span>
                      {listing.condition && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                          {listing.condition}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  {listing.description && (
                    <div className="space-y-2">
                      <p className="text-gray-700 leading-relaxed line-clamp-3">
                        {listing.description}
                      </p>
                    </div>
                  )}

                  {/* Meta Information */}
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>{getFormattedTime(listing.postedAt)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">{listing.location}</span>
                    </div>
                  </div>
                </div>

                {showSeller && renderSellerInfo()}
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  }

  // Variante grille par défaut (pour ListingCardGrid)
  return (
    <Link href={`/annonce/${listing.id}`} className={`block h-full ${className}`}>
      <div className="group cursor-pointer h-full">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gray-100 mb-5 shadow-sm">
          <Image
            src={listing.imageUrl}
            alt={listing.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {renderBadges()}

          {/* Bookmark Button */}
          <div className="absolute top-3 right-3">
            <BookmarkButton
              annonceId={parseInt(listing.id)}
              size="sm"
              variant="default"
            />
          </div>

          {/* Sponsored Badge */}
          {listing.isSponsored && (
            <div className="absolute bottom-3 left-3">
              <span className="bg-yellow-400 text-yellow-900 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm backdrop-blur-sm">
                Sponsorisé
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-4 px-2">
          {/* Price */}
          <div className="flex items-center justify-between">
            <p className="text-xl font-bold text-gray-900 tracking-tight">
              {formatPrice(listing.price)}
            </p>
            {listing.deliveryAvailable && (
              <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
                <Package className="w-3.5 h-3.5 text-green-600" />
                <span className="text-xs font-medium text-green-700">Livraison</span>
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="font-semibold text-gray-900 line-clamp-2 text-base leading-snug group-hover:text-[#E00201] transition-colors duration-200 mb-3">
            {listing.title}
          </h3>

          {/* Location and Time */}
          <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="truncate font-medium">{listing.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-xs">{getFormattedTime(listing.postedAt)}</span>
            </div>
          </div>

          {showSeller && renderSellerInfo()}
        </div>
      </div>
    </Link>
  );
};

export default UnifiedListingCard;
export type { UnifiedListing, UnifiedListingCardProps }; 