"use client";

import { useState, useCallback, Fragment } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getCategoriesForDisplay } from "@/lib/categories";
import MegaMenu from "../ui/MegaMenu";

interface CategoriesSliderProps {
  hoveredCategory: string | null;
  setHoveredCategory: (category: string | null) => void;
  isMegaMenuHovered: boolean;
  setIsMegaMenuHovered: (hovered: boolean) => void;
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;
}

export default function CategoriesSlider({
  hoveredCategory,
  setHoveredCategory,
  isMegaMenuHovered,
  setIsMegaMenuHovered,
  handleMouseEnter,
  handleMouseLeave
}: CategoriesSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const allCategories = getCategoriesForDisplay();
  const categoriesPerSlide = 6;
  const totalSlides = Math.ceil(allCategories.length / categoriesPerSlide);
  
  // Get categories for current slide
  const getCurrentSlideCategories = () => {
    const startIndex = currentSlide * categoriesPerSlide;
    return allCategories.slice(startIndex, startIndex + categoriesPerSlide);
  };

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const handleCategoryMouseEnter = useCallback((categoryName: string) => {
    setHoveredCategory(categoryName);
    setIsMegaMenuHovered(true);
  }, [setHoveredCategory, setIsMegaMenuHovered]);

  const handleCategoryMouseLeave = useCallback(() => {
    // Don't immediately close, let the handleMouseLeave from parent handle the delay
    handleMouseLeave();
  }, [handleMouseLeave]);

  return (
    <>
      {/* Categories Slider for Desktop */}
      <div 
        className="hidden md:block bg-gray-100 border-b border-gray-200 relative"
        onMouseLeave={handleCategoryMouseLeave}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            {/* Previous Button */}
            <button
              onClick={prevSlide}
              disabled={totalSlides <= 1}
              className={`flex-shrink-0 p-2 rounded-full border-2 transition-all duration-200 ${
                totalSlides <= 1 
                  ? 'text-gray-300 border-gray-200 cursor-not-allowed bg-gray-50' 
                  : 'text-[#E00201] border-[#E00201] bg-white hover:bg-[#E00201] hover:text-white shadow-md hover:shadow-lg'
              }`}
              aria-label="Catégories précédentes"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Categories Navigation */}
            <nav className="flex-1 flex justify-center items-center overflow-hidden" aria-label="Categories">
              <div className="flex items-center space-x-8 transition-all duration-300 ease-in-out">
                {getCurrentSlideCategories().map((category, index) => (
                  <Fragment key={`${currentSlide}-${category.name}`}>
                    {index > 0 && (
                      <span className="text-gray-400 font-bold text-lg" aria-hidden="true">•</span>
                    )}
                    <div
                      onMouseEnter={() => handleCategoryMouseEnter(category.name)}
                      className="relative"
                    >
                      <Link
                        href={category.href}
                        className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors duration-200 whitespace-nowrap"
                      >
                        {category.name}
                      </Link>
                    </div>
                  </Fragment>
                ))}
              </div>
            </nav>

            {/* Next Button */}
            <button
              onClick={nextSlide}
              disabled={totalSlides <= 1}
              className={`flex-shrink-0 p-2 rounded-full border-2 transition-all duration-200 ${
                totalSlides <= 1 
                  ? 'text-gray-300 border-gray-200 cursor-not-allowed bg-gray-50' 
                  : 'text-[#E00201] border-[#E00201] bg-white hover:bg-[#E00201] hover:text-white shadow-md hover:shadow-lg'
              }`}
              aria-label="Catégories suivantes"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* MegaMenu */}
      {(hoveredCategory || isMegaMenuHovered) && (
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="absolute w-full z-30"
        >
          <MegaMenu
            category={
              allCategories.find((cat) => cat.name === hoveredCategory) ||
              allCategories[0]
            }
            isOpen={true}
          />
        </div>
      )}
    </>
  );
} 