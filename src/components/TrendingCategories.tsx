'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Flame } from 'lucide-react';

type TrendingCategory = {
  title: string;
  image: string;
  href: string;
};

const trendingCategories: TrendingCategory[] = [
  {
    title: 'Immobilier',
    image: 'https://picsum.photos/800/1200?category=architecture',
    href: '/categories/immobilier',
  },
  {
    title: 'Véhicules',
    image: 'https://picsum.photos/800/1200?category=cars',
    href: '/categories/vehicules',
  },
  {
    title: 'Électronique',
    image: 'https://picsum.photos/800/1200?category=tech',
    href: '/categories/electronique',
  },
  {
    title: 'Mode',
    image: 'https://picsum.photos/800/1200?category=fashion',
    href: '/categories/mode',
  },
];

export default function TrendingCategories() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const cardWidth = 280; // Card width + gap
    const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;

    container.scrollBy({
      left: scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="relative">
          {/* Mobile Scroll Buttons */}
          <div className="lg:hidden">
            <button
              onClick={() => scroll('left')}
              className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#E00201]"
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
            <button
              onClick={() => scroll('right')}
              className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#E00201]"
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

          {/* Container */}
          <div
            ref={scrollContainerRef}
            className="flex lg:grid lg:grid-cols-5 gap-4 overflow-x-auto scrollbar-hide lg:overflow-visible"
            style={{
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
              scrollBehavior: 'smooth',
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
            }}
          >
            {/* Title Card */}
            <div className="flex-none w-[280px] lg:w-auto relative overflow-hidden rounded-2xl shadow-sm bg-gradient-to-bl from-[#FFEECD] to-[#F7D8D5] aspect-[3/4] p-6 scroll-snap-align-start">
              <div className="flex flex-col">
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  Tendance en ce moment
                </h2>
                <Flame className="w-6 h-6 text-[#152233]" />
              </div>
            </div>

            {/* Category Cards */}
            {trendingCategories.map((category) => (
              <Link
                key={category.title}
                href={category.href}
                className="flex-none w-[280px] lg:w-auto group relative overflow-hidden rounded-2xl shadow-sm aspect-[3/4] bg-gray-100 scroll-snap-align-start"
              >
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-lg font-medium text-white">
                      {category.title}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
