'use client';

import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { getAllCategories, type Category } from '@/lib/categories';

type CategorySelectProps = {
  onSelect: (category: string, subcategory: string) => void;
};

export default function CategorySelect({ onSelect }: CategorySelectProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const categories = getAllCategories();

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category);
  };

  const handleSubcategoryClick = (subcategoryId: string) => {
    if (selectedCategory) {
      onSelect(selectedCategory.id, subcategoryId);
    }
  };

  const handleBack = () => {
    setSelectedCategory(null);
  };

  if (selectedCategory) {
    return (
      <div>
        <button
          onClick={handleBack}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Retour aux catégories
        </button>

        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          {selectedCategory.name}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {selectedCategory.subcategories.map((subcategory) => (
            <button
              key={subcategory.id}
              onClick={() => handleSubcategoryClick(subcategory.id)}
              className="p-4 text-left border rounded-lg hover:border-[#E00201] hover:shadow-sm transition-all duration-200"
            >
              <span className="text-lg font-medium text-gray-900">
                {subcategory.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Choisissez une catégorie
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category)}
            className="p-6 text-center border rounded-lg hover:border-[#E00201] hover:shadow-sm transition-all duration-200"
          >
            <span className="text-4xl mb-3 block">{category.icon}</span>
            <span className="text-lg font-medium text-gray-900">
              {category.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}