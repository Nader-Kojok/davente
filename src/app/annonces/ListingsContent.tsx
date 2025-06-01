'use client';

import React, { useState, useCallback, useMemo, memo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ModernFilterBar from '@/components/ui/ModernFilterBar';
import ListingCard from '@/components/ui/ListingCard';
import ListingCardGrid from '@/components/ui/ListingCardGrid';
import { Listing } from '@/types/listing';

// Define ViewMode type
type ViewMode = 'grid' | 'list';

// Pagination component
function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="flex justify-center items-center space-x-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed
                 hover:bg-gray-50 transition-colors duration-200"
      >
        <ChevronLeft className="w-5 h-5 text-gray-600" />
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 rounded-lg border ${
            currentPage === page
              ? 'bg-[#E00201] text-white border-[#E00201]'
              : 'border-gray-300 hover:bg-gray-50 text-gray-700'
          } 
            transition-colors duration-200`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed
                 hover:bg-gray-50 transition-colors duration-200"
      >
        <ChevronRight className="w-5 h-5 text-gray-600" />
      </button>
    </div>
  );
}

// Memoize the listing card components to prevent unnecessary re-renders
const MemoizedListingCard = memo(ListingCard);
const MemoizedListingCardGrid = memo(ListingCardGrid);

// Client component pour la pagination et les filtres
export default function ListingsContent({ 
  listings, 
  searchParams 
}: { 
  listings: Listing[];
  searchParams?: {
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
  };
}) {
  const router = useRouter();
  const urlSearchParams = useSearchParams();
  
  // Optimize state management
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Memoize filter options to prevent unnecessary re-renders
  const [filterOptions, setFilterOptions] = useState(() => {
    const safeSearchParams = searchParams || {};
    return {
      searchTerm: safeSearchParams.q || '',
      category: safeSearchParams.category || '',
      subcategory: safeSearchParams.subcategory || '',
      location: safeSearchParams.location || '',
      minPrice: safeSearchParams.minPrice || '',
      maxPrice: safeSearchParams.maxPrice || '',
      condition: safeSearchParams.condition || '',
      userType: safeSearchParams.userType || '',
      sortBy: safeSearchParams.sortBy || 'recent'
    };
  });

  // Optimize filter update function
  const updateFilterOptions = useCallback((newOptions: Partial<typeof filterOptions>) => {
    // For search terms, update both local state and URL
    if (newOptions.searchTerm !== undefined) {
      // Update local state immediately for responsive UI
      setFilterOptions(prev => ({ ...prev, searchTerm: newOptions.searchTerm || '' }));
      
      // Update URL to trigger server-side search
      const params = new URLSearchParams(urlSearchParams.toString());
      
      if (newOptions.searchTerm && newOptions.searchTerm.trim()) {
        params.set('q', newOptions.searchTerm.trim());
      } else {
        params.delete('q');
      }
      
      router.push(`/annonces?${params.toString()}`);
      return;
    }
    
    // For other filters, update local state for client-side filtering
    setFilterOptions(prev => ({ ...prev, ...newOptions }));
    setCurrentPage(1); // Reset to first page when filters change
  }, [router, urlSearchParams]);

  // Optimize view mode change
  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
  }, []);

  // Optimize filtered listings with better memoization
  const filteredListings = useMemo(() => {
    let filtered = [...listings];
    
    // Apply client-side search filtering if the current filter differs from server-side search
    // This enables real-time filtering as the user types before the server request
    const serverSearchTerm = searchParams?.q || '';
    const clientSearchTerm = filterOptions.searchTerm || '';
    
    if (clientSearchTerm && clientSearchTerm.trim() && clientSearchTerm !== serverSearchTerm) {
      const searchLower = clientSearchTerm.toLowerCase();
      filtered = filtered.filter(listing =>
        listing.title.toLowerCase().includes(searchLower) ||
        listing.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Only apply client-side filters that aren't handled server-side
    if (filterOptions.category) {
      // Category filtering would be done server-side in production
    }
    
    if (filterOptions.location && filterOptions.location.trim()) {
      const locationLower = filterOptions.location.toLowerCase();
      filtered = filtered.filter(listing =>
        listing.location.toLowerCase().includes(locationLower)
      );
    }
    
    if (filterOptions.minPrice && filterOptions.minPrice.trim()) {
      const minPrice = parseFloat(filterOptions.minPrice);
      if (!isNaN(minPrice)) {
        filtered = filtered.filter(listing => {
          const price = typeof listing.price === 'number' ? listing.price : 0;
          return price >= minPrice;
        });
      }
    }
    
    if (filterOptions.maxPrice && filterOptions.maxPrice.trim()) {
      const maxPrice = parseFloat(filterOptions.maxPrice);
      if (!isNaN(maxPrice)) {
        filtered = filtered.filter(listing => {
          const price = typeof listing.price === 'number' ? listing.price : 0;
          return price <= maxPrice;
        });
      }
    }
    
    if (filterOptions.condition && filterOptions.condition !== 'all') {
      filtered = filtered.filter(listing => listing.condition === filterOptions.condition);
    }
    
    return filtered;
  }, [listings, filterOptions, searchParams?.q]);

  // Optimize sorting with stable sort
  const sortedListings = useMemo(() => {
    const sorted = [...filteredListings];
    
    switch (filterOptions.sortBy) {
      case 'recent':
        return sorted.sort((a, b) => {
          const getHoursFromPostedAt = (postedAt: string) => {
            if (postedAt.includes('moins d\'1 heure')) return 0.5;
            if (postedAt.includes('heure')) {
              const hours = parseInt(postedAt.match(/\d+/)?.[0] || '0');
              return hours;
            }
            if (postedAt.includes('jour')) {
              const days = parseInt(postedAt.match(/\d+/)?.[0] || '0');
              return days * 24;
            }
            return 0;
          };
          
          return getHoursFromPostedAt(a.postedAt) - getHoursFromPostedAt(b.postedAt);
        });
        
      case 'oldest':
        return sorted.sort((a, b) => {
          const getHoursFromPostedAt = (postedAt: string) => {
            if (postedAt.includes('moins d\'1 heure')) return 0.5;
            if (postedAt.includes('heure')) {
              const hours = parseInt(postedAt.match(/\d+/)?.[0] || '0');
              return hours;
            }
            if (postedAt.includes('jour')) {
              const days = parseInt(postedAt.match(/\d+/)?.[0] || '0');
              return days * 24;
            }
            return 0;
          };
          
          return getHoursFromPostedAt(b.postedAt) - getHoursFromPostedAt(a.postedAt);
        });
        
      case 'price_asc':
        return sorted.sort((a, b) => {
          const priceA = typeof a.price === 'number' ? a.price : 0;
          const priceB = typeof b.price === 'number' ? b.price : 0;
          return priceA - priceB;
        });
        
      case 'price_desc':
        return sorted.sort((a, b) => {
          const priceA = typeof a.price === 'number' ? a.price : 0;
          const priceB = typeof b.price === 'number' ? b.price : 0;
          return priceB - priceA;
        });
        
      case 'pertinence':
      default:
        return sorted;
    }
  }, [filteredListings, filterOptions.sortBy]);

  // Optimize pagination calculations
  const listingsPerPage = 20;
  const paginationData = useMemo(() => {
    const indexOfLastListing = currentPage * listingsPerPage;
    const indexOfFirstListing = indexOfLastListing - listingsPerPage;
    const currentListings = sortedListings.slice(indexOfFirstListing, indexOfLastListing);
    const totalPages = Math.ceil(sortedListings.length / listingsPerPage);
    
    return {
      currentListings,
      totalPages,
      indexOfFirstListing,
      indexOfLastListing
    };
  }, [sortedListings, currentPage]);

  const handlePageChange = useCallback((pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <>
      <ModernFilterBar 
        updateFilterOptions={updateFilterOptions}
        initialSearchTerm={searchParams?.q || ''}
        resultsCount={sortedListings.length}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
      />
      
      {/* Results summary */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {searchParams?.q ? (
            <>Résultats pour "<span className="text-[#E00201]">{searchParams.q}</span>"</>
          ) : searchParams?.category ? (
            <>Annonces dans la catégorie "<span className="text-[#E00201]">{searchParams.category}</span>"</>
          ) : (
            'Toutes les annonces'
          )}
        </h1>
        {searchParams?.q && (
          <p className="text-sm text-gray-500 mt-1">
            Recherche dans les titres et descriptions des annonces
          </p>
        )}
      </div>

      {/* No results message */}
      {paginationData.currentListings.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Aucune annonce trouvée
          </h3>
          <p className="text-gray-500 mb-6">
            Essayez de modifier vos critères de recherche ou explorez d'autres catégories.
          </p>
        </div>
      ) : (
        <>
          {/* Optimized Listings Grid/List */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginationData.currentListings.map((listing) => (
                <div key={listing.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200 p-4">
                  <MemoizedListingCardGrid listing={listing} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-start space-y-8">
              {paginationData.currentListings.map((listing, index) => (
                <React.Fragment key={listing.id}>
                  <div className="w-full">
                    <MemoizedListingCard listing={listing} />
                    {index < paginationData.currentListings.length - 1 && (
                      <div className="border-b border-gray-200 mt-8" />
                    )}
                  </div>
                </React.Fragment>
              ))}
            </div>
          )}
          
          {paginationData.totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={paginationData.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </>
  );
} 