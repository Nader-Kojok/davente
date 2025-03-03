"use client";

import { useRef } from "react";
import Image from "next/image";
import BaseLink from "@/components/ui/BaseLink"; // Import BaseLink
import { Plus } from "lucide-react";

type Listing = {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  title: string;
  price: number;
  image: string;
  location: string;
  features: string[];
};

const currentListings: Listing[] = [
  {
    id: "1",
    user: { name: "Dimi", avatar: "https://i.pravatar.cc/150?u=dimi" },
    title: "Samsung galaxy s23 lavande",
    price: 280000,
    image: "https://picsum.photos/400?random=1",
    location: "Dakar",
    features: ["Livraison possible"],
  },
  {
    id: "2",
    user: { name: "TechPro", avatar: "https://i.pravatar.cc/150?u=techpro" },
    title: "iPhone 14 Pro Max",
    price: 899000,
    image: "https://picsum.photos/400?random=2",
    location: "Thiès",
    features: ["Pro", "Livraison possible"],
  },
  {
    id: "3",
    user: { name: "MobileShop", avatar: "https://i.pravatar.cc/150?u=mobileshop" },
    title: "AirPods Pro 2ème gen",
    price: 199000,
    image: "https://picsum.photos/400?random=3",
    location: "Saint-Louis",
    features: ["Pro"],
  },
  {
    id: "4",
    user: { name: "SmartGear", avatar: "https://i.pravatar.cc/150?u=smartgear" },
    title: "Apple Watch Series 8",
    price: 450000,
    image: "https://picsum.photos/400?random=4",
    location: "Dakar",
    features: ["Livraison possible"],
  },
  {
    id: "5",
    user: { name: "GadgetHub", avatar: "https://i.pravatar.cc/150?u=gadgethub" },
    title: 'MacBook Pro M2 13"',
    price: 1299000,
    image: "https://picsum.photos/400?random=5",
    location: "Dakar",
    features: ["Pro", "Livraison possible"],
  },
  {
    id: "6",
    user: { name: "ElectroShop", avatar: "https://i.pravatar.cc/150?u=electroshop" },
    title: "iPad Air 5ème gen",
    price: 599000,
    image: "https://picsum.photos/400?random=6",
    location: "Thiès",
    features: ["Livraison possible"],
  },
  {
    id: "7",
    user: { name: "TechZone", avatar: "https://i.pravatar.cc/150?u=techzone" },
    title: "Samsung Galaxy Tab S9",
    price: 749000,
    image: "https://picsum.photos/400?random=7",
    location: "Dakar",
    features: ["Pro", "Livraison possible"],
  },
  {
    id: "8",
    user: { name: "DigitalStore", avatar: "https://i.pravatar.cc/150?u=digitalstore" },
    title: "Google Pixel 7 Pro",
    price: 699000,
    image: "https://picsum.photos/400?random=8",
    location: "Saint-Louis",
    features: ["Pro"],
  },
];

export default function CurrentListings() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Each card is w-72 (288px) plus space-x-4 (16px) => 304px total
    const cardWidth = 288;
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

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="h2">En ce moment sur davente</h2> {/* Use base heading style */}
            <p className="text-gray-600 mt-1">Téléphones & Objets connectés</p>
          </div>
          <BaseLink // Use BaseLink
            href="/categories/electronique"
          >
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
            {currentListings.map((listing) => (
              <div
                key={listing.id}
                className="flex-none w-72 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                {/* User Info */}
                <div className="p-3 flex items-center space-x-2 border-b border-gray-100">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                    <Image
                      src={listing.user.avatar}
                      alt={listing.user.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="font-medium text-sm text-gray-900">
                    {listing.user.name}
                  </span>
                </div>

                {/* Product Image */}
                <div className="relative aspect-square">
                  <Image
                    src={listing.image}
                    alt={listing.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Product Info */}
                <div className="p-3">
                  <h3 className="font-medium text-gray-900 mb-1">
                    {listing.title}
                  </h3>
                  <p className="text-lg font-semibold text-gray-900 mb-2">
                    {listing.price.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} F
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{listing.location}</span>
                    <div className="flex gap-2">
                      {listing.features.map((feature, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 rounded-full text-xs"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* 'Voir plus d'annonces' Card */}
            <BaseLink // Use BaseLink
              href="/categories/electronique"
              className="flex-none w-36 bg-gray-50 rounded-lg shadow-sm border border-gray-200
                         overflow-hidden flex flex-col items-center justify-center
                         p-6 text-center"
            >
              <Plus className="w-10 h-10 text-[#E00201] mb-2" />
              <span className="text-gray-900 font-medium">
                Voir plus d&apos;annonces
              </span>
            </BaseLink>
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scroll("right")}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10
                       bg-white/80 rounded-full p-2 shadow-md
                       hover:bg-white transition-colors duration-200
                       focus:outline-none focus:ring-2 focus:ring-[#E00201]"
            aria-label="Scroll right"
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
