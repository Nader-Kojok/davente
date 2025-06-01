"use client";

import { useRef } from "react";
import Image from "next/image";
import BaseLink from "@/components/ui/BaseLink";
import { Plus } from "lucide-react";
import { useRecentListings } from "@/hooks/useRecentListings";
import UnifiedListingCard, { UnifiedListing } from '@/components/ui/UnifiedListingCard';

export default function CurrentListings() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Récupérer les annonces récentes de la catégorie Électronique (ID 4)
  const { listings, isLoading, error } = useRecentListings({ 
    limit: 8, 
    categoryId: 4 // Électronique
  });

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Each card is w-80 (320px) plus space-x-4 (16px) => 336px total
    const cardWidth = 320;
    const cardSpacing = 16;
    const scrollAmount = cardWidth + cardSpacing;
    const currentScroll = container.scrollLeft;
    const newPosition =
      direction === "left"
        ? currentScroll - scrollAmount
        : currentScroll + scrollAmount;

    container.scrollTo({
      left: newPosition,
      behavior: "smooth",
    });
  };

  // Convertir les données pour correspondre au format attendu par UnifiedListingCard
  const convertToUnifiedFormat = (listing: any): UnifiedListing => ({
    id: listing.id.toString(),
    title: listing.title,
    description: listing.description || listing.title,
    price: listing.price,
    location: listing.location,
    imageUrl: listing.picture || `https://picsum.photos/400?random=${listing.id}`,
    postedAt: listing.createdAt,
    condition: listing.condition || 'Bon état',
    seller: {
      name: listing.user.name,
      avatarUrl: listing.user.picture || `https://i.pravatar.cc/150?u=${listing.user.name}`,
      rating: 4.5, // Valeur par défaut
      reviewCount: 12 // Valeur par défaut
    },
    badges: listing.subcategory ? [] : [], // Pas de badges pour l'instant
    isSponsored: false,
    deliveryAvailable: false
  });

  if (error) {
    return (
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="h2">En ce moment sur Grabi</h2>
              <p className="text-gray-600 mt-1">Téléphones & Objets connectés</p>
            </div>
          </div>
          <div className="text-center py-8">
            <p className="text-gray-500">Erreur lors du chargement des annonces</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="h2">En ce moment sur Grabi</h2>
            <p className="text-gray-600 mt-1">
              {listings.length > 0 && listings[0].subcategory 
                ? listings[0].subcategory.name 
                : "Téléphones & Objets connectés"}
            </p>
          </div>
          <BaseLink href="/categories/electronique">
            Voir plus d&apos;annonces
          </BaseLink>
        </div>

        {/* Listings Grid */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={() => scroll("left")}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10
                       bg-white/80 rounded-full p-2 shadow-md
                       hover:bg-white transition-colors duration-200
                       focus:outline-none focus:ring-2 focus:ring-[#E00201]"
            aria-label="Scroll left"
            disabled={isLoading}
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <div
            ref={scrollContainerRef}
            className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide"
            style={{
              scrollBehavior: "smooth",
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
          >
            {isLoading ? (
              // Skeleton loading
              Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="flex-none w-80 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse p-4"
                >
                  <div className="aspect-[4/3] bg-gray-200 rounded-xl mb-4"></div>
                  <div className="space-y-3 px-2">
                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="flex justify-between">
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                      <div className="h-3 bg-gray-200 rounded w-20"></div>
                    </div>
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                      <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <>
                {listings.map((listing) => (
                  <div
                    key={listing.id}
                    className="flex-none w-80 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200 p-4"
                  >
                    <UnifiedListingCard 
                      listing={convertToUnifiedFormat(listing)} 
                      variant="compact"
                      showSeller={true}
                    />
                  </div>
                ))}

                {/* 'Voir plus d'annonces' Card */}
                <BaseLink
                  href="/categories/electronique"
                  className="flex-none w-36 bg-gray-50 rounded-lg shadow-sm border border-gray-200
                             overflow-hidden flex flex-col items-center justify-center
                             p-6 text-center hover:bg-gray-100 transition-colors"
                >
                  <Plus className="w-10 h-10 text-[#E00201] mb-2" />
                  <span className="text-gray-900 font-medium">
                    Voir plus d&apos;annonces
                  </span>
                </BaseLink>
              </>
            )}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scroll("right")}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10
                       bg-white/80 rounded-full p-2 shadow-md
                       hover:bg-white transition-colors duration-200
                       focus:outline-none focus:ring-2 focus:ring-[#E00201]"
            aria-label="Scroll right"
            disabled={isLoading}
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
