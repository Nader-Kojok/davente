'use client';

import { useRouter } from 'next/navigation';
import { Clock, X } from 'lucide-react';
import { useRecentSearches } from '@/hooks/useRecentSearches';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function RecentSearches() {
  const { recentSearches, removeRecentSearch, clearRecentSearches, addRecentSearch } = useRecentSearches();
  const router = useRouter();

  const handleSearchClick = (query: string) => {
    addRecentSearch(query);
    router.push(`/annonces?q=${encodeURIComponent(query)}`);
  };

  const handleRemoveSearch = (query: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    removeRecentSearch(query);
  };

  const handleClearAll = () => {
    clearRecentSearches();
  };

  // Don't render if no recent searches - avoid redundancy with TrendingSearches
  if (recentSearches.length === 0) {
    return null;
  }

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recherches récentes</h2>
          <button
            onClick={handleClearAll}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Tout effacer
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {recentSearches.map((search, index) => (
            <div
              key={`${search.query}-${search.timestamp}`}
              className="relative bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer group"
              onClick={() => handleSearchClick(search.query)}
            >
              <button
                onClick={(e) => handleRemoveSearch(search.query, e)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-gray-100 rounded-full"
                aria-label="Supprimer cette recherche"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  <Clock className="w-5 h-5 text-gray-400" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 mb-1 truncate">
                    {search.query}
                  </h3>
                  
                  {search.category && (
                    <p className="text-sm text-gray-600 mb-1 truncate">
                      {search.category}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    {search.location && (
                      <p className="text-xs text-gray-500 truncate">
                        {search.location}
                      </p>
                    )}
                    
                    <p className="text-xs text-gray-400 ml-2">
                      {formatDistanceToNow(new Date(search.timestamp), {
                        addSuffix: true,
                        locale: fr
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {recentSearches.length >= 6 && (
          <div className="text-center mt-6">
            <button
              onClick={() => router.push('/annonces')}
              className="inline-flex items-center px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Voir toutes les annonces
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
