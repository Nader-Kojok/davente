'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import SearchHighlight from './SearchHighlight';
import { useRecentSearches } from '@/hooks/useRecentSearches';
import { useTrendingData } from '@/hooks/useTrendingData';

interface SearchSuggestion {
  id: string;
  title: string;
  price: number;
  location: string;
  imageUrl: string;
  type: 'listing' | 'category' | 'recent';
}

interface MobileSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileSearch({ isOpen, onClose }: MobileSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<SearchSuggestion[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const router = useRouter();

  const { getRecentSearchQueries, addRecentSearch } = useRecentSearches();
  const { getTopTrendingSearches } = useTrendingData();
  const recentSearches = getRecentSearchQueries();
  const trendingSearches = getTopTrendingSearches(5);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Save search to recent searches
  const saveRecentSearch = useCallback((query: string) => {
    addRecentSearch(query);
  }, [addRecentSearch]);

  // Debounced search function
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchSuggestions([]);
      return;
    }

    setIsSearchLoading(true);
    
    try {
      const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        setSearchSuggestions(data.suggestions || []);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchSuggestions([]);
    } finally {
      setIsSearchLoading(false);
    }
  }, []);

  // Handle search input change with debouncing
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for debounced search
    searchTimeoutRef.current = setTimeout(() => {
      performSearch(value);
    }, 300);
  }, [performSearch]);

  const handleSearchClear = useCallback(() => {
    setSearchQuery("");
    setSearchSuggestions([]);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      saveRecentSearch(searchQuery.trim());
      onClose();
      router.push(`/annonces?q=${encodeURIComponent(searchQuery)}`);
    }
  }, [searchQuery, router, saveRecentSearch, onClose]);

  const handleSuggestionClick = useCallback((suggestion: SearchSuggestion) => {
    if (suggestion.type === 'listing') {
      router.push(`/annonce/${suggestion.id}`);
    } else if (suggestion.type === 'category') {
      router.push(`/annonces?category=${encodeURIComponent(suggestion.title)}`);
    } else {
      setSearchQuery(suggestion.title);
      saveRecentSearch(suggestion.title);
      router.push(`/annonces?q=${encodeURIComponent(suggestion.title)}`);
    }
    onClose();
  }, [router, saveRecentSearch, onClose]);

  const handleRecentSearchClick = useCallback((query: string) => {
    setSearchQuery(query);
    saveRecentSearch(query);
    onClose();
    router.push(`/annonces?q=${encodeURIComponent(query)}`);
  }, [router, saveRecentSearch, onClose]);

  const formatPercentage = (percentage: number) => {
    return Math.round(percentage);
  };

  // Cleanup timeout
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white mobile-search-overlay">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-gray-200 mobile-search-content">
        <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center">
          <div className="relative flex-1">
            <input
              ref={searchInputRef}
              type="search"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Rechercher sur Grabi"
              className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-300 focus:border-[#E00201] focus:ring-2 focus:ring-[#E00201] focus:ring-opacity-30 focus:outline-none [&::-webkit-search-cancel-button]:hidden search-input"
              autoComplete="off"
            />
            <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            {searchQuery && (
              <button
                type="button"
                onClick={handleSearchClear}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                aria-label="Clear search"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </form>
        <button
          onClick={onClose}
          className="ml-4 p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
          aria-label="Close search"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto search-results-container mobile-search-content">
        {/* Loading state */}
        {isSearchLoading && (
          <div className="p-6 text-center">
            <div className="search-spinner h-8 w-8 mx-auto"></div>
            <p className="text-sm text-gray-500 mt-3">Recherche en cours...</p>
          </div>
        )}

        {/* Search suggestions */}
        {!isSearchLoading && searchSuggestions.length > 0 && (
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Suggestions
            </h3>
            <div className="space-y-2">
              {searchSuggestions.map((suggestion) => (
                <button
                  key={`${suggestion.type}-${suggestion.id}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full flex items-center p-3 hover:bg-gray-50 rounded-lg transition-all duration-200 text-left search-suggestion"
                >
                  {suggestion.type === 'listing' && suggestion.imageUrl && (
                    <div className="w-14 h-14 rounded-lg overflow-hidden mr-3 flex-shrink-0">
                      <Image
                        src={suggestion.imageUrl}
                        alt={suggestion.title}
                        width={56}
                        height={56}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-medium text-gray-900 truncate">
                      <SearchHighlight 
                        text={suggestion.title} 
                        searchTerm={searchQuery}
                        className="text-gray-900"
                      />
                    </p>
                    {suggestion.type === 'listing' && (
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-sm font-semibold text-[#E00201]">
                          {suggestion.price === 0 ? 'Gratuit' : `${suggestion.price.toLocaleString()} FCFA`}
                        </p>
                        <p className="text-xs text-gray-500">{suggestion.location}</p>
                      </div>
                    )}
                    {suggestion.type === 'category' && (
                      <p className="text-xs text-gray-500">Catégorie</p>
                    )}
                  </div>
                  {suggestion.type === 'category' && (
                    <TrendingUp className="w-5 h-5 text-gray-400 ml-2" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Recent searches */}
        {!isSearchLoading && searchQuery.length === 0 && recentSearches.length > 0 && (
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Recherches récentes
            </h3>
            <div className="space-y-2">
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleRecentSearchClick(search)}
                  className="w-full flex items-center p-3 hover:bg-gray-50 rounded-lg transition-all duration-200 text-left search-suggestion"
                >
                  <Clock className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-base text-gray-700">{search}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* No results */}
        {!isSearchLoading && searchQuery.length > 0 && searchSuggestions.length === 0 && (
          <div className="p-6 text-center">
            <p className="text-base text-gray-500">Aucune suggestion trouvée</p>
            <p className="text-sm text-gray-400 mt-2">Appuyez sur Rechercher pour voir tous les résultats</p>
          </div>
        )}

        {/* Trending searches when no recent searches and no query */}
        {!isSearchLoading && searchQuery.length === 0 && recentSearches.length === 0 && trendingSearches.length > 0 && (
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Recherches tendances
            </h3>
            <div className="space-y-2">
              {trendingSearches.map((trending) => (
                <button
                  key={trending.query}
                  onClick={() => handleRecentSearchClick(trending.query)}
                  className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-all duration-200 text-left search-suggestion"
                >
                  <div className="flex items-center">
                    <TrendingUp className="w-5 h-5 text-[#E00201] mr-3" />
                    <span className="text-base text-gray-700">{trending.query}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">{trending.count}</span>
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
                      trending.trend === 'up' ? 'bg-green-100 text-green-700' :
                      trending.trend === 'down' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {trending.trend === 'up' ? '↗' : trending.trend === 'down' ? '↘' : '→'}
                      <span>{formatPercentage(trending.trendPercentage)}%</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 