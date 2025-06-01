'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, MapPin, Tag, TrendingUp } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchSuggestion {
  id: string;
  title: string;
  type: 'listing' | 'category' | 'location' | 'user';
  price?: number;
  location?: string;
  imageUrl?: string;
  description?: string;
}

interface AdvancedSearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export default function AdvancedSearchBar({ 
  onSearch, 
  placeholder = "Rechercher des annonces...",
  className = ""
}: AdvancedSearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [searchSource, setSearchSource] = useState<'prisma'>('prisma');
  
  const debouncedQuery = useDebounce(query, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Fetch suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedQuery.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(debouncedQuery)}&limit=8`);
        const data = await response.json();
        
        setSuggestions(data.suggestions || []);
        setSearchSource(data.source || 'prisma');
        setShowSuggestions(true);
        setSelectedIndex(-1);
      } catch (error) {
        console.error('Erreur lors de la récupération des suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showSuggestions || suggestions.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < suggestions.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0) {
            handleSuggestionClick(suggestions[selectedIndex]);
          } else {
            handleSearch();
          }
          break;
        case 'Escape':
          setShowSuggestions(false);
          setSelectedIndex(-1);
          inputRef.current?.blur();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showSuggestions, suggestions, selectedIndex]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = () => {
    if (query.trim()) {
      onSearch?.(query.trim());
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    if (suggestion.type === 'listing') {
      setQuery(suggestion.title);
      onSearch?.(suggestion.title);
    } else if (suggestion.type === 'category') {
      setQuery(suggestion.title);
      onSearch?.(suggestion.title);
    } else if (suggestion.type === 'location') {
      setQuery(suggestion.location || suggestion.title);
      onSearch?.(suggestion.location || suggestion.title);
    }
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const formatPrice = (price: number) => {
    if (price === 0) return 'Gratuit';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getSuggestionIcon = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'listing':
        return <TrendingUp className="w-4 h-4 text-blue-500" />;
      case 'category':
        return <Tag className="w-4 h-4 text-green-500" />;
      case 'location':
        return <MapPin className="w-4 h-4 text-orange-500" />;
      default:
        return <Search className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className={`relative w-full max-w-2xl mx-auto ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          placeholder={placeholder}
          className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg 
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   bg-white shadow-sm text-gray-900 placeholder-gray-500
                   transition-all duration-200"
        />
        
        {query && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        )}
        
        {isLoading && (
          <div className="absolute inset-y-0 right-8 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {/* Search Source Indicator */}
      {query && (
        <div className="absolute top-full left-0 mt-1 text-xs text-gray-500 flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          Recherche avec Prisma
        </div>
      )}

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 
                   rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
        >
          <div className="p-2 border-b border-gray-100 bg-gray-50">
            <span className="text-xs text-gray-600 font-medium">
              Suggestions basiques
            </span>
          </div>
          
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`flex items-center gap-3 p-3 cursor-pointer transition-colors
                        ${index === selectedIndex ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-gray-50'}
                        ${index !== suggestions.length - 1 ? 'border-b border-gray-100' : ''}`}
            >
              {/* Icon */}
              <div className="flex-shrink-0">
                {getSuggestionIcon(suggestion.type)}
              </div>

              {/* Image for listings */}
              {suggestion.type === 'listing' && suggestion.imageUrl && (
                <div className="flex-shrink-0">
                  <img
                    src={suggestion.imageUrl}
                    alt={suggestion.title}
                    className="w-12 h-12 object-cover rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                    }}
                  />
                </div>
              )}

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 truncate">
                  {suggestion.title}
                </div>
                <div className="text-sm text-gray-500 flex items-center gap-2">
                  <MapPin className="w-3 h-3" />
                  {suggestion.location || 'Localisation'}
                  {suggestion.type === 'listing' && suggestion.price && suggestion.price > 0 && (
                    <>
                      <span>•</span>
                      <span className="font-medium text-green-600">
                        {formatPrice(suggestion.price)}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Type badge */}
              <div className="flex-shrink-0">
                <span className={`px-2 py-1 text-xs rounded-full font-medium
                  ${suggestion.type === 'listing' ? 'bg-blue-100 text-blue-800' : ''}
                  ${suggestion.type === 'category' ? 'bg-green-100 text-green-800' : ''}
                  ${suggestion.type === 'location' ? 'bg-orange-100 text-orange-800' : ''}
                `}>
                  {suggestion.type === 'listing' ? 'Annonce' : ''}
                  {suggestion.type === 'category' ? 'Catégorie' : ''}
                  {suggestion.type === 'location' ? 'Lieu' : ''}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No results message */}
      {showSuggestions && suggestions.length === 0 && debouncedQuery.length >= 2 && !isLoading && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 
                     rounded-lg shadow-lg z-50 p-4 text-center text-gray-500">
          Aucune suggestion trouvée pour "{debouncedQuery}"
        </div>
      )}
    </div>
  );
} 