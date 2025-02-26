"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

const categories = [
  { name: 'Immobilier', href: '/categories/immobilier' },
  { name: 'Véhicules', href: '/categories/vehicules' },
  { name: 'Électronique', href: '/categories/electronique' },
  { name: 'Maison', href: '/categories/maison' },
  { name: 'Mode', href: '/categories/mode' },
  { name: 'Loisirs', href: '/categories/loisirs' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center mr-8">
            <Image
              src="/logo.svg"
              alt="Davente Logo"
              width={140}
              height={45}
              className="h-10 w-auto"
              priority
            />
          </Link>

          {/* Publish annonce */}
          <div className="flex items-center space-x-4">
            <Link
                href="/publier"
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-[#EC5A12] hover:bg-[#d94e0a] transition-colors duration-200 shadow-sm"
              >
                <svg
                  className="-ml-1 mr-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                    clipRule="evenodd"
                  />
                </svg>
                Déposer une annonce
              </Link>
            </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl relative mx-4">
            <div className="relative w-full">
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

          {/* Desktop Navigation and Auth */}
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex space-x-6">
              <Link href="/" className="text-gray-700 hover:text-gray-900 font-medium">
                Accueil
              </Link>
              <Link href="/annonces" className="text-gray-700 hover:text-gray-900 font-medium">
                Annonces
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-gray-900 font-medium">
                Contact
              </Link>
              <Link href="/login" className="text-gray-700 hover:text-gray-900 font-medium">
                Connexion
              </Link>
            </nav>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
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
              className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
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
        <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* Categories - Mobile */}
            <div className="pb-2 mb-2 border-b border-gray-200">
              <h3 className="px-3 text-sm font-semibold text-gray-500 uppercase tracking-wider">Catégories</h3>
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
      <div className="hidden md:block bg-gray-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex justify-center items-center py-3">
            {categories.map((category, index) => (
              <>
                {index > 0 && (
                  <span className="mx-4 text-gray-400 font-bold text-lg">•</span>
                )}
                <Link
                  key={category.name}
                  href={category.href}
                  className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors duration-200"
                >
                  {category.name}
                </Link>
              </>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}