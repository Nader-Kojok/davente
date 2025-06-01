"use client";

import Link from "next/link";
import Image from "next/image";
import { X, Search } from "lucide-react";

interface MobileHeaderProps {
  isMenuOpen: boolean;
  isMobileSearchOpen: boolean;
  isSearchFocused: boolean;
  toggleMenu: () => void;
  toggleMobileSearch: () => void;
}

export default function MobileHeader({
  isMenuOpen,
  isMobileSearchOpen,
  isSearchFocused,
  toggleMenu,
  toggleMobileSearch
}: MobileHeaderProps) {
  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMenu}
        className={`md:hidden items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#E00201] transition-all duration-300 ease-in-out ${isSearchFocused ? "opacity-0 transform -translate-x-10 absolute left-0 invisible" : "opacity-100 transform translate-x-0 relative visible"}`}
        aria-expanded={isMenuOpen}
        aria-controls="mobile-menu"
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
      >
        {isMenuOpen ? <X className="h-6 w-6" /> : (
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </button>

      {/* Mobile Logo */}
      <Link
        href="/"
        className={`md:hidden flex items-center transition-all duration-300 ease-in-out ${isSearchFocused ? "opacity-0 transform scale-90 absolute left-1/2 -translate-x-1/2 invisible" : "opacity-100 transform scale-100 relative visible"}`}
        aria-label="Grabi Home"
      >
        <Image
          src="/logo.svg"
          alt="Grabi Logo"
          width={60}
          height={24}
          className="h-8 w-auto"
          priority
        />
      </Link>

      {/* Mobile Search Button */}
      <button
        onClick={toggleMobileSearch}
        className={`md:hidden items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#E00201] transition-all duration-300 ease-in-out ${isSearchFocused ? "opacity-0 transform translate-x-10 absolute right-0 invisible" : "opacity-100 transform translate-x-0 relative visible"}`}
        aria-label="Open search"
      >
        <Search className="h-6 w-6" />
      </button>
    </>
  );
} 