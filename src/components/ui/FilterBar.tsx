// src/components/ui/FilterBar.tsx
'use client';

import { useState, useCallback } from 'react';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';
import Select from '@/components/ui/Select'; // Import Select

export interface FilterOptions {
  location?: string;
  sortBy?: string;
  priceMin?: number; // Add priceMin
  priceMax?: number; // Add priceMax
}

interface FilterBarProps {
  updateFilterOptions: (options: FilterOptions) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ updateFilterOptions }) => {
  const [location, setLocation] = useState<string | undefined>(undefined);
  const [sortBy, setSortBy] = useState<string | undefined>(undefined);

  const locations = [
    { value: undefined, label: 'Choisir une localisation' },
    { value: 'Dakar', label: 'Dakar' },
    { value: 'Saint-Louis', label: 'Saint-Louis' },
    { value: 'Thiès', label: 'Thiès' },
    { value: 'Toutes les villes', label: 'Toutes les villes' },
  ];
  const sortOptions = [
    { value: undefined, label: 'Trier par' },
    { value: 'recent', label: 'Plus récentes' },
    { value: 'oldest', label: 'Plus anciennes' },
    { value: 'price_asc', label: 'Prix croissant' },
    { value: 'price_desc', label: 'Prix décroissant' },
  ];

  const handleLocationChange = useCallback(
    (loc: string | undefined) => {
      setLocation(loc);
      updateFilterOptions({ location: loc });
    },
    [updateFilterOptions],
  );

  const handleSortByChange = useCallback(
    (sortValue: string | undefined) => {
      setSortBy(sortValue);
      updateFilterOptions({ sortBy: sortValue });
    },
    [updateFilterOptions],
  );

  return (
    <div className="z-40 max-w-6xl mx-auto py-4">
      <div className="flex flex-wrap gap-4">
        {/* Location selector */}
        <div className="relative w-full sm:w-72">
          <Select
            id="location"
            value={location}
            onChange={(e) => handleLocationChange(e.target.value)}
            options={locations}
          />
        </div>

        {/* Sort by filter */}
        <div className="relative w-full sm:w-48">
          <Select
            id="sortBy"
            value={sortBy}
            onChange={(e) => handleSortByChange(e.target.value)}
            options={sortOptions}
          />
        </div>

        {/* Price filter (static button for now) */}
        <div className="relative w-full sm:w-48">
          <button
            className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-lg
                         hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E00201]
                         focus:border-transparent flex items-center justify-between"
          >
            <span className="text-gray-700">Prix</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Type filter (static button for now) */}
        <div className="relative w-full sm:w-48">
          <button
            className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-lg
                         hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E00201]
                         focus:border-transparent flex items-center justify-between"
          >
            <span className="text-gray-700">Type</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Filters button */}
        <button
          className="w-full sm:w-auto px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg
                       hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#E00201] focus:ring-opacity-50
                       flex items-center gap-2 transition-colors duration-200 justify-center"
          onClick={() => console.log('Filters Clicked')}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filtres</span>
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
