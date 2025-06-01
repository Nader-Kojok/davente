'use client';

import Link from 'next/link';
import Image from 'next/image';
import { getAllCategories } from '@/lib/categories';
import { ChevronRight, Grid3X3, Home } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';

export default function CategoriesPage() {
  const { isAuthenticated } = useAuth();
  const categories = getAllCategories();

  return (
    <div className="bg-gray-50">
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
            <span className="text-gray-900 font-medium">Toutes les catégories</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex justify-center items-center mb-4">
              <Grid3X3 className="w-8 h-8 text-[#E00201] mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">Toutes les catégories</h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explorez toutes nos catégories d'annonces et trouvez exactement ce que vous cherchez. 
              Chaque catégorie contient des sous-catégories spécialisées pour vous aider à affiner votre recherche.
            </p>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden"
            >
              {/* Category Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center mb-3">
                  <span className="text-3xl mr-4">{category.icon}</span>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900">{category.name}</h2>
                    {category.description && (
                      <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                    )}
                  </div>
                </div>
                <Link
                  href={`/categories/${category.slug}`}
                  className="inline-flex items-center text-[#E00201] hover:text-[#B00201] font-medium text-sm transition-colors duration-200"
                >
                  Voir toutes les annonces
                  <ChevronRight className="ml-1 w-4 h-4" />
                </Link>
              </div>

              {/* Subcategories */}
              <div className="p-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  Sous-catégories ({category.subcategories.length})
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {category.subcategories.map((subcategory) => (
                    <Link
                      key={subcategory.id}
                      href={`/categories/${category.slug}?subcategory=${subcategory.slug}`}
                      className="group flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      <span className="text-sm font-medium text-gray-700 group-hover:text-[#E00201] transition-colors duration-200">
                        {subcategory.name}
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#E00201] transition-colors duration-200" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Vous ne trouvez pas ce que vous cherchez ?
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Publiez votre propre annonce gratuitement et atteignez des milliers d'acheteurs potentiels.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={isAuthenticated ? "/publier" : "/login"}
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#E00201] hover:bg-[#B00201] transition-colors duration-200"
              >
                Publier une annonce
              </Link>
              <Link
                href="/annonces"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-[#E00201] text-base font-medium rounded-md text-[#E00201] bg-white hover:bg-[#E00201] hover:text-white transition-colors duration-200"
              >
                Parcourir les annonces
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 