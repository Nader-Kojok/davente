'use client';

import { useState, useEffect, useCallback } from 'react';

export interface RecentSearch {
  query: string;
  timestamp: number;
  category?: string;
  location?: string;
}

const STORAGE_KEY = 'recentSearches';
const MAX_RECENT_SEARCHES = 10;

export function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);

  // Load recent searches from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          // Ensure we have the new format with timestamps
          const formatted = parsed.map((item: any) => {
            if (typeof item === 'string') {
              return {
                query: item,
                timestamp: Date.now(),
              };
            }
            return item;
          });
          setRecentSearches(formatted);
        }
      } catch (error) {
        console.error('Error loading recent searches:', error);
        setRecentSearches([]);
      }
    }
  }, []);

  // Save recent searches to localStorage
  const saveToStorage = useCallback((searches: RecentSearch[]) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(searches));
      } catch (error) {
        console.error('Error saving recent searches:', error);
      }
    }
  }, []);

  // Add a new search
  const addRecentSearch = useCallback((query: string, category?: string, location?: string) => {
    if (!query.trim()) return;

    const newSearch: RecentSearch = {
      query: query.trim(),
      timestamp: Date.now(),
      category,
      location,
    };

    setRecentSearches(prev => {
      // Remove existing search with same query
      const filtered = prev.filter(search => search.query.toLowerCase() !== query.toLowerCase());
      // Add new search at the beginning
      const updated = [newSearch, ...filtered].slice(0, MAX_RECENT_SEARCHES);
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  // Remove a specific search
  const removeRecentSearch = useCallback((query: string) => {
    setRecentSearches(prev => {
      const updated = prev.filter(search => search.query !== query);
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  // Clear all recent searches
  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // Get recent search queries as strings (for backward compatibility)
  const getRecentSearchQueries = useCallback(() => {
    return recentSearches.map(search => search.query);
  }, [recentSearches]);

  return {
    recentSearches,
    addRecentSearch,
    removeRecentSearch,
    clearRecentSearches,
    getRecentSearchQueries,
  };
} 