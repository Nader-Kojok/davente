'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home, Grid3X3, List, Filter } from 'lucide-react';
import { Category, Subcategory } from '@/lib/categories';
import { Listing, ViewMode } from '@/types/listing';
import ListingCard from '@/components/ui/ListingCard';
import ListingCardGrid from '@/components/ui/ListingCardGrid';
import ModernFilterBar from '@/components/ui/ModernFilterBar';

interface CategoryListingsContentProps {
  category: Category;
  subcategory?: Subcategory | null;
  listings: Listing[];
  searchParams: {
    subcategory?: string;
    q?: string;
    location?: string;
    minPrice?: string;
    maxPrice?: string;
    condition?: string;
    userType?: string;
    sortBy?: string;
    page?: string;
  };
  total: number;
}

interface FilterOptions {
  searchTerm?: string;
  category?: string;
  subcategory?: string;
  location?: string;
  priceMin?: number;
  priceMax?: number;
  condition?: string;
  sortBy?: string;
}

export default function CategoryListingsContent({
  category,
  subcategory,
  listings,
  searchParams,
  total
}: CategoryListingsContentProps) {
  const router = useRouter();
  const urlSearchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [currentPage, setCurrentPage] = useState(1);

  // Function to update URL with new filter options
  const updateURL = useCallback((newOptions: FilterOptions) => {
    const params = new URLSearchParams(urlSearchParams.toString());
    
    // Clear existing filter params but preserve subcategory if not explicitly provided
    params.delete('q');
    if (newOptions.subcategory !== undefined) {
      params.delete('subcategory');
    }
    params.delete('location');
    params.delete('minPrice');
    params.delete('maxPrice');
    params.delete('condition');
    params.delete('userType');
    params.delete('sortBy');
    params.delete('page');
    
    // Add new filter params
    if (newOptions.searchTerm) {
      params.set('q', newOptions.searchTerm);
    }
    if (newOptions.subcategory) {
      params.set('subcategory', newOptions.subcategory);
    }
    if (newOptions.location) {
      params.set('location', newOptions.location);
    }
    if (newOptions.priceMin !== undefined) {
      params.set('minPrice', newOptions.priceMin.toString());
    }
    if (newOptions.priceMax !== undefined) {
      params.set('maxPrice', newOptions.priceMax.toString());
    }
    if (newOptions.condition) {
      params.set('condition', newOptions.condition);
    }
    if (newOptions.sortBy) {
      params.set('sortBy', newOptions.sortBy);
    }
    
    // Navigate to new URL
    router.push(`/categories/${category.slug}?${params.toString()}`);
  }, [router, urlSearchParams, category.slug]);

  // Function to update filter options
  const updateFilterOptions = useCallback(
    (newOptions: FilterOptions) => {
      setCurrentPage(1); // Reset to first page on filter change
      updateURL(newOptions);
    },
    [updateURL],
  );

  // Function to handle view mode change
  const handleViewModeChange = useCallback((mode: 'grid' | 'list') => {
    setViewMode(mode);
    setCurrentPage(1); // Reset to first page when changing view mode
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link
              href="/"
              className="inline-flex items-center text-gray-500 hover:text-gray-700 transition-colors"
            >
              <Home className="w-4 h-4 mr-1" />
              Accueil
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-300" />
            <Link
              href="/categories"
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              Catégories
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-300" />
            <Link
              href={`/categories/${category.slug}`}
              className={`transition-colors ${subcategory ? 'text-gray-500 hover:text-gray-700' : 'text-gray-900 font-medium'}`}
            >
              {category.name}
            </Link>
            {subcategory && (
              <>
                <ChevronRight className="w-4 h-4 text-gray-300" />
                <span className="text-gray-900 font-medium">{subcategory.name}</span>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-4xl mr-4">{category.icon}</span>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {subcategory ? subcategory.name : category.name}
                </h1>
                <p className="text-lg text-gray-600 mt-2">
                  {subcategory 
                    ? `${total} annonce${total > 1 ? 's' : ''} dans ${subcategory.name}`
                    : `${total} annonce${total > 1 ? 's' : ''} dans ${category.name}`
                  }
                </p>
                {category.description && !subcategory && (
                  <p className="text-gray-500 mt-1">{category.description}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subcategories (only show if no subcategory is selected) */}
      {!subcategory && category.subcategories.length > 0 && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Sous-catégories</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
              {category.subcategories.map((sub) => (
                <Link
                  key={sub.id}
                  href={`/categories/${category.slug}?subcategory=${sub.slug}`}
                  className="group flex items-center justify-center p-3 rounded-lg border border-gray-200 hover:border-[#E00201] hover:bg-[#E00201] hover:text-white transition-all duration-200"
                >
                  <span className="text-sm font-medium text-center group-hover:text-white transition-colors duration-200">
                    {sub.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Bar */}
        <ModernFilterBar 
          updateFilterOptions={updateFilterOptions}
          initialSearchTerm={searchParams?.q}
          initialSubcategory={subcategory?.slug}
          resultsCount={listings.length}
          viewMode={viewMode === 'map' ? 'grid' : viewMode}
          onViewModeChange={handleViewModeChange}
        />
        
        {/* Results summary */}
        <div className="mb-6">
          {searchParams?.q && (
            <p className="text-sm text-gray-500 mt-1">
              Recherche dans {subcategory ? subcategory.name : category.name}
            </p>
          )}
        </div>

        {/* No results message */}
        {listings.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune annonce trouvée</h3>
            <p className="text-gray-500 mb-4">
              {searchParams?.q 
                ? `Aucune annonce ne correspond à votre recherche "${searchParams.q}" dans cette catégorie`
                : `Aucune annonce n'est disponible dans ${subcategory ? subcategory.name : category.name} pour le moment`
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/publier"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#E00201] hover:bg-[#B00201] transition-colors duration-200"
              >
                Publier une annonce
              </Link>
              <Link
                href="/annonces"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-[#E00201] text-base font-medium rounded-md text-[#E00201] bg-white hover:bg-[#E00201] hover:text-white transition-colors duration-200"
              >
                Voir toutes les annonces
              </Link>
            </div>
          </div>
        ) : (
          /* Listings Grid/List */
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {listings.map((listing) => (
                  <div
                    key={listing.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200 p-4"
                  >
                    <ListingCardGrid listing={listing} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-start space-y-6">
                {listings.map((listing, index) => (
                  <div key={listing.id} className="w-full">
                    <ListingCard listing={listing} />
                    {index < listings.length - 1 && (
                      <div className="border-b border-gray-200 mt-6" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 