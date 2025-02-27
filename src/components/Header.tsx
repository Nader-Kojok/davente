"use client";

import Link from "next/link";
import Image from "next/image";
import PrimaryButton from './ui/PrimaryButton';
import { useState, useRef, useEffect, Fragment } from "react";
import { SquarePlus } from "lucide-react";
import MegaMenu from './ui/MegaMenu';

const categories = [
  { name: "Immobilier", href: "/categories/immobilier" },
  { name: "Véhicules", href: "/categories/vehicules" },
  { name: "Électronique", href: "/categories/electronique" },
  { name: "Maison", href: "/categories/maison" },
  { name: "Mode", href: "/categories/mode" },
  { name: "Loisirs", href: "/categories/loisirs" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [isMegaMenuHovered, setIsMegaMenuHovered] = useState(false);
  const searchRef = useRef<HTMLDivElement | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsMegaMenuHovered(false);
      setHoveredCategory(null);
    }, 100);
  };

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    setIsMegaMenuHovered(true);
  };

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  // Handle clicks outside the search bar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchRef]);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center h-20 relative">
          {/* Logo */}
          <Link 
            href="/" 
            className={`flex items-center transition-all duration-300 ease-in-out mr-8 ${
              isSearchFocused ? "transform scale-90 opacity-70" : ""
            }`}
          >
            <Image
              src="/logo.svg"
              alt="Davente Logo"
              width={80}
              height={30}
              className="h-6 w-auto"
              priority
            />
          </Link>

          {/* Publier button */}
          <PrimaryButton
            href="/publier"
            icon={SquarePlus}
            className="ml-2"
          >
            Déposer une annonce
          </PrimaryButton>

          <div className="flex-1 flex items-center justify-between mx-4">
            {/* Search Bar - Desktop */}
            <div
              ref={searchRef}
              className={`relative flex-1 transition-all duration-300 ease-in-out ${isSearchFocused ? "w-full" : "max-w-sm"}`}
            >
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Rechercher sur davente"
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-all duration-300 ease-in-out ${
                    isSearchFocused
                      ? "shadow-md border-[#EC5A12] ring-2 ring-[#EC5A12] ring-opacity-30"
                      : "border-gray-300 hover:border-gray-400"
                  } focus:outline-none`}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
                <svg
                  className={`absolute left-3 top-2.5 h-5 w-5 transition-colors duration-300 ${
                    isSearchFocused ? "text-[#EC5A12]" : "text-gray-400"
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Desktop Navigation and Auth - reduced opacity when search is focused */}
          <div
            className={`hidden md:flex items-center space-x-8 transition-all duration-300 ease-in-out ${
              isSearchFocused 
                ? "opacity-0 transform translate-x-10 absolute right-0 invisible" 
                : "opacity-100 transform translate-x-0 relative visible"
            }`}
          >
            <nav className="flex space-x-6">
              <Link
                href="/annonces"
                className="text-gray-700 hover:text-gray-900 font-medium"
              >
                Annonces
              </Link>
              <Link
                href="/contact"
                className="text-gray-700 hover:text-gray-900 font-medium"
              >
                Contact
              </Link>
              <Link
                href="/login"
                className="text-gray-700 hover:text-gray-900 font-medium"
              >
                Connexion
              </Link>
            </nav>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-all duration-300 ease-in-out ${
              isSearchFocused 
                ? "opacity-0 transform translate-x-10 absolute right-0 invisible" 
                : "opacity-100 transform translate-x-0 relative visible"
            }`}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className={`${isMenuOpen ? "hidden" : "block"} h-6 w-6`}
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
            <svg
              className={`${isMenuOpen ? "block" : "hidden"} h-6 w-6`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`${isMenuOpen ? "block" : "hidden"} md:hidden`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* Mobile Search Bar */}
            <div className="pb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Que recherchez-vous ?"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#EC5A12] focus:border-transparent"
                />
                <svg
                  className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            
            {/* Categories - Mobile */}
            <div className="pb-2 mb-2 border-b border-gray-200">
              <h3 className="px-3 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                Catégories
              </h3>
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={category.href}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  {category.name}
                </Link>
              ))}
            </div>
            <Link
              href="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Accueil
            </Link>
            <Link
              href="/annonces"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Annonces
            </Link>
            <Link
              href="/publier"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Publier
            </Link>
            <Link
              href="/contact"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Contact
            </Link>
            <div className="mt-4 space-y-2">
              <Link
                href="/login"
                className="block w-full px-3 py-2 rounded-md text-center text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                Connexion
              </Link>
              <Link
                href="/register"
                className="block w-full px-3 py-2 rounded-md text-center text-base font-medium bg-blue-500 text-white hover:bg-blue-600"
              >
                Inscription
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Categories - Desktop */}
      <div className="hidden md:block bg-gray-100 border-b border-gray-200 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex justify-center items-center py-3">
            {categories.map((category, index) => (
              <Fragment key={category.name}>
                {index > 0 && (
                  <span className="mx-4 text-gray-400 font-bold text-lg">•</span>
                )}
                <div
                  onMouseEnter={() => {
                    setHoveredCategory(category.name);
                    setIsMegaMenuHovered(true);
                  }}
                  className="relative"
                >
                  <Link
                    href={category.href}
                    className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors duration-200"
                  >
                    {category.name}
                  </Link>
                </div>
              </Fragment>
            ))}
          </nav>
        </div>
      </div>
      {/* MegaMenu - Rendered at header level */}
      {(hoveredCategory || isMegaMenuHovered) && (
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="absolute w-full z-50"
        >
          <MegaMenu
            category={categories.find(cat => cat.name === hoveredCategory) || categories[0]}
            isOpen={true}
          />
        </div>
      )}
    </header>
  );
}
