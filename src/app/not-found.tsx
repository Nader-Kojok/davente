'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, Search } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gray-50 py-16 px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="max-w-4xl mx-auto text-center">

          {/* 404 Content */}
          <div className="space-y-8">
            <Image
              src="/logo.svg"
              alt="Davente Logo"
              width={160}
              height={60}
              className="mx-auto mb-8"
              priority
            />
            
            <div className="space-y-4">
              <h1 className="text-6xl font-bold text-gray-900">404</h1>
              <h2 className="text-2xl font-semibold text-gray-700">
                Oups ! Cette page n'existe pas
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                La page que vous recherchez a peut-être été déplacée, supprimée ou n'a jamais existé.
              </p>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}