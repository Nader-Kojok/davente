'use client';

import { useState } from 'react';
import { MapPin, SlidersHorizontal, ChevronDown } from 'lucide-react';

export default function FilterBar() {
  const [location, setLocation] = useState('Choisir une localisation');
  const [sortBy, setSortBy] = useState('recent');
  // activeDropdown can be 'location', 'sort', 'filters', or null
  const [activeDropdown, setActiveDropdown] = useState<'location' | 'sort' | 'filters' | null>(null);

  const locations = ['Dakar', 'Saint-Louis', 'Thiès', 'Toutes les villes'];
  const sortOptions = [
    { value: 'recent', label: 'Plus récentes' },
    { value: 'oldest', label: 'Plus anciennes' },
    { value: 'price_asc', label: 'Prix croissant' },
    { value: 'price_desc', label: 'Prix décroissant' }
  ];

  return (
      <div className="z-40 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-wrap gap-4">
          {/* Location selector */}
          <div className="relative w-full sm:w-72">
            <button
              className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-lg
                         hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EC5A12]
                         focus:border-transparent flex items-center justify-between"
              onClick={() =>
                setActiveDropdown(activeDropdown === 'location' ? null : 'location')
              }
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">{location}</span>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>
            {activeDropdown === 'location' && (
              <div className="absolute mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                {locations.map((loc) => (
                  <button
                    key={loc}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 text-gray-700
                               first:rounded-t-lg last:rounded-b-lg"
                    onClick={() => {
                      setLocation(loc);
                      setActiveDropdown(null);
                    }}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sort by filter */}
          <div className="relative w-full sm:w-48">
            <button
              className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-lg
                         hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EC5A12]
                         focus:border-transparent flex items-center justify-between"
              onClick={() =>
                setActiveDropdown(activeDropdown === 'sort' ? null : 'sort')
              }
            >
              <span className="text-gray-700">
                {sortOptions.find((option) => option.value === sortBy)?.label ||
                  'Trier par'}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>
            {activeDropdown === 'sort' && (
              <div className="absolute mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 text-gray-700
                               first:rounded-t-lg last:rounded-b-lg"
                    onClick={() => {
                      setSortBy(option.value);
                      setActiveDropdown(null);
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Price filter (static button for now) */}
          <div className="relative w-full sm:w-48">
            <button
              className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-lg
                         hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EC5A12]
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
                         hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EC5A12]
                         focus:border-transparent flex items-center justify-between"
            >
              <span className="text-gray-700">Type</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* Filters button */}
          <button
            className="w-full sm:w-auto px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg
                       hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#EC5A12] focus:ring-opacity-50
                       flex items-center gap-2 transition-colors duration-200 justify-center"
            onClick={() =>
              setActiveDropdown(activeDropdown === 'filters' ? null : 'filters')
            }
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filtres</span>
          </button>
        </div>

        {/* Category filter */}
        <div className="mt-4">
          <button
            className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-full
                       hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EC5A12]
                       focus:ring-opacity-50 transition-colors duration-200"
          >
            Services de jardinerie &amp; bricolage
          </button>
        </div>
      </div>
  );
}
