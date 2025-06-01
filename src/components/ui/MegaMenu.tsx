// src/components/ui/MegaMenu.tsx
'use client';

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import BaseLink from "@/components/ui/BaseLink";
import { getAllCategories, getCategoryBySlug } from "@/lib/categories";

type MegaMenuProps = {
  category: {
    name: string;
    href: string;
  };
  isOpen: boolean;
};

// Helper function to extract category slug from href
function extractCategorySlug(href: string): string {
  const parts = href.split('/');
  return parts[parts.length - 1] || '';
}

export default function MegaMenu({ category, isOpen }: MegaMenuProps) {
  if (!isOpen) return null;

  // Extract category slug from href
  const categorySlug = extractCategorySlug(category.href);
  
  // Get category data from our centralized service
  const categoryData = getCategoryBySlug(categorySlug);
  
  if (!categoryData || !categoryData.subcategories || categoryData.subcategories.length === 0) {
    return null;
  }

  // Group subcategories into columns (max 2 columns)
  const subcategoriesPerColumn = Math.ceil(categoryData.subcategories.length / 2);
  const leftColumn = categoryData.subcategories.slice(0, subcategoriesPerColumn);
  const rightColumn = categoryData.subcategories.slice(subcategoriesPerColumn);

  return (
    <div
      className="absolute left-0 w-full bg-white shadow-lg border-t border-gray-200 transition-all duration-200 ease-in-out transform z-30"
      style={{ top: "100%" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Category Header */}
        <div className="flex items-center mb-6 pb-4 border-b border-gray-100">
          <span className="text-2xl mr-3">{categoryData.icon}</span>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{categoryData.name}</h2>
            {categoryData.description && (
              <p className="text-sm text-gray-600 mt-1">{categoryData.description}</p>
            )}
          </div>
        </div>

        {/* Subcategories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {/* Left Column */}
          <div className="space-y-4">
            {leftColumn.map((subcategory) => (
              <div key={subcategory.id} className="group">
                <Link 
                  href={`/categories/${categoryData.slug}?subcategory=${subcategory.slug}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <div>
                    <span className="text-base font-medium text-gray-900 group-hover:text-[#E00201] transition-colors duration-200">
                      {subcategory.name}
                    </span>
                    {subcategory.description && (
                      <p className="text-sm text-gray-500 mt-1">
                        {subcategory.description}
                      </p>
                    )}
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-[#E00201] transition-colors duration-200" />
                </Link>
              </div>
            ))}
          </div>

          {/* Right Column */}
          {rightColumn.length > 0 && (
            <div className="space-y-4">
              {rightColumn.map((subcategory) => (
                <div key={subcategory.id} className="group">
                  <Link 
                    href={`/categories/${categoryData.slug}?subcategory=${subcategory.slug}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div>
                      <span className="text-base font-medium text-gray-900 group-hover:text-[#E00201] transition-colors duration-200">
                        {subcategory.name}
                      </span>
                      {subcategory.description && (
                        <p className="text-sm text-gray-500 mt-1">
                          {subcategory.description}
                        </p>
                      )}
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-[#E00201] transition-colors duration-200" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* View All Link */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <BaseLink
            href={`/categories/${categoryData.slug}`}
            className="inline-flex items-center text-[#E00201] hover:text-[#B00201] font-medium transition-colors duration-200"
          >
            Voir toutes les annonces dans {categoryData.name}
            <ChevronRight className="ml-1 h-4 w-4" />
          </BaseLink>
        </div>
      </div>
    </div>
  );
}
