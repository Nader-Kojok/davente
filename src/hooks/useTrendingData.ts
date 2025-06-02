'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRecentSearches } from './useRecentSearches';

export interface TrendingCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  href: string;
  searchCount: number;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
}

export interface TrendingSearch {
  query: string;
  count: number;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
}

export function useTrendingData() {
  const [trendingCategories, setTrendingCategories] = useState<TrendingCategory[]>([]);
  const [trendingSearches, setTrendingSearches] = useState<TrendingSearch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { recentSearches } = useRecentSearches();

  // Fetch trending data from API
  const fetchTrendingData = useCallback(async () => {
    try {
      const [searchesResponse, categoriesResponse] = await Promise.all([
        fetch('/api/trending/searches?limit=10'),
        fetch('/api/trending/categories?limit=6')
      ]);

      if (searchesResponse.ok) {
        const searchesData = await searchesResponse.json();
        if (searchesData.success && searchesData.data) {
          // Convert database format to component format
          const searches = searchesData.data.map((item: any) => ({
            query: item.query,
            count: item.count,
            trend: item.trend,
            trendPercentage: item.trendPercentage,
          }));
          setTrendingSearches(searches);
        }
      }

      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        if (categoriesData.success && categoriesData.data) {
          setTrendingCategories(categoriesData.data);
        }
      }
    } catch (error) {
      console.error('Error fetching trending data:', error);
      // Fallback to default data if API fails
      setFallbackData();
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Set fallback data in case of API errors
  const setFallbackData = useCallback(() => {
    const fallbackCategories: TrendingCategory[] = [
      {
        id: 'electronics',
        name: 'Électronique',
        slug: 'electronique',
        icon: '📱',
        href: '/categories/electronique',
        searchCount: 120,
        trend: 'up',
        trendPercentage: 15
      },
      {
        id: 'vehicles',
        name: 'Véhicules',
        slug: 'vehicules',
        icon: '🚗',
        href: '/categories/vehicules',
        searchCount: 150,
        trend: 'up',
        trendPercentage: 25
      },
      {
        id: 'real-estate',
        name: 'Immobilier',
        slug: 'immobilier',
        icon: '🏠',
        href: '/categories/immobilier',
        searchCount: 100,
        trend: 'stable',
        trendPercentage: 5
      }
    ];

    const fallbackSearches: TrendingSearch[] = [
      { query: 'iPhone', count: 45, trend: 'up', trendPercentage: 20 },
      { query: 'Voiture', count: 38, trend: 'up', trendPercentage: 15 },
      { query: 'Appartement', count: 32, trend: 'stable', trendPercentage: 2 }
    ];

    setTrendingCategories(fallbackCategories);
    setTrendingSearches(fallbackSearches);
  }, []);

  // Track search query
  const trackSearch = useCallback(async (query: string) => {
    if (!query || query.trim().length < 2) return;
    
    try {
      await fetch('/api/search/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim() })
      });
      
      // Refresh trending data after tracking
      setTimeout(() => fetchTrendingData(), 1000);
    } catch (error) {
      console.error('Error tracking search:', error);
    }
  }, [fetchTrendingData]);

  // Load trending data on mount
  useEffect(() => {
    fetchTrendingData();
  }, [fetchTrendingData]);

  // Track category interaction
  const trackCategoryInteraction = useCallback(async (categorySlug: string) => {
    try {
      // Track category as a search query
      await trackSearch(categorySlug);
    } catch (error) {
      console.error('Error tracking category interaction:', error);
    }
  }, [trackSearch]);

  // Get top trending categories
  const getTopTrendingCategories = useCallback((limit: number = 4) => {
    return trendingCategories
      .sort((a, b) => b.searchCount - a.searchCount)
      .slice(0, limit);
  }, [trendingCategories]);

  // Get top trending searches
  const getTopTrendingSearches = useCallback((limit: number = 5) => {
    return trendingSearches
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }, [trendingSearches]);

  return {
    trendingCategories,
    trendingSearches,
    isLoading,
    trackSearch,
    trackCategoryInteraction,
    getTopTrendingCategories,
    getTopTrendingSearches,
    refreshTrendingData: fetchTrendingData,
  };
} 