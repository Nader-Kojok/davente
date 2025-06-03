import { useState, useEffect, useCallback, useRef } from 'react';

interface UseOptimizedQueryOptions<T> {
  queryFn: () => Promise<T>;
  dependencies: any[];
  cacheKey?: string;
  cacheTTL?: number; // en millisecondes
  debounceMs?: number;
  enabled?: boolean;
}

interface QueryState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  isStale: boolean;
}

// Cache simple en mémoire
const queryCache = new Map<string, { data: any; timestamp: number; ttl: number }>();

export function useOptimizedQuery<T>({
  queryFn,
  dependencies,
  cacheKey,
  cacheTTL = 5 * 60 * 1000, // 5 minutes par défaut
  debounceMs = 300,
  enabled = true
}: UseOptimizedQueryOptions<T>): QueryState<T> & { refetch: () => void } {
  const [state, setState] = useState<QueryState<T>>({
    data: null,
    isLoading: false,
    error: null,
    isStale: false
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fonction pour récupérer depuis le cache
  const getCachedData = useCallback((): T | null => {
    if (!cacheKey) return null;
    
    const cached = queryCache.get(cacheKey);
    if (!cached) return null;
    
    const isExpired = Date.now() - cached.timestamp > cached.ttl;
    if (isExpired) {
      queryCache.delete(cacheKey);
      return null;
    }
    
    return cached.data;
  }, [cacheKey]);

  // Fonction pour mettre en cache
  const setCachedData = useCallback((data: T) => {
    if (!cacheKey) return;
    
    queryCache.set(cacheKey, {
      data,
      timestamp: Date.now(),
      ttl: cacheTTL
    });
  }, [cacheKey, cacheTTL]);

  // Fonction principale de requête
  const executeQuery = useCallback(async () => {
    if (!enabled) return;

    // Annuler la requête précédente si elle existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Vérifier le cache d'abord
    const cachedData = getCachedData();
    if (cachedData) {
      setState(prev => ({
        ...prev,
        data: cachedData,
        isLoading: false,
        error: null,
        isStale: false
      }));
      return;
    }

    // Créer un nouveau AbortController
    abortControllerRef.current = new AbortController();

    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      isStale: false
    }));

    try {
      const data = await queryFn();
      
      // Vérifier si la requête n'a pas été annulée
      if (!abortControllerRef.current?.signal.aborted) {
        setCachedData(data);
        setState({
          data,
          isLoading: false,
          error: null,
          isStale: false
        });
      }
    } catch (error) {
      if (!abortControllerRef.current?.signal.aborted) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: error as Error,
          isStale: false
        }));
      }
    }
  }, [enabled, queryFn, getCachedData, setCachedData]);

  // Fonction de refetch manuelle
  const refetch = useCallback(() => {
    // Invalider le cache
    if (cacheKey) {
      queryCache.delete(cacheKey);
    }
    executeQuery();
  }, [executeQuery, cacheKey]);

  // Effet pour exécuter la requête avec debouncing
  useEffect(() => {
    if (!enabled) return;

    // Nettoyer le timeout précédent
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Marquer les données comme obsolètes immédiatement
    setState(prev => prev.data ? { ...prev, isStale: true } : prev);

    // Programmer l'exécution avec debouncing
    debounceTimeoutRef.current = setTimeout(() => {
      executeQuery();
    }, debounceMs);

    // Cleanup
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [...dependencies, enabled]);

  // Cleanup à la destruction du composant
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return {
    ...state,
    refetch
  };
}

// Hook spécialisé pour les listes d'annonces
export function useOptimizedListings(filters: any) {
  return useOptimizedQuery({
    queryFn: async () => {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });

      const response = await fetch(`/api/annonces?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des annonces');
      }
      
      return response.json();
    },
    dependencies: [JSON.stringify(filters)],
    cacheKey: `listings-${JSON.stringify(filters)}`,
    cacheTTL: 2 * 60 * 1000, // 2 minutes pour les listes
    debounceMs: 500 // Debounce plus long pour les filtres
  });
} 