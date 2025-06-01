'use client';

import { useRef } from 'react';
import Image from 'next/image';
import BaseLink from '@/components/ui/BaseLink';
import { useTopCategories } from '@/hooks/useTopCategories';

export default function TopCategories() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { categories, isLoading, error } = useTopCategories();

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const cardWidth = 256; // w-64 = 16rem = 256px
    const cardSpacing = 16; // space-x-4 = 1rem = 16px
    const scrollAmount = cardWidth + cardSpacing;
    const currentScroll = container.scrollLeft;
    const newPosition =
      direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount;

    container.scrollTo({
      left: newPosition,
      behavior: 'smooth',
    });
  };

  if (error) {
    return (
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="h2 mb-6">Top catégories</h2>
          <div className="text-center py-8">
            <p className="text-gray-500">Erreur lors du chargement des catégories</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="h2 mb-6">Top catégories</h2>

        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={() => scroll('left')}
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

          {/* Category Cards Container */}
          <div
            ref={scrollContainerRef}
            className="overflow-x-auto scrollbar-hide"
            style={{
              scrollBehavior: 'smooth',
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
            }}
          >
            <div className="flex space-x-4 pb-4">
              {isLoading ? (
                // Skeleton loading
                Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex-none w-64 relative overflow-hidden rounded-xl shadow-sm animate-pulse"
                  >
                    <div className="aspect-[4/3] bg-gray-200"></div>
                  </div>
                ))
              ) : (
                categories.map((category) => (
                  <BaseLink
                    key={category.id}
                    href={category.href}
                    className="flex-none w-64 relative overflow-hidden
                               rounded-xl shadow-sm group"
                  >
                    <div className="aspect-[4/3] relative">
                      <Image
                        src={`https://picsum.photos/800/600?category=${category.name.toLowerCase()}`}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform
                                   duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t
                                     from-black/60 to-transparent">
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <div className="flex items-center mb-2">
                            <span className="text-2xl mr-2">{category.icon}</span>
                            <h3 className="text-lg font-medium text-white">
                              {category.name}
                            </h3>
                          </div>
                          {category.annonceCount > 0 && (
                            <p className="text-sm text-white/80">
                              {category.annonceCount} annonce{category.annonceCount > 1 ? 's' : ''}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </BaseLink>
                ))
              )}
            </div>
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scroll('right')}
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
