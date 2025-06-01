// File: components/MegaFooter.tsx
"use client";

import BaseLink from "next/link";
import { getAllCategories } from "@/lib/categories";

export default function MegaFooter() {
  // Get categories from our centralized service
  const categories = getAllCategories();

  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-8 gap-y-10">
          {categories.map((category) => (
            <div key={category.id} className="flex flex-col">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </h2>
              <ul className="space-y-2.5 flex-1">
                {category.subcategories.map((subcategory) => (
                  <li key={subcategory.id}>
                    <BaseLink
                      href={`/categories/${category.slug}?subcategory=${subcategory.slug}`}
                      className="text-sm text-gray-600 hover:text-[#E00201] hover:translate-x-0.5 transition-all duration-200 inline-block"
                    >
                      {subcategory.name}
                    </BaseLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
