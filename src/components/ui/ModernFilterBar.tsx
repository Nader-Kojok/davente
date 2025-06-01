'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  DollarSign, 
  Grid3X3, 
  List, 
  SlidersHorizontal,
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
  subcategory?: string;
  condition?: string;
  deliveryAvailable?: boolean;
  searchTerm?: string;
}

interface ModernFilterBarProps {
  updateFilterOptions: (options: FilterOptions) => void;
  initialSearchTerm?: string;
  initialSubcategory?: string;
  resultsCount?: number;
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
}

const ModernFilterBar: React.FC<ModernFilterBarProps> = ({ 
  updateFilterOptions, 
  initialSearchTerm = '',
  initialSubcategory = '',
  resultsCount = 0,
  viewMode = 'list',
  onViewModeChange
}) => {
  const [searchTerm, setSearchTerm] = useState<string>(initialSearchTerm);
  const [location, setLocation] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('pertinence');
  const [priceRange, setPriceRange] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [subcategory, setSubcategory] = useState<string>(initialSubcategory);
  const [deliveryExtended, setDeliveryExtended] = useState<boolean>(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);
  
  // Dropdown states
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  // Refs for dropdowns
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const locations = [
    'Toutes les régions',
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
      category: category || undefined,
      subcategory: subcategory || undefined
    };

    if (priceRange) {
      const [min, max] = priceRange.split('-').map(p => p ? parseInt(p) : undefined);
      filters.priceMin = min;
      filters.priceMax = max;
    }

    updateFilterOptions(filters);
  }, [location, sortBy, priceRange, category, deliveryExtended, searchTerm, updateFilterOptions, subcategory]);

  useEffect(() => {
    updateFilters();
  }, [updateFilters]);

  const toggleDropdown = (dropdownName: string) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  const handleLocationSelect = (loc: string) => {
    setLocation(loc === 'Toutes les régions' ? '' : loc);
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

  const handleSubcategorySelect = (subcat: string) => {
    setSubcategory(subcat === 'Toutes sous-catégories' ? '' : subcat);
    setActiveDropdown(null);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setLocation('');
    setSortBy('pertinence');
    setPriceRange('');
    setCategory('');
    setSubcategory('');
    setDeliveryExtended(false);
    setActiveDropdown(null);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if (location) count++;
    if (priceRange) count++;
    if (category) count++;
    if (subcategory) count++;
    if (deliveryExtended) count++;
    if (sortBy !== 'pertinence') count++;
    return count;
  };

  const getLocationDisplayText = () => location || 'Localisation';
  const getPriceDisplayText = () => priceRanges.find(p => p.value === priceRange)?.label || 'Prix';
  const getSortDisplayText = () => sortOptions.find(s => s.value === sortBy)?.label || 'Tri';
  const getCategoryDisplayText = () => category || 'Catégorie';
  const getSubcategoryDisplayText = () => subcategory || 'Sous-catégorie';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
      {/* Header avec barre de recherche principale */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Barre de recherche */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Que recherchez-vous ?"
                className="w-full pl-12 pr-12 py-3 text-base border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>
          </div>

          {/* Actions rapides */}
          <div className="flex items-center gap-3">
            {/* Toggle filtres avancés */}
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all duration-200 ${
                showAdvancedFilters || getActiveFiltersCount() > 0
                  ? 'bg-blue-50 border-blue-200 text-blue-700' 
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline font-medium">Filtres</span>
              {getActiveFiltersCount() > 0 && (
                <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getActiveFiltersCount()}
                </span>
              )}
            </button>

            {/* Mode d'affichage */}
            {onViewModeChange && (
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => onViewModeChange('list')}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-white shadow-sm text-gray-900' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onViewModeChange('grid')}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-white shadow-sm text-gray-900' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Résumé des résultats */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{resultsCount.toLocaleString()}</span> annonce{resultsCount > 1 ? 's' : ''} trouvée{resultsCount > 1 ? 's' : ''}
          </p>
          
          {/* Tri rapide */}
          <div className="relative" ref={(el) => { dropdownRefs.current.sort = el; }}>
            <button
              onClick={() => toggleDropdown('sort')}
              className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 transition-all duration-200"
            >
              <ArrowUpDown className="w-4 h-4" />
              <span>{getSortDisplayText()}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === 'sort' ? 'rotate-180' : ''}`} />
            </button>
            
            {activeDropdown === 'sort' && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
                <div className="p-2">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleSortSelect(option.value)}
                      className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors ${
                        sortBy === option.value ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm">{option.icon}</span>
                        <span className="text-sm">{option.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filtres avancés */}
      {showAdvancedFilters && (
        <div className="p-6 bg-gray-50 border-b border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Localisation */}
            <div className="relative" ref={(el) => { dropdownRefs.current.location = el; }}>
              <label className="block text-sm font-medium text-gray-700 mb-2">Localisation</label>
              <button
                onClick={() => toggleDropdown('location')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-200 ${
                  location 
                    ? 'bg-white border-blue-200 text-blue-700' 
                    : 'bg-white border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{getLocationDisplayText()}</span>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === 'location' ? 'rotate-180' : ''}`} />
              </button>
              
              {activeDropdown === 'location' && (
                <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
                  <div className="p-2">
                    {locations.map((loc) => (
                      <button
                        key={loc}
                        onClick={() => handleLocationSelect(loc)}
                        className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors ${
                          (location === loc || (loc === 'Toutes les régions' && !location)) ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{loc}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Catégorie */}
            <div className="relative" ref={(el) => { dropdownRefs.current.category = el; }}>
              <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
              <button
                onClick={() => toggleDropdown('category')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-200 ${
                  category 
                    ? 'bg-white border-purple-200 text-purple-700' 
                    : 'bg-white border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  <span className="text-sm">{getCategoryDisplayText()}</span>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === 'category' ? 'rotate-180' : ''}`} />
              </button>
              
              {activeDropdown === 'category' && (
                <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
                  <div className="p-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.name}
                        onClick={() => handleCategorySelect(cat.name)}
                        className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors ${
                          (category === cat.name || (cat.name === 'Toutes catégories' && !category)) ? 'bg-purple-50 text-purple-700' : 'text-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm">{cat.icon}</span>
                          <span className="text-sm">{cat.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sous-catégorie */}
            <div className="relative" ref={(el) => { dropdownRefs.current.subcategory = el; }}>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sous-catégorie</label>
              <button
                onClick={() => toggleDropdown('subcategory')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-200 ${
                  subcategory 
                    ? 'bg-white border-teal-200 text-teal-700' 
                    : 'bg-white border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  <span className="text-sm">{getSubcategoryDisplayText()}</span>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === 'subcategory' ? 'rotate-180' : ''}`} />
              </button>
              
              {activeDropdown === 'subcategory' && (
                <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
                  <div className="p-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.name}
                        onClick={() => handleSubcategorySelect(cat.name)}
                        className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors ${
                          (subcategory === cat.name || (cat.name === 'Toutes sous-catégories' && !subcategory)) ? 'bg-teal-50 text-teal-700' : 'text-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm">{cat.icon}</span>
                          <span className="text-sm">{cat.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Prix */}
            <div className="relative" ref={(el) => { dropdownRefs.current.price = el; }}>
              <label className="block text-sm font-medium text-gray-700 mb-2">Prix</label>
              <button
                onClick={() => toggleDropdown('price')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-200 ${
                  priceRange 
                    ? 'bg-white border-green-200 text-green-700' 
                    : 'bg-white border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Euro className="w-4 h-4" />
                  <span className="text-sm">{getPriceDisplayText()}</span>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === 'price' ? 'rotate-180' : ''}`} />
              </button>
              
              {activeDropdown === 'price' && (
                <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-50">
                  <div className="p-2">
                    {priceRanges.map((price) => (
                      <button
                        key={price.value}
                        onClick={() => handlePriceSelect(price.value)}
                        className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors ${
                          (priceRange === price.value || (price.value === '' && !priceRange)) ? 'bg-green-50 text-green-700' : 'text-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm">{price.icon}</span>
                          <span className="text-sm">{price.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Options supplémentaires */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
              <button
                onClick={() => setDeliveryExtended(!deliveryExtended)}
                className={`w-full flex items-center gap-2 px-4 py-3 rounded-xl border transition-all duration-200 ${
                  deliveryExtended 
                    ? 'bg-white border-orange-200 text-orange-700' 
                    : 'bg-white border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <Package className="w-4 h-4" />
                <span className="text-sm">Livraison disponible</span>
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              {/* Tags des filtres actifs */}
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
              {subcategory && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm">
                  <Tag className="w-3 h-3" />
                  {subcategory}
                  <button onClick={() => setSubcategory('')} className="ml-1 hover:bg-teal-200 rounded-full p-0.5">
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

            {/* Bouton effacer */}
            {getActiveFiltersCount() > 0 && (
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all duration-200"
              >
                <X className="w-4 h-4" />
                <span className="text-sm font-medium">Effacer tout</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModernFilterBar; 