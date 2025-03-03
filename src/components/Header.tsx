"use client";

import Link from "next/link";
import Image from "next/image";
import PrimaryButton from "./ui/PrimaryButton";
import { useState, useRef, useEffect, Fragment, useCallback } from "react";
import { SquarePlus, ListFilter, UserCircle2, Search, X } from "lucide-react";
import MegaMenu from "./ui/MegaMenu";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [isMegaMenuHovered, setIsMegaMenuHovered] = useState(false);
  const searchRef = useRef<HTMLFormElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const [isHydrated, setIsHydrated] = useState(false);

  const handleSearchClear = useCallback(() => {
    setSearchQuery("");
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // TODO: Implement search functionality
      console.log("Search query:", searchQuery);
    }
  }, [searchQuery]);

  const handleMouseLeave = useCallback(() => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsMegaMenuHovered(false);
      setHoveredCategory(null);
    }, 150);
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
  }, [isSearchFocused]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSearchFocused(false);
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchRef, isHydrated]);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm" role="banner">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center h-20 relative px-4">
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

          <Link
            href="/"
            className={`hidden md:flex items-center transition-all duration-300 ease-in-out mr-8 ${isSearchFocused ? "transform scale-90 opacity-70" : ""}`}
            aria-label="Davente Home"
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

          <div className="hidden md:block">
            <PrimaryButton href="/publier" icon={SquarePlus} className="ml-2">
              Déposer une annonce
            </PrimaryButton>
          </div>

          <div className="flex-1 flex items-center justify-between mx-4">
            <form
              onSubmit={handleSearchSubmit}
              className={`relative flex-1 transition-all duration-300 ease-in-out ${isSearchFocused ? "w-full" : "max-w-sm"} ${isMenuOpen ? "hidden md:block" : "block"}`}
              ref={searchRef}
            >
              <div className="relative w-full">
                <input
                  ref={searchInputRef}
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher sur davente"
                  className={`w-full pl-10 pr-10 py-2 rounded-lg border transition-all duration-300 ease-in-out [&::-webkit-search-cancel-button]:hidden ${isSearchFocused ? "shadow-md border-[#E00201] ring-2 ring-[#E00201] ring-opacity-30" : "border-gray-300 hover:border-gray-400"} focus:outline-none`}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  aria-label="Search"
                />
                <Search className={`absolute left-3 top-2.5 h-5 w-5 transition-colors duration-300 ${isSearchFocused ? "text-[#E00201]" : "text-gray-400"}`} />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleSearchClear}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    aria-label="Clear search"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </form>
          </div>

          <div
            className={`hidden md:flex items-center space-x-8 transition-all duration-300 ease-in-out ${isSearchFocused ? "opacity-0 transform translate-x-10 absolute right-0 invisible" : "opacity-100 transform translate-x-0 relative visible"}`}
          >
            <nav className="flex space-x-6" aria-label="Main navigation">
              <Link
                href="/annonces"
                className="text-gray-700 hover:text-gray-900 font-medium inline-flex items-center"
              >
                <ListFilter className="w-5 h-5 mr-1.5" aria-hidden="true" />
                Annonces
              </Link>
              <Link
                href="/login"
                className="text-gray-700 hover:text-gray-900 font-medium inline-flex items-center"
              >
                <UserCircle2 className="w-5 h-5 mr-1.5" aria-hidden="true" />
                Connexion
              </Link>
            </nav>
          </div>
        </div>

        <div
          id="mobile-menu"
          className={`md:hidden fixed inset-y-0 left-0 w-80 bg-white z-50 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
          aria-hidden={!isMenuOpen}
        >
          <div className="h-20 px-4 flex items-center justify-between border-b border-gray-200">
            <Link href="/" className="flex items-center" aria-label="Davente Home">
              <Image
                src="/logo.svg"
                alt="Davente Logo"
                width={80}
                height={30}
                className="h-6 w-auto"
                priority
              />
            </Link>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#E00201]"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="px-4 py-6 space-y-6 overflow-y-auto h-[calc(100vh-5rem)]">
          <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Navigation</h3>
              <div className="space-y-3">
                <Link
                  href="/annonces"
                  className="block text-base font-medium text-gray-900 hover:text-[#E00201] transition-colors"
                >
                  Annonces
                </Link>
                <Link
                  href="/publier"
                  className="block text-base font-medium text-gray-900 hover:text-[#E00201] transition-colors"
                >
                  Publier une annonce
                </Link>
                <Link
                  href="/contact"
                  className="block text-base font-medium text-gray-900 hover:text-[#E00201] transition-colors"
                >
                  Contact
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Catégories</h3>
              <div className="space-y-3">
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    href={category.href}
                    className="block text-base font-medium text-gray-900 hover:text-[#E00201] transition-colors"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>

            

            <div className="pt-6 border-t border-gray-200">
              <Link
                href="/login"
                className="block w-full py-3 px-4 rounded-lg text-center font-medium text-[#E00201] border-2 border-[#E00201] hover:bg-[#E00201] hover:text-white transition-colors mb-3"
              >
                Connexion
              </Link>
              <Link
                href="/register"
                className="block w-full py-3 px-4 rounded-lg text-center font-medium text-white bg-[#E00201] hover:bg-[#CB0201] transition-colors"
              >
                Inscription
              </Link>
            </div>
          </nav>
        </div>
      </div>

      <div className="hidden md:block bg-gray-100 border-b border-gray-200 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex justify-center items-center py-3" aria-label="Categories">
            {categories.map((category, index) => (
              <Fragment key={category.name}>
                {index > 0 && (
                  <span className="mx-4 text-gray-400 font-bold text-lg" aria-hidden="true">•</span>
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

      {(hoveredCategory || isMegaMenuHovered) && (
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="absolute w-full z-50"
        >
          <MegaMenu
            category={
              categories.find((cat) => cat.name === hoveredCategory) ||
              categories[0]
            }
            isOpen={true}
          />
        </div>
      )}
    </header>
  );
}
