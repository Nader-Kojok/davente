'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type Category = {
  title: string;
  image: string;
  href: string;
};

const categories: Category[] = [
  {
    title: 'Vêtements',
    image: 'https://picsum.photos/800/600?category=fashion',
    href: '/categories/vetements',
  },
  {
    title: 'Vacances',
    image: 'https://picsum.photos/800/600?category=travel',
    href: '/categories/vacances',
  },
  {
    title: 'Astuces Maison',
    image: 'https://picsum.photos/800/600?category=home',
    href: '/categories/maison',
  },
  {
    title: "Offres d'emploi",
    image: 'https://picsum.photos/800/600?category=business',
    href: '/categories/emploi',
  },
  {
    title: 'Ventes immo',
    image: 'https://picsum.photos/800/600?category=architecture',
    href: '/categories/immobilier',
  },
  {
    title: 'Loisirs',
    image: 'https://picsum.photos/800/600?category=leisure',
    href: '/categories/loisirs',
  },
];

export default function TopCategories() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Top catégories</h2>

        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={() => scroll('left')}
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
              {categories.map((category) => (
                <Link
                  key={category.title}
                  href={category.href}
                  className="flex-none w-64 relative overflow-hidden 
                             rounded-xl shadow-sm group"
                >
                  <div className="aspect-[4/3] relative">
                    <Image
                      src={category.image}
                      alt={category.title}
                      fill
                      className="object-cover transition-transform 
                                 duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t 
                                   from-black/60 to-transparent">
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-lg font-medium text-white">
                          {category.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
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
