"use client";

import { useRef, useCallback } from "react";
import Link from "next/link";
import { SquarePlus, ListFilter, UserCircle2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface DesktopNavigationProps {
  isSearchFocused: boolean;
  isUserMenuOpen: boolean;
  setIsUserMenuOpen: (open: boolean) => void;
  setUserMenuPosition: (position: { top: number; right: number }) => void;
}

export default function DesktopNavigation({
  isSearchFocused,
  isUserMenuOpen,
  setIsUserMenuOpen,
  setUserMenuPosition
}: DesktopNavigationProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const userButtonRef = useRef<HTMLButtonElement | null>(null);

  const toggleUserMenu = useCallback(() => {
    if (!isUserMenuOpen && userButtonRef.current) {
      const rect = userButtonRef.current.getBoundingClientRect();
      setUserMenuPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right
      });
    }
    setIsUserMenuOpen(!isUserMenuOpen);
  }, [isUserMenuOpen, setIsUserMenuOpen, setUserMenuPosition]);

  return (
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
        {isAuthenticated ? (
          <Link
            href="/publier"
            className="text-gray-700 hover:text-gray-900 font-medium inline-flex items-center"
          >
            <SquarePlus className="w-5 h-5 mr-1.5" aria-hidden="true" />
            Publier
          </Link>
        ) : (
          <Link
            href="/login"
            className="text-gray-700 hover:text-gray-900 font-medium inline-flex items-center"
          >
            <SquarePlus className="w-5 h-5 mr-1.5" aria-hidden="true" />
            Publier
          </Link>
        )}
        
        {!isLoading && (
          <>
            {isAuthenticated ? (
              <button
                ref={userButtonRef}
                onClick={toggleUserMenu}
                className="text-gray-700 hover:text-gray-900 font-medium inline-flex items-center"
              >
                <UserCircle2 className="w-5 h-5 mr-1.5" aria-hidden="true" />
                {user?.name}
              </button>
            ) : (
              <Link
                href="/login"
                className="text-gray-700 hover:text-gray-900 font-medium inline-flex items-center"
              >
                <UserCircle2 className="w-5 h-5 mr-1.5" aria-hidden="true" />
                Connexion
              </Link>
            )}
          </>
        )}
      </nav>
    </div>
  );
} 