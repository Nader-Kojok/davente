import { useState, useEffect } from 'react';
import { TopCategory } from '@/types/category';

interface UseTopCategoriesReturn {
  categories: TopCategory[];
  isLoading: boolean;
  error: string | null;
}

export function useTopCategories(): UseTopCategoriesReturn {
  const [categories, setCategories] = useState<TopCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTopCategories() {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch('/api/categories/top');
        
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des catégories');
        }
        
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        console.error('Error fetching top categories:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTopCategories();
  }, []);

  return { categories, isLoading, error };
} 