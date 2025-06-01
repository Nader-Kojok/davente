"use client";

import { useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { LogOut, User, Settings, SquarePlus, Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface UserMenuProps {
  isUserMenuOpen: boolean;
  setIsUserMenuOpen: (open: boolean) => void;
  userMenuPosition: { top: number; right: number };
}

export default function UserMenu({ 
  isUserMenuOpen, 
  setIsUserMenuOpen, 
  userMenuPosition 
}: UserMenuProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  const handleLogout = useCallback(() => {
    logout();
    setIsUserMenuOpen(false);
  }, [logout, setIsUserMenuOpen]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isUserMenuOpen, setIsUserMenuOpen]);

  if (!isUserMenuOpen || !isAuthenticated) {
    return null;
  }

  return (
    <div
      ref={userMenuRef}
      className="fixed w-48 bg-white rounded-md shadow-lg py-1 z-[100] border border-gray-200"
      style={{
        top: `${userMenuPosition.top}px`,
        right: `${userMenuPosition.right}px`
      }}
    >
      <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
        {user?.mobile}
      </div>
      <Link
        href="/profil"
        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
        onClick={() => setIsUserMenuOpen(false)}
      >
        <User className="w-4 h-4 mr-2" />
        Mon profil
      </Link>
      <Link
        href="/favoris"
        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
        onClick={() => setIsUserMenuOpen(false)}
      >
        <Heart className="w-4 h-4 mr-2" />
        Mes favoris
      </Link>
      <Link
        href="/mes-annonces"
        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
        onClick={() => setIsUserMenuOpen(false)}
      >
        <SquarePlus className="w-4 h-4 mr-2" />
        Mes annonces
      </Link>
      <Link
        href="/parametres"
        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
        onClick={() => setIsUserMenuOpen(false)}
      >
        <Settings className="w-4 h-4 mr-2" />
        Paramètres
      </Link>
      <button
        onClick={handleLogout}
        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
      >
        <LogOut className="w-4 h-4 mr-2" />
        Déconnexion
      </button>
    </div>
  );
} 