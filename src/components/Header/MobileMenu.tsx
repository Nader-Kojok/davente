"use client";

import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getCategoriesForDisplay } from "@/lib/categories";

interface MobileMenuProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
}

export default function MobileMenu({ isMenuOpen, setIsMenuOpen }: MobileMenuProps) {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const allCategories = getCategoriesForDisplay();
  const mobileCategories = allCategories.slice(0, 6);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <div
      id="mobile-menu"
      className={`md:hidden fixed inset-y-0 left-0 w-80 bg-white z-50 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      aria-hidden={!isMenuOpen}
    >
      <div className="h-20 px-4 flex items-center justify-between border-b border-gray-200">
        <Link href="/" className="flex items-center" aria-label="Grabi Home">
          <Image
            src="/logo.svg"
            alt="Grabi Logo"
            width={80}
            height={30}
            className="h-10 w-auto"
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
            {isAuthenticated ? (
              <Link
                href="/publier"
                className="block text-base font-medium text-gray-900 hover:text-[#E00201] transition-colors"
              >
                Publier une annonce
              </Link>
            ) : (
              <Link
                href="/login"
                className="block text-base font-medium text-gray-900 hover:text-[#E00201] transition-colors"
              >
                Publier une annonce
              </Link>
            )}
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
            {mobileCategories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="block text-base font-medium text-gray-900 hover:text-[#E00201] transition-colors"
              >
                {category.name}
              </Link>
            ))}
            <Link
              href="/categories"
              className="block text-base font-medium text-[#E00201] hover:text-[#B00201] transition-colors"
            >
              Voir toutes les catégories →
            </Link>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200">
          {!isLoading && (
            <>
              {isAuthenticated ? (
                <div className="space-y-3">
                  <div className="text-sm text-gray-500 px-4">
                    Connecté en tant que {user?.name}
                  </div>
                  <Link
                    href="/profil"
                    className="block w-full py-3 px-4 rounded-lg text-left font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Mon profil
                  </Link>
                  <Link
                    href="/favoris"
                    className="block w-full py-3 px-4 rounded-lg text-left font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Mes favoris
                  </Link>
                  <Link
                    href="/mes-annonces"
                    className="block w-full py-3 px-4 rounded-lg text-left font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Mes annonces
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full py-3 px-4 rounded-lg text-left font-medium text-red-600 hover:bg-gray-100 transition-colors"
                  >
                    Déconnexion
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block w-full py-3 px-4 rounded-lg text-center font-medium text-[#E00201] border-2 border-[#E00201] hover:bg-[#E00201] hover:text-white transition-colors mb-3"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Connexion
                  </Link>
                  <Link
                    href="/register"
                    className="block w-full py-3 px-4 rounded-lg text-center font-medium text-white bg-[#E00201] hover:bg-[#CB0201] transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Inscription
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </nav>
    </div>
  );
} 