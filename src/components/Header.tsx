"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect, useCallback } from "react";
import { Grid3X3 } from "lucide-react";
import MobileSearch from "./ui/MobileSearch";
import MobileHeader from "./Header/MobileHeader";
import MobileMenu from "./Header/MobileMenu";
import SearchBar from "./Header/SearchBar";
import DesktopNavigation from "./Header/DesktopNavigation";
import CategoriesSlider from "./Header/CategoriesSlider";
import UserMenu from "./Header/UserMenu";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [isMegaMenuHovered, setIsMegaMenuHovered] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [userMenuPosition, setUserMenuPosition] = useState({ top: 0, right: 0 });
  const closeTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const handleMouseLeave = useCallback(() => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsMegaMenuHovered(false);
      setHoveredCategory(null);
    }, 100);
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    setIsMegaMenuHovered(true);
  }, []);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
    if (isSearchFocused) setIsSearchFocused(false);
    if (isMobileSearchOpen) setIsMobileSearchOpen(false);
  }, [isSearchFocused, isMobileSearchOpen]);

  const toggleMobileSearch = useCallback(() => {
    setIsMobileSearchOpen((prev) => !prev);
    if (isMenuOpen) setIsMenuOpen(false);
  }, [isMenuOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSearchFocused(false);
        setIsMenuOpen(false);
        setIsUserMenuOpen(false);
        setIsMobileSearchOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    if (isMenuOpen || isMobileSearchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen, isMobileSearchOpen]);

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white shadow-sm" role="banner">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center h-20 relative px-4">
            <MobileHeader
              isMenuOpen={isMenuOpen}
              isMobileSearchOpen={isMobileSearchOpen}
              isSearchFocused={isSearchFocused}
              toggleMenu={toggleMenu}
              toggleMobileSearch={toggleMobileSearch}
            />

            {/* Desktop Logo */}
            <Link
              href="/"
              className={`hidden md:flex items-center transition-all duration-300 ease-in-out mr-8 ${isSearchFocused ? "transform scale-90 opacity-70" : ""}`}
              aria-label="Grabi Home"
            >
              <Image
                src="/logo.svg"
                alt="Grabi Logo"
                width={80}
                height={30}
                className="h-10 w-auto"
                priority
              />
            </Link>

            <div className="hidden md:block">
              <Link
                href="/categories"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <Grid3X3 className="w-4 h-4 mr-2" />
                Toutes les catégories
              </Link>
            </div>

            <SearchBar
              isSearchFocused={isSearchFocused}
              setIsSearchFocused={setIsSearchFocused}
            />

            <DesktopNavigation
              isSearchFocused={isSearchFocused}
              isUserMenuOpen={isUserMenuOpen}
              setIsUserMenuOpen={setIsUserMenuOpen}
              setUserMenuPosition={setUserMenuPosition}
            />
          </div>

          <MobileMenu
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
          />
        </div>

        <CategoriesSlider
          hoveredCategory={hoveredCategory}
          setHoveredCategory={setHoveredCategory}
          isMegaMenuHovered={isMegaMenuHovered}
          setIsMegaMenuHovered={setIsMegaMenuHovered}
          handleMouseEnter={handleMouseEnter}
          handleMouseLeave={handleMouseLeave}
        />
      </header>

      <MobileSearch 
        isOpen={isMobileSearchOpen} 
        onClose={() => setIsMobileSearchOpen(false)} 
      />

      <UserMenu
        isUserMenuOpen={isUserMenuOpen}
        setIsUserMenuOpen={setIsUserMenuOpen}
        userMenuPosition={userMenuPosition}
      />
    </>
  );
}
