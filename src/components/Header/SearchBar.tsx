"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Search, X, Clock, TrendingUp } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SearchHighlight from "../ui/SearchHighlight";
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

interface SearchBarProps {
  isSearchFocused: boolean;
  setIsSearchFocused: (focused: boolean) => void;
}

export default function SearchBar({ isSearchFocused, setIsSearchFocused }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<SearchSuggestion[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  
  const { getRecentSearchQueries, addRecentSearch } = useRecentSearches();
  const { getTopTrendingSearches } = useTrendingData();
  const recentSearches = getRecentSearchQueries();
  const trendingSearches = getTopTrendingSearches(5);
  
  const searchRef = useRef<HTMLFormElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const searchDropdownRef = useRef<HTMLDivElement | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  
  const router = useRouter();

  // Get all available suggestions (search results + recent searches + trending searches)
  const getAllSuggestions = useCallback(() => {
    const allSuggestions = [...searchSuggestions];
    
    // Add recent searches if no search query
    if (searchQuery.length === 0) {
      recentSearches.forEach((search, index) => {
        allSuggestions.push({
          id: `recent-${index}`,
          title: search,
          price: 0,
          location: '',
          imageUrl: '',
          type: 'recent'
        });
      });

      // Add trending searches if no recent searches
      if (recentSearches.length === 0) {
        trendingSearches.forEach((trending, index) => {
          allSuggestions.push({
            id: `trending-${index}`,
            title: trending.query,
            price: 0,
            location: '',
            imageUrl: '',
            type: 'recent'
          });
        });
      }
    }
    
    return allSuggestions;
  }, [searchSuggestions, recentSearches, trendingSearches, searchQuery]);

  // Debounced search function
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchSuggestions([]);
      setSelectedSuggestionIndex(-1);
      return;
    }

    setIsSearchLoading(true);
    
    try {
      const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        setSearchSuggestions(data.suggestions || []);
        setSelectedSuggestionIndex(-1);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchSuggestions([]);
      setSelectedSuggestionIndex(-1);
    } finally {
      setIsSearchLoading(false);
    }
  }, []);

  // Handle search input change with debouncing
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setSelectedSuggestionIndex(-1);

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
    setSelectedSuggestionIndex(-1);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  const handleInputBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    // Small delay to allow clicks on dropdown items to register
    setTimeout(() => {
      // Only close if the new focus target is not within the search area
      const activeElement = document.activeElement;
      const isWithinSearch = searchRef.current?.contains(activeElement as Node);
      const isWithinDropdown = searchDropdownRef.current?.contains(activeElement as Node);
      
      if (!isWithinSearch && !isWithinDropdown) {
        setIsSearchFocused(false);
        setSearchSuggestions([]);
        setSelectedSuggestionIndex(-1);
      }
    }, 150);
  }, [setIsSearchFocused]);

  const handleSuggestionClick = useCallback((suggestion: SearchSuggestion) => {
    if (suggestion.type === 'listing') {
      router.push(`/annonce/${suggestion.id}`);
    } else if (suggestion.type === 'category') {
      router.push(`/annonces?category=${encodeURIComponent(suggestion.title)}`);
    } else {
      setSearchQuery(suggestion.title);
      addRecentSearch(suggestion.title);
      router.push(`/annonces?q=${encodeURIComponent(suggestion.title)}`);
    }
    setIsSearchFocused(false);
    setSearchSuggestions([]);
    setSelectedSuggestionIndex(-1);
  }, [router, addRecentSearch, setIsSearchFocused]);

  const handleSearchSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    const allSuggestions = getAllSuggestions();
    
    // If a suggestion is selected, use it
    if (selectedSuggestionIndex >= 0 && allSuggestions[selectedSuggestionIndex]) {
      const selectedSuggestion = allSuggestions[selectedSuggestionIndex];
      handleSuggestionClick(selectedSuggestion);
      return;
    }
    
    // Otherwise, use the search query
    if (searchQuery.trim()) {
      const query = searchQuery.trim();
      addRecentSearch(query);
      
      // Track search in database
      try {
        await fetch('/api/search/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query })
        });
      } catch (error) {
        console.error('Error tracking search:', error);
      }
      
      setIsSearchFocused(false);
      setSearchSuggestions([]);
      setSelectedSuggestionIndex(-1);
      router.push(`/annonces?q=${encodeURIComponent(query)}`);
    }
  }, [searchQuery, router, addRecentSearch, selectedSuggestionIndex, getAllSuggestions, handleSuggestionClick, setIsSearchFocused]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    const allSuggestions = getAllSuggestions();
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSuggestionIndex(prev => 
        prev < allSuggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSuggestionIndex(prev => 
        prev > 0 ? prev - 1 : allSuggestions.length - 1
      );
    } else if (e.key === 'Escape') {
      setIsSearchFocused(false);
      setSearchSuggestions([]);
      setSelectedSuggestionIndex(-1);
      searchInputRef.current?.blur();
    }
  }, [getAllSuggestions, setIsSearchFocused]);

  const formatPercentage = (percentage: number) => {
    return Math.round(percentage);
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // Check if click is outside both search form and dropdown
      const isOutsideSearch = searchRef.current && !searchRef.current.contains(target);
      const isOutsideDropdown = searchDropdownRef.current && !searchDropdownRef.current.contains(target);
      
      // Close if click is outside the search area (either form or dropdown)
      if (isOutsideSearch && isOutsideDropdown) {
        setIsSearchFocused(false);
        setSearchSuggestions([]);
        setSelectedSuggestionIndex(-1);
      }
    };

    // Only add listener when search is focused
    if (isSearchFocused) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isSearchFocused, setIsSearchFocused]);

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const showSearchDropdown = isSearchFocused && (searchSuggestions.length > 0 || recentSearches.length > 0 || (searchQuery.length === 0 && trendingSearches.length > 0));
  const allSuggestions = getAllSuggestions();

  return (
    <div className="hidden md:flex flex-1 items-center justify-between mx-4 relative">
      <form
        onSubmit={handleSearchSubmit}
        className={`relative flex-1 transition-all duration-300 ease-in-out ${isSearchFocused ? "w-full" : "max-w-sm"}`}
        ref={searchRef}
      >
        <div className="relative w-full">
          <input
            ref={searchInputRef}
            type="search"
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            onBlur={handleInputBlur}
            placeholder="Rechercher sur Grabi"
            className={`w-full pl-10 pr-10 py-2 rounded-lg border transition-all duration-300 ease-in-out [&::-webkit-search-cancel-button]:hidden ${isSearchFocused ? "shadow-md border-[#E00201] ring-2 ring-[#E00201] ring-opacity-30" : "border-gray-300 hover:border-gray-400"} focus:outline-none`}
            onFocus={() => setIsSearchFocused(true)}
            aria-label="Search"
            autoComplete="off"
            role="combobox"
            aria-expanded={showSearchDropdown}
            aria-haspopup="listbox"
            aria-activedescendant={selectedSuggestionIndex >= 0 ? `suggestion-${selectedSuggestionIndex}` : undefined}
          />
          <Search className={`absolute left-3 top-2.5 h-5 w-5 transition-colors duration-300 ${isSearchFocused ? "text-[#E00201]" : "text-gray-400"}`} />
          {searchQuery && (
            <button
              type="button"
              onClick={handleSearchClear}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              aria-label="Clear search"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </form>

      {/* Search Dropdown */}
      {showSearchDropdown && (
        <div
          ref={searchDropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto search-dropdown"
          role="listbox"
        >
          {/* Loading state */}
          {isSearchLoading && (
            <div className="p-4 text-center">
              <div className="search-spinner h-6 w-6 mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">Recherche en cours...</p>
            </div>
          )}

          {/* Search suggestions */}
          {!isSearchLoading && searchSuggestions.length > 0 && (
            <div className="p-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
                Suggestions
              </h3>
              {searchSuggestions.map((suggestion, index) => (
                <button
                  key={`${suggestion.type}-${suggestion.id}`}
                  id={`suggestion-${index}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  onMouseEnter={() => setSelectedSuggestionIndex(index)}
                  className={`w-full flex items-center p-3 rounded-lg search-suggestion text-left ${
                    selectedSuggestionIndex === index ? 'selected' : ''
                  }`}
                  role="option"
                  aria-selected={selectedSuggestionIndex === index}
                >
                  {suggestion.type === 'listing' && suggestion.imageUrl && (
                    <div className="w-12 h-12 rounded-lg overflow-hidden mr-3 flex-shrink-0">
                      <Image
                        src={suggestion.imageUrl}
                        alt={suggestion.title}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${
                      selectedSuggestionIndex === index ? 'text-white' : 'text-gray-900'
                    }`}>
                      <SearchHighlight 
                        text={suggestion.title} 
                        searchTerm={searchQuery}
                        className={selectedSuggestionIndex === index ? 'text-white' : 'text-gray-900'}
                      />
                    </p>
                    {suggestion.type === 'listing' && (
                      <div className="flex items-center justify-between mt-1">
                        <p className={`text-sm font-semibold ${
                          selectedSuggestionIndex === index ? 'text-white' : 'text-[#E00201]'
                        }`}>
                          {suggestion.price === 0 ? 'Gratuit' : `${suggestion.price.toLocaleString()} FCFA`}
                        </p>
                        <p className={`text-xs ${
                          selectedSuggestionIndex === index ? 'text-gray-200' : 'text-gray-500'
                        }`}>{suggestion.location}</p>
                      </div>
                    )}
                    {suggestion.type === 'category' && (
                      <p className={`text-xs ${
                        selectedSuggestionIndex === index ? 'text-gray-200' : 'text-gray-500'
                      }`}>Catégorie</p>
                    )}
                  </div>
                  {suggestion.type === 'category' && (
                    <TrendingUp className={`w-4 h-4 ml-2 ${
                      selectedSuggestionIndex === index ? 'text-white' : 'text-gray-400'
                    }`} />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Recent searches */}
          {!isSearchLoading && searchQuery.length === 0 && recentSearches.length > 0 && (
            <div className="p-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
                Recherches récentes
              </h3>
              {recentSearches.map((search, index) => {
                const suggestionIndex = searchSuggestions.length + index;
                return (
                  <button
                    key={index}
                    id={`suggestion-${suggestionIndex}`}
                    onClick={() => handleSuggestionClick({
                      id: `recent-${index}`,
                      title: search,
                      price: 0,
                      location: '',
                      imageUrl: '',
                      type: 'recent'
                    })}
                    onMouseEnter={() => setSelectedSuggestionIndex(suggestionIndex)}
                    className={`w-full flex items-center p-3 rounded-lg search-suggestion text-left ${
                      selectedSuggestionIndex === suggestionIndex ? 'selected' : ''
                    }`}
                    role="option"
                    aria-selected={selectedSuggestionIndex === suggestionIndex}
                  >
                    <Clock className={`w-4 h-4 mr-3 ${
                      selectedSuggestionIndex === suggestionIndex ? 'text-white' : 'text-gray-400'
                    }`} />
                    <span className={`text-sm ${
                      selectedSuggestionIndex === suggestionIndex ? 'text-white' : 'text-gray-700'
                    }`}>{search}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Popular searches when no recent searches */}
          {!isSearchLoading && searchQuery.length === 0 && recentSearches.length === 0 && trendingSearches.length > 0 && (
            <div className="p-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
                Recherches tendances
              </h3>
              {trendingSearches.map((trending, index) => {
                const suggestionIndex = searchSuggestions.length + index;
                return (
                  <button
                    key={trending.query}
                    id={`suggestion-${suggestionIndex}`}
                    onClick={() => handleSuggestionClick({
                      id: `trending-${index}`,
                      title: trending.query,
                      price: 0,
                      location: '',
                      imageUrl: '',
                      type: 'recent'
                    })}
                    onMouseEnter={() => setSelectedSuggestionIndex(suggestionIndex)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg search-suggestion text-left ${
                      selectedSuggestionIndex === suggestionIndex ? 'selected' : ''
                    }`}
                    role="option"
                    aria-selected={selectedSuggestionIndex === suggestionIndex}
                  >
                    <div className="flex items-center">
                      <TrendingUp className={`w-4 h-4 mr-3 ${
                        selectedSuggestionIndex === suggestionIndex ? 'text-white' : 'text-[#E00201]'
                      }`} />
                      <span className={`text-sm ${
                        selectedSuggestionIndex === suggestionIndex ? 'text-white' : 'text-gray-700'
                      }`}>{trending.query}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs ${
                        selectedSuggestionIndex === suggestionIndex ? 'text-gray-200' : 'text-gray-500'
                      }`}>{trending.count}</span>
                      <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
                        selectedSuggestionIndex === suggestionIndex ? 'bg-white/20 text-white' :
                        trending.trend === 'up' ? 'bg-green-100 text-green-700' :
                        trending.trend === 'down' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {trending.trend === 'up' ? '↗' : trending.trend === 'down' ? '↘' : '→'}
                        <span>{formatPercentage(trending.trendPercentage)}%</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* No results */}
          {!isSearchLoading && searchQuery.length > 0 && searchSuggestions.length === 0 && (
            <div className="p-4 text-center">
              <p className="text-sm text-gray-500">Aucune suggestion trouvée</p>
              <p className="text-xs text-gray-400 mt-1">Appuyez sur Entrée pour rechercher "{searchQuery}"</p>
            </div>
          )}

          {/* Keyboard navigation hint */}
          {showSearchDropdown && allSuggestions.length > 0 && (
            <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
              <p className="text-xs text-gray-500 text-center">
                Utilisez ↑↓ pour naviguer, Entrée pour sélectionner, Échap pour fermer
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 