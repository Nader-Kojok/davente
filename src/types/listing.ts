// Types pour les badges des annonces
export type ListingBadge = 'new' | 'pro' | 'verified' | 'urgent' | 'delivery';

// Interface pour les informations du vendeur
export interface Seller {
  name: string;
  rating: number;
  reviewCount: number;
  avatarUrl: string;
}

// Interface principale pour une annonce
export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number | 'Gratuit';
  location: string;
  postedAt: string;
  imageUrl: string;
  badges: ListingBadge[];
  isSponsored?: boolean;
  seller: Seller;
  condition: string;
  deliveryAvailable: boolean;
}

// Interface pour les filtres de recherche
export interface SearchFilters {
  query?: string;
  category?: string;
  subcategory?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
  userType?: 'individual' | 'business';
  sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'date_desc' | 'date_asc';
  page?: number;
  limit?: number;
}

// Interface pour les résultats de recherche
export interface SearchResults {
  listings: Listing[];
  total: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Interface pour les agrégations de recherche
export interface SearchAggregations {
  categories: Array<{ key: string; doc_count: number; label?: string }>;
  locations: Array<{ key: string; doc_count: number; label?: string }>;
  priceRanges: Array<{ key: string; doc_count: number; label?: string }>;
  conditions: Array<{ key: string; doc_count: number; label?: string }>;
  userTypes: Array<{ key: string; doc_count: number; label?: string }>;
}

// Interface pour les suggestions de recherche
export interface SearchSuggestion {
  id: string;
  title: string;
  type: 'listing' | 'category' | 'location' | 'user';
  price?: number;
  location?: string;
  imageUrl?: string;
  description?: string;
}

// Interface pour les statistiques d'une annonce
export interface ListingStats {
  views: number;
  favorites: number;
  contacts: number;
  shares: number;
}

// Interface pour l'historique des prix
export interface PriceHistory {
  date: string;
  price: number;
  currency: string;
}

// Interface pour les annonces détaillées
export interface DetailedListing extends Listing {
  gallery: string[];
  category?: string;
  subcategory?: string;
  additionalFields?: Record<string, any>;
  stats?: ListingStats;
  priceHistory?: PriceHistory[];
  relatedListings?: Listing[];
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'inactive' | 'sold' | 'expired';
}

// Interface pour les options de tri
export interface SortOption {
  value: string;
  label: string;
  icon?: string;
  description?: string;
}

// Interface pour les filtres de prix
export interface PriceRange {
  min?: number;
  max?: number;
  label: string;
  value: string;
}

// Interface pour les options de condition
export interface ConditionOption {
  value: string;
  label: string;
  description?: string;
}

// Types pour les modes d'affichage
export type ViewMode = 'grid' | 'list' | 'map';

// Interface pour les paramètres d'URL de recherche
export interface SearchParams {
  q?: string;
  category?: string;
  subcategory?: string;
  location?: string;
  minPrice?: string;
  maxPrice?: string;
  condition?: string;
  userType?: string;
  sortBy?: string;
  page?: string;
  limit?: string;
  view?: ViewMode;
}

// Interface pour les métadonnées de recherche
export interface SearchMetadata {
  query: string;
  totalResults: number;
  searchTime: number;
  source: 'prisma' | 'cache';
  suggestions?: string[];
  didYouMean?: string;
}

// Interface pour les erreurs de recherche
export interface SearchError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

// Interface pour la réponse complète de recherche
export interface SearchResponse {
  success: boolean;
  data?: {
    listings: Listing[];
    total: number;
    aggregations?: SearchAggregations;
    metadata?: SearchMetadata;
  };
  error?: SearchError;
  source: 'prisma' | 'cache' | 'error';
} 