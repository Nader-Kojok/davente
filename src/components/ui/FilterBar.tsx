// src/components/ui/FilterBar.tsx
'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  X, 
  ChevronDown, 
  Package, 
  Tag, 
  Euro,
  ArrowUpDown
} from 'lucide-react';
import { getCategoriesForDisplay } from '@/lib/categories';

export interface FilterOptions {
  location?: string;
  sortBy?: string;
  priceMin?: number;
  priceMax?: number;
  category?: string;
  condition?: string;
  deliveryAvailable?: boolean;
  searchTerm?: string;
}

interface FilterBarProps {
  updateFilterOptions: (options: FilterOptions) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ updateFilterOptions }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('pertinence');
  const [priceRange, setPriceRange] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [deliveryExtended, setDeliveryExtended] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  
  // Dropdown states
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  // Refs for dropdowns
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const locations = [
    'Toute la France',
    'Dakar', 'Saint-Louis', 'Thiès', 'Kaolack', 'Ziguinchor',
    'Diourbel', 'Tambacounda', 'Fatick', 'Kolda', 'Sédhiou',
    'Kaffrine', 'Kédougou', 'Matam', 'Louga'
  ];

  const priceRanges = [
    { label: 'Tous les prix', value: '', icon: '💰' },
    { label: 'Moins de 10K', value: '0-10000', icon: '💵' },
    { label: '10K - 50K', value: '10000-50000', icon: '💶' },
    { label: '50K - 100K', value: '50000-100000', icon: '💷' },
    { label: '100K - 500K', value: '100000-500000', icon: '💸' },
    { label: 'Plus de 500K', value: '500000-', icon: '💎' }
  ];

  const sortOptions = [
    { label: 'Pertinence', value: 'pertinence', icon: '🎯' },
    { label: 'Plus récentes', value: 'recent', icon: '🆕' },
    { label: 'Plus anciennes', value: 'oldest', icon: '📅' },
    { label: 'Prix croissant', value: 'price_asc', icon: '📈' },
    { label: 'Prix décroissant', value: 'price_desc', icon: '📉' }
  ];

  const categories = [
    { name: 'Toutes catégories', icon: '🏷️' },
    ...getCategoriesForDisplay().map(cat => ({ name: cat.name, icon: cat.icon }))
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      let clickedInside = false;
      
      Object.values(dropdownRefs.current).forEach(ref => {
        if (ref && ref.contains(target)) {
          clickedInside = true;
        }
      });
      
      if (!clickedInside) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const updateFilters = useCallback(() => {
    const filters: FilterOptions = {
      location: location || undefined,
      sortBy: sortBy || undefined,
      searchTerm: searchTerm || undefined,
      deliveryAvailable: deliveryExtended || undefined,
      category: category || undefined
    };

    if (priceRange) {
      const [min, max] = priceRange.split('-').map(p => p ? parseInt(p) : undefined);
      filters.priceMin = min;
      filters.priceMax = max;
    }

    updateFilterOptions(filters);
  }, [location, sortBy, priceRange, category, deliveryExtended, searchTerm, updateFilterOptions]);

  useEffect(() => {
    updateFilters();
  }, [updateFilters]);

  const toggleDropdown = (dropdownName: string) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  const handleLocationSelect = (loc: string) => {
    setLocation(loc === 'Toute la France' ? '' : loc);
    setActiveDropdown(null);
  };

  const handlePriceSelect = (price: string) => {
    setPriceRange(price);
    setActiveDropdown(null);
  };

  const handleSortSelect = (sort: string) => {
    setSortBy(sort);
    setActiveDropdown(null);
  };

  const handleCategorySelect = (cat: string) => {
    setCategory(cat === 'Toutes catégories' ? '' : cat);
    setActiveDropdown(null);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setLocation('');
    setSortBy('pertinence');
    setPriceRange('');
    setCategory('');
    setDeliveryExtended(false);
    setActiveDropdown(null);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if (location) count++;
    if (priceRange) count++;
    if (category) count++;
    if (deliveryExtended) count++;
    if (sortBy !== 'pertinence') count++;
    return count;
  };

  const getLocationDisplayText = () => location || 'Localisation';
  const getPriceDisplayText = () => priceRanges.find(p => p.value === priceRange)?.label || 'Prix';
  const getSortDisplayText = () => sortOptions.find(s => s.value === sortBy)?.label || 'Tri';
  const getCategoryDisplayText = () => category || 'Catégorie';

  return (
    <div className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Search Bar */}
        <div className="py-6">
          <div className="relative max-w-4xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Que recherchez-vous ?"
                className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-gray-50 hover:bg-white"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="pb-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Location Filter */}
            <div className="relative" ref={(el) => { dropdownRefs.current.location = el; }}>
              <button
                onClick={() => toggleDropdown('location')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all duration-200 ${
                  location 
                    ? 'bg-blue-50 border-blue-200 text-blue-700' 
                    : 'bg-white border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span className="font-medium">{getLocationDisplayText()}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === 'location' ? 'rotate-180' : ''}`} />
              </button>
              
              {activeDropdown === 'location' && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto">
                  <div className="p-2">
                    {locations.map((loc) => (
                      <button
                        key={loc}
                        onClick={() => handleLocationSelect(loc)}
                        className={`w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors ${
                          (location === loc || (loc === 'Toute la France' && !location)) ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span>{loc}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Category Filter */}
            <div className="relative" ref={(el) => { dropdownRefs.current.category = el; }}>
              <button
                onClick={() => toggleDropdown('category')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all duration-200 ${
                  category 
                    ? 'bg-purple-50 border-purple-200 text-purple-700' 
                    : 'bg-white border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <Tag className="w-4 h-4" />
                <span className="font-medium">{getCategoryDisplayText()}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === 'category' ? 'rotate-180' : ''}`} />
              </button>
              
              {activeDropdown === 'category' && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto">
                  <div className="p-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.name}
                        onClick={() => handleCategorySelect(cat.name)}
                        className={`w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors ${
                          (category === cat.name || (cat.name === 'Toutes catégories' && !category)) ? 'bg-purple-50 text-purple-700' : 'text-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{cat.icon}</span>
                          <span>{cat.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Price Filter */}
            <div className="relative" ref={(el) => { dropdownRefs.current.price = el; }}>
              <button
                onClick={() => toggleDropdown('price')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all duration-200 ${
                  priceRange 
                    ? 'bg-green-50 border-green-200 text-green-700' 
                    : 'bg-white border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <Euro className="w-4 h-4" />
                <span className="font-medium">{getPriceDisplayText()}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === 'price' ? 'rotate-180' : ''}`} />
              </button>
              
              {activeDropdown === 'price' && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-50">
                  <div className="p-2">
                    {priceRanges.map((price) => (
                      <button
                        key={price.value}
                        onClick={() => handlePriceSelect(price.value)}
                        className={`w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors ${
                          (priceRange === price.value || (price.value === '' && !priceRange)) ? 'bg-green-50 text-green-700' : 'text-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{price.icon}</span>
                          <span>{price.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Delivery Toggle */}
            <button
              onClick={() => setDeliveryExtended(!deliveryExtended)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all duration-200 ${
                deliveryExtended 
                  ? 'bg-orange-50 border-orange-200 text-orange-700' 
                  : 'bg-white border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <Package className="w-4 h-4" />
              <span className="font-medium">Livraison</span>
            </button>

            {/* Sort Filter */}
            <div className="relative" ref={(el) => { dropdownRefs.current.sort = el; }}>
              <button
                onClick={() => toggleDropdown('sort')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all duration-200 ${
                  sortBy !== 'pertinence' 
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                    : 'bg-white border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <ArrowUpDown className="w-4 h-4" />
                <span className="font-medium">{getSortDisplayText()}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === 'sort' ? 'rotate-180' : ''}`} />
              </button>
              
              {activeDropdown === 'sort' && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl z-50">
                  <div className="p-2">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleSortSelect(option.value)}
                        className={`w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors ${
                          sortBy === option.value ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{option.icon}</span>
                          <span>{option.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Clear Filters */}
            {getActiveFiltersCount() > 0 && (
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 border-2 border-red-200 text-red-700 hover:bg-red-100 transition-all duration-200"
              >
                <X className="w-4 h-4" />
                <span className="font-medium">Effacer ({getActiveFiltersCount()})</span>
              </button>
            )}
          </div>
        </div>

        {/* Active Filters Summary */}
        {getActiveFiltersCount() > 0 && (
          <div className="pb-4">
            <div className="flex flex-wrap gap-2">
              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  <Search className="w-3 h-3" />
                  "{searchTerm}"
                  <button onClick={() => setSearchTerm('')} className="ml-1 hover:bg-blue-200 rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {location && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  <MapPin className="w-3 h-3" />
                  {location}
                  <button onClick={() => setLocation('')} className="ml-1 hover:bg-blue-200 rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {category && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                  <Tag className="w-3 h-3" />
                  {category}
                  <button onClick={() => setCategory('')} className="ml-1 hover:bg-purple-200 rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {priceRange && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  <Euro className="w-3 h-3" />
                  {getPriceDisplayText()}
                  <button onClick={() => setPriceRange('')} className="ml-1 hover:bg-green-200 rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {deliveryExtended && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                  <Package className="w-3 h-3" />
                  Livraison
                  <button onClick={() => setDeliveryExtended(false)} className="ml-1 hover:bg-orange-200 rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
