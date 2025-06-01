'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function CareersPage() {
  const jobOpenings = [
    {
      title: 'Développeur Full Stack',
      department: 'Technique',
      location: 'Dakar, Sénégal',
      type: 'Temps plein',
      description: 'Nous recherchons un développeur full stack passionné pour rejoindre notre équipe technique en pleine croissance.'
    },
    {
      title: 'Chargé de Marketing Digital',
      department: 'Marketing',
      location: 'Dakar, Sénégal',
      type: 'Temps plein',
      description: 'Rejoignez notre équipe marketing pour développer et mettre en œuvre des stratégies digitales innovantes.'
    },
    {
      title: 'Service Client',
      department: 'Support',
      location: 'Dakar, Sénégal',
      type: 'Temps plein',
      description: 'Nous cherchons une personne dynamique pour assister nos clients et assurer leur satisfaction.'
    }
  ];

  const benefits = [
    {
      title: 'Santé & Bien-être',
      description: 'Assurance santé complète et programmes de bien-être.',
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    },
    {
      title: 'Formation Continue',
      description: 'Budget formation et développement professionnel.',
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      title: 'Environnement Flexible',
      description: 'Horaires flexibles et travail à distance possible.',
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
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
              alt="Grabi Logo"
              width={160}
              height={60}
              className="mx-auto mb-8"
              priority
            />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Carrières chez Grabi
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Rejoignez une équipe passionnée et contribuez à transformer le commerce en ligne au Sénégal.
            </p>
          </div>

          {/* Culture Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Notre Culture
            </h2>
            <div className="prose max-w-none text-gray-600">
              <p className="mb-4">
                Chez Grabi, nous cultivons un environnement de travail dynamique et inclusif où chaque membre de l&apos;équipe peut s&apos;épanouir et contribuer à notre mission commune.
              </p>
              <p>
                Nous valorisons l&apos;innovation, la collaboration et l&apos;apprentissage continu. Notre culture est basée sur la confiance, le respect mutuel et la passion pour l&apos;excellence.
              </p>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Avantages
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {benefits.map((benefit) => (
                <div key={benefit.title}>
                  <div className="w-12 h-12 bg-[#E00201] rounded-lg flex items-center justify-center mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Job Openings Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Postes Ouverts
            </h2>
            <div className="space-y-6">
              {jobOpenings.map((job) => (
                <div key={job.title} className="border-b border-gray-200 last:border-0 pb-6 last:pb-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{job.title}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      {job.department}
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {job.location}
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {job.type}
                    </span>
                  </div>
                  <p className="text-gray-600">{job.description}</p>
                  <button className="mt-4 inline-flex items-center text-[#E00201] hover:text-red-700 font-medium">
                    En savoir plus
                    <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
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