'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AboutPage() {
  const teamMembers = [
    {
      name: 'Moussa Diop',
      role: 'Fondateur & CEO',
      image: 'https://i.pravatar.cc/150?img=1',
      bio: 'Passionné par l\'innovation et le commerce en ligne.'
    },
    {
      name: 'Fatou Sow',
      role: 'Directrice Marketing',
      image: 'https://i.pravatar.cc/150?img=5',
      bio: 'Experte en stratégie marketing digital et communication.'
    },
    {
      name: 'Amadou Fall',
      role: 'Directeur Technique',
      image: 'https://i.pravatar.cc/150?img=3',
      bio: 'Ingénieur passionné par les technologies web modernes.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Retour
          </Link>

          {/* Hero Section */}
          <div className="text-center mb-16">
            <Image
              src="/logo.svg"
              alt="Davente Logo"
              width={160}
              height={60}
              className="mx-auto mb-8"
              priority
            />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              À propos de davente
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              La première plateforme de commerce en ligne au Sénégal, connectant acheteurs et vendeurs dans un environnement sûr et convivial.
            </p>
          </div>

          {/* Mission Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Notre Mission
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="w-12 h-12 bg-[#E00201] rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Innovation</h3>
                <p className="text-gray-600">Nous innovons constamment pour offrir la meilleure expérience de commerce en ligne.</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-[#E00201] rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Communauté</h3>
                <p className="text-gray-600">Nous créons une communauté dynamique d'acheteurs et de vendeurs de confiance.</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-[#E00201] rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Sécurité</h3>
                <p className="text-gray-600">Nous assurons des transactions sécurisées et une protection des données.</p>
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Notre Équipe
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {teamMembers.map((member) => (
                <div key={member.name} className="text-center">
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-[#E00201] font-medium mb-2">{member.role}</p>
                  <p className="text-gray-600">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}