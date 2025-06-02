// src/components/TrendingCategories.tsx
'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Flame, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useTrendingData } from '@/hooks/useTrendingData';

export default function TrendingCategories() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { getTopTrendingCategories, trackCategoryInteraction, isLoading } = useTrendingData();
  
  const trendingCategories = getTopTrendingCategories(4);

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

  const handleCategoryClick = (category: any) => {
    trackCategoryInteraction(category.slug);
    router.push(category.href);
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return 'text-green-500';
      case 'down':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const formatPercentage = (percentage: number) => {
    return Math.round(percentage);
  };

  // Don't render if no trending categories
  if (trendingCategories.length === 0) {
    return (
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <Flame className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune tendance détectée</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Les tendances apparaîtront ici en fonction de l'activité des utilisateurs et des recherches populaires.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="relative">
          {/* Left Arrow - Hidden on mobile */}
          <button
            onClick={() => scroll('left')}
            className="hidden lg:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10
                       bg-white/80 rounded-full p-2 shadow-md
                       hover:bg-white transition-colors duration-200
                       focus:outline-none focus:ring-2 focus:ring-[#E00201]
                       items-center justify-center"
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
              <div className="flex flex-col justify-between h-full">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Tendance en ce moment
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Découvrez les catégories les plus recherchées
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <Flame className="w-8 h-8 text-[#E00201]" />
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Mis à jour</p>
                    <p className="text-xs text-gray-500">en temps réel</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Cards */}
            {trendingCategories.map((category, index) => (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category)}
                className="flex-none w-[280px] lg:w-auto group relative overflow-hidden rounded-2xl shadow-sm aspect-[3/4] bg-gray-100 scroll-snap-align-start cursor-pointer"
              >
                <Image
                  src={`https://picsum.photos/800/1200?category=${category.name.toLowerCase()}&random=${category.id}`}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
                  {/* Trending Badge */}
                  <div className="absolute top-4 right-4">
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                      category.trend === 'up' ? 'bg-green-500/90 text-white' :
                      category.trend === 'down' ? 'bg-red-500/90 text-white' :
                      'bg-gray-500/90 text-white'
                    }`}>
                      {getTrendIcon(category.trend)}
                      <span>{formatPercentage(category.trendPercentage)}%</span>
                    </div>
                  </div>

                  {/* Category Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-3xl">{category.icon}</span>
                      <div className="text-right">
                        <p className="text-xs text-gray-300">#{index + 1} Tendance</p>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {category.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-300">
                        {category.searchCount} recherches
                      </p>
                      <div className={`flex items-center space-x-1 text-xs ${getTrendColor(category.trend)}`}>
                        {getTrendIcon(category.trend)}
                        <span className="font-medium">
                          {category.trend === 'up' ? 'En hausse' : 
                           category.trend === 'down' ? 'En baisse' : 'Stable'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow - Hidden on mobile */}
          <button
            onClick={() => scroll('right')}
            className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10
                       bg-white/80 rounded-full p-2 shadow-md
                       hover:bg-white transition-colors duration-200
                       focus:outline-none focus:ring-2 focus:ring-[#E00201]
                       items-center justify-center"
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

        {/* Trending Summary */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Basé sur {trendingCategories.reduce((sum, cat) => sum + cat.searchCount, 0)} recherches récentes
          </p>
        </div>
      </div>
    </section>
  );
}
