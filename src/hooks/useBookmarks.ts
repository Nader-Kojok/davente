import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

interface Bookmark {
  id: number;
  userId: number;
  annonceId: number;
  createdAt: string;
  annonce: {
    id: number;
    title: string;
    description: string;
    price: number;
    location: string;
    picture: string;
    gallery: string[];
    createdAt: string;
    status: string;
    category?: string;
    subcategory?: string;
    condition?: string;
    user: {
      id: number;
      name: string;
      picture: string;
      mobile: string;
      showPhone: boolean;
      isVerified: boolean;
    };
    Category?: {
      id: number;
      name: string;
      slug: string;
      icon: string;
    };
    Subcategory?: {
      id: number;
      name: string;
      slug: string;
    };
  };
}

interface UseBookmarksReturn {
  bookmarks: Bookmark[];
  isLoading: boolean;
  error: string | null;
  addBookmark: (annonceId: number, annonceData?: any) => Promise<boolean>;
  removeBookmark: (annonceId: number) => Promise<boolean>;
  isBookmarked: (annonceId: number) => boolean;
  checkBookmarkStatus: (annonceId: number) => Promise<boolean>;
  refreshBookmarks: () => Promise<void>;
  total: number;
}

export function useBookmarks(): UseBookmarksReturn {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { session, isAuthenticated } = useAuth();

  const fetchBookmarks = useCallback(async () => {
    if (!isAuthenticated || !session?.access_token) {
      setBookmarks([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/bookmarks', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBookmarks(data.bookmarks || []);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erreur lors du chargement des favoris');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
      console.error('Error fetching bookmarks:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, session?.access_token]);

  const addBookmark = async (annonceId: number, annonceData?: any): Promise<boolean> => {
    if (!isAuthenticated || !session?.access_token) {
      toast.error('Vous devez être connecté pour ajouter aux favoris');
      return false;
    }

    // Mise à jour optimiste - ajouter immédiatement à l'interface
    if (annonceData) {
      const optimisticBookmark: Bookmark = {
        id: Date.now(), // ID temporaire
        userId: 0, // Sera mis à jour par le serveur
        annonceId,
        createdAt: new Date().toISOString(),
        annonce: annonceData
      };
      
      setBookmarks(prev => [optimisticBookmark, ...prev]);
      toast.success('Annonce ajoutée aux favoris');
    }

    try {
      const response = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ annonceId })
      });

      if (response.ok) {
        // Recharger seulement si on n'avait pas les données pour la mise à jour optimiste
        if (!annonceData) {
          await fetchBookmarks();
          toast.success('Annonce ajoutée aux favoris');
        }
        return true;
      } else {
        // Annuler la mise à jour optimiste en cas d'erreur
        if (annonceData) {
          setBookmarks(prev => prev.filter(b => b.annonceId !== annonceId));
        }
        const errorData = await response.json();
        toast.error(errorData.error || 'Erreur lors de l\'ajout aux favoris');
        return false;
      }
    } catch (err) {
      // Annuler la mise à jour optimiste en cas d'erreur
      if (annonceData) {
        setBookmarks(prev => prev.filter(b => b.annonceId !== annonceId));
      }
      toast.error('Erreur de connexion au serveur');
      console.error('Error adding bookmark:', err);
      return false;
    }
  };

  const removeBookmark = async (annonceId: number): Promise<boolean> => {
    if (!isAuthenticated || !session?.access_token) {
      return false;
    }

    // Mise à jour optimiste - supprimer immédiatement de l'interface
    const previousBookmarks = bookmarks;
    setBookmarks(prev => prev.filter(bookmark => bookmark.annonce.id !== annonceId));
    toast.success('Annonce supprimée des favoris');

    try {
      const response = await fetch(`/api/bookmarks/${annonceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (response.ok) {
        return true;
      } else {
        // Restaurer l'état précédent en cas d'erreur
        setBookmarks(previousBookmarks);
        const errorData = await response.json();
        toast.error(errorData.error || 'Erreur lors de la suppression');
        return false;
      }
    } catch (err) {
      // Restaurer l'état précédent en cas d'erreur
      setBookmarks(previousBookmarks);
      toast.error('Erreur de connexion au serveur');
      console.error('Error removing bookmark:', err);
      return false;
    }
  };

  const isBookmarked = (annonceId: number): boolean => {
    return bookmarks.some(bookmark => bookmark.annonce.id === annonceId);
  };

  const checkBookmarkStatus = async (annonceId: number): Promise<boolean> => {
    if (!isAuthenticated || !session?.access_token) {
      return false;
    }

    try {
      const response = await fetch(`/api/bookmarks/check/${annonceId}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        return data.isBookmarked;
      }
    } catch (err) {
      console.error('Error checking bookmark status:', err);
    }

    return false;
  };

  const refreshBookmarks = async () => {
    await fetchBookmarks();
  };

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  return {
    bookmarks,
    isLoading,
    error,
    addBookmark,
    removeBookmark,
    isBookmarked,
    checkBookmarkStatus,
    refreshBookmarks,
    total: bookmarks.length
  };
} 