'use client';

import { useRouter } from 'next/navigation';
import { TrendingUp, TrendingDown, Minus, Search, Flame } from 'lucide-react';
import { useTrendingData } from '@/hooks/useTrendingData';
import { useRecentSearches } from '@/hooks/useRecentSearches';

export default function TrendingSearches() {
  const { getTopTrendingSearches, isLoading, trackSearch } = useTrendingData();
  const { addRecentSearch } = useRecentSearches();
  const router = useRouter();
  
  const trendingSearches = getTopTrendingSearches(8);

  const handleSearchClick = async (query: string) => {
    addRecentSearch(query);
    
    // Track search in database
    await trackSearch(query);
    
    router.push(`/annonces?q=${encodeURIComponent(query)}`);
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
        return 'bg-green-100 text-green-700 border-green-200';
      case 'down':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatPercentage = (percentage: number) => {
    return Math.round(percentage);
  };

  // Show loading state
  if (isLoading) {
    return (
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Flame className="w-6 h-6 text-[#E00201]" />
              <h2 className="text-2xl font-bold text-gray-900">Recherches tendances</h2>
            </div>
            <div className="text-sm text-gray-500">
              Chargement...
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 animate-pulse"
              >
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Don't render if no trending searches
  if (trendingSearches.length === 0) {
    return null;
  }

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Flame className="w-6 h-6 text-[#E00201]" />
            <h2 className="text-2xl font-bold text-gray-900">Recherches tendances</h2>
          </div>
          <div className="text-sm text-gray-500">
            Mis à jour en temps réel
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {trendingSearches.map((trending, index) => (
            <div
              key={trending.query}
              onClick={() => handleSearchClick(trending.query)}
              className="relative bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer group"
            >
              {/* Ranking Badge */}
              <div className="absolute top-2 left-2">
                <div className="flex items-center justify-center w-6 h-6 bg-[#E00201] text-white text-xs font-bold rounded-full">
                  {index + 1}
                </div>
              </div>

              {/* Trend Badge */}
              <div className="absolute top-2 right-2">
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getTrendColor(trending.trend)}`}>
                  {getTrendIcon(trending.trend)}
                  <span>{formatPercentage(trending.trendPercentage)}%</span>
                </div>
              </div>
              
              <div className="mt-6">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <Search className="w-5 h-5 text-gray-400 group-hover:text-[#E00201] transition-colors" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-2 truncate group-hover:text-[#E00201] transition-colors">
                      {trending.query}
                    </h3>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">
                        {trending.count} recherches
                      </p>
                      
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        {getTrendIcon(trending.trend)}
                        <span>
                          {trending.trend === 'up' ? 'En hausse' : 
                           trending.trend === 'down' ? 'En baisse' : 'Stable'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <p className="text-sm text-gray-600 mb-4">
            Basé sur {trendingSearches.reduce((sum, search) => sum + search.count, 0)} recherches récentes
          </p>
          <button
            onClick={() => router.push('/annonces')}
            className="inline-flex items-center px-6 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Search className="w-4 h-4 mr-2" />
            Voir toutes les annonces
          </button>
        </div>
      </div>
    </section>
  );
} 