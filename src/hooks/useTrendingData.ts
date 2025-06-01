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

const TRENDING_STORAGE_KEY = 'trendingData';
const CATEGORY_INTERACTIONS_KEY = 'categoryInteractions';

export function useTrendingData() {
  const [trendingCategories, setTrendingCategories] = useState<TrendingCategory[]>([]);
  const [trendingSearches, setTrendingSearches] = useState<TrendingSearch[]>([]);
  const { recentSearches } = useRecentSearches();

  // Load trending data from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedTrending = localStorage.getItem(TRENDING_STORAGE_KEY);
        if (savedTrending) {
          const data = JSON.parse(savedTrending);
          setTrendingCategories(data.categories || []);
          setTrendingSearches(data.searches || []);
        } else {
          // Initialize with default trending data
          initializeDefaultTrending();
        }
      } catch (error) {
        console.error('Error loading trending data:', error);
        initializeDefaultTrending();
      }
    }
  }, []);

  // Update trending data based on recent searches
  useEffect(() => {
    updateTrendingFromRecentSearches();
  }, [recentSearches]);

  const initializeDefaultTrending = useCallback(() => {
    const defaultCategories: TrendingCategory[] = [
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
        id: 'real-estate',
        name: 'Immobilier',
        slug: 'immobilier',
        icon: '🏠',
        href: '/categories/immobilier',
        searchCount: 100,
        trend: 'stable',
        trendPercentage: 5
      },
      {
        id: 'fashion',
        name: 'Mode',
        slug: 'mode',
        icon: '👕',
        href: '/categories/mode',
        searchCount: 80,
        trend: 'up',
        trendPercentage: 30
      }
    ];

    const defaultSearches: TrendingSearch[] = [
      { query: 'iPhone', count: 45, trend: 'up', trendPercentage: 20 },
      { query: 'Voiture', count: 38, trend: 'up', trendPercentage: 15 },
      { query: 'Appartement', count: 32, trend: 'stable', trendPercentage: 2 },
      { query: 'Samsung Galaxy', count: 28, trend: 'up', trendPercentage: 25 },
      { query: 'PlayStation', count: 25, trend: 'up', trendPercentage: 40 }
    ];

    setTrendingCategories(defaultCategories);
    setTrendingSearches(defaultSearches);
    saveTrendingData(defaultCategories, defaultSearches);
  }, []);

  const updateTrendingFromRecentSearches = useCallback(() => {
    if (recentSearches.length === 0) return;

    // Count search frequencies
    const searchCounts = new Map<string, number>();
    recentSearches.forEach(search => {
      const current = searchCounts.get(search.query) || 0;
      searchCounts.set(search.query, current + 1);
    });

    // Update trending searches based on recent activity
    setTrendingSearches(prev => {
      const updated = [...prev];
      
      searchCounts.forEach((count, query) => {
        const existingIndex = updated.findIndex(item => item.query.toLowerCase() === query.toLowerCase());
        
        if (existingIndex >= 0) {
          // Update existing search
          const oldCount = updated[existingIndex].count;
          updated[existingIndex].count += count;
          const percentageChange = ((updated[existingIndex].count - oldCount) / oldCount) * 100;
          updated[existingIndex].trend = percentageChange > 10 ? 'up' : percentageChange < -10 ? 'down' : 'stable';
          updated[existingIndex].trendPercentage = Math.round(Math.abs(percentageChange));
        } else {
          // Add new trending search
          updated.push({
            query,
            count,
            trend: 'up',
            trendPercentage: 100 // New search
          });
        }
      });

      // Sort by count and keep top 10
      const sorted = updated.sort((a, b) => b.count - a.count).slice(0, 10);
      return sorted;
    });
  }, [recentSearches]);

  const saveTrendingData = useCallback((categories: TrendingCategory[], searches: TrendingSearch[]) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(TRENDING_STORAGE_KEY, JSON.stringify({
          categories,
          searches,
          lastUpdated: Date.now()
        }));
      } catch (error) {
        console.error('Error saving trending data:', error);
      }
    }
  }, []);

  // Track category interaction
  const trackCategoryInteraction = useCallback((categorySlug: string) => {
    if (typeof window === 'undefined') return;

    try {
      const interactions = JSON.parse(localStorage.getItem(CATEGORY_INTERACTIONS_KEY) || '{}');
      interactions[categorySlug] = (interactions[categorySlug] || 0) + 1;
      localStorage.setItem(CATEGORY_INTERACTIONS_KEY, JSON.stringify(interactions));

      // Update trending categories based on interactions
      setTrendingCategories(prev => {
        const updated = prev.map(cat => {
          if (cat.slug === categorySlug) {
            return {
              ...cat,
              searchCount: cat.searchCount + 1,
              trend: 'up' as const,
              trendPercentage: Math.min(Math.round(cat.trendPercentage + 5), 100)
            };
          }
          return cat;
        });
        
        saveTrendingData(updated, trendingSearches);
        return updated;
      });
    } catch (error) {
      console.error('Error tracking category interaction:', error);
    }
  }, [trendingSearches, saveTrendingData]);

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
    trackCategoryInteraction,
    getTopTrendingCategories,
    getTopTrendingSearches,
  };
} 