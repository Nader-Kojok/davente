import { useState, useEffect } from 'react';
import { RecentListing } from '@/types/category';

interface UseRecentListingsOptions {
  limit?: number;
  categoryId?: number;
}

interface UseRecentListingsReturn {
  listings: RecentListing[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useRecentListings(options: UseRecentListingsOptions = {}): UseRecentListingsReturn {
  const [listings, setListings] = useState<RecentListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecentListings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (options.limit) params.append('limit', options.limit.toString());
      if (options.categoryId) params.append('categoryId', options.categoryId.toString());
      
      const response = await fetch(`/api/annonces/recent?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des annonces');
      }
      
      const data = await response.json();
      setListings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      console.error('Error fetching recent listings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentListings();
  }, [options.limit, options.categoryId]);

  return { 
    listings, 
    isLoading, 
    error, 
    refetch: fetchRecentListings 
  };
} 