'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function CookiesPage() {
  const sections = [
    {
      title: 'Utilisation des Cookies',
      content: `Les cookies sont de petits fichiers texte stockés sur votre appareil lorsque vous visitez Grabi. Ils nous aident à :
- Assurer le bon fonctionnement du site
- Mémoriser vos préférences
- Améliorer votre expérience de navigation
- Analyser l'utilisation du site pour l'améliorer`
    },
    {
      title: 'Types de Cookies',
      content: `Nous utilisons différents types de cookies :
- Cookies essentiels : nécessaires au fonctionnement du site
- Cookies de performance : pour analyser l'utilisation du site
- Cookies de fonctionnalité : pour mémoriser vos préférences
- Cookies de ciblage : pour la publicité personnalisée`
    },
    {
      title: 'Cookies Essentiels',
      content: `Ces cookies sont nécessaires au fonctionnement du site. Ils permettent :
- La connexion sécurisée à votre compte
- La mémorisation des articles dans votre panier
- La navigation entre les pages
- La protection contre les activités frauduleuses

Ces cookies ne peuvent pas être désactivés.`
    },
    {
      title: 'Cookies de Performance',
      content: `Ces cookies nous aident à améliorer notre site en collectant des informations sur son utilisation :
- Nombre de visiteurs
- Pages les plus consultées
- Sources de trafic
- Erreurs rencontrées

Ces données sont anonymes et ne permettent pas de vous identifier personnellement.`
    },
    {
      title: 'Cookies de Ciblage',
      content: `Ces cookies sont utilisés pour :
- Afficher des publicités pertinentes
- Mesurer l'efficacité des campagnes
- Limiter le nombre d'affichages d'une même publicité
- Personnaliser votre expérience

Vous pouvez désactiver ces cookies dans vos paramètres.`
    },
    {
      title: 'Gestion des Cookies',
      content: `Vous pouvez gérer vos préférences en matière de cookies :
- Dans les paramètres de votre navigateur
- Via notre panneau de gestion des cookies
- En nous contactant directement

Notez que la désactivation de certains cookies peut affecter votre expérience sur le site.`
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

          {/* Header Section */}
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
              Politique des Cookies
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez comment nous utilisons les cookies pour améliorer votre expérience sur Grabi.
            </p>
          </div>

          {/* Cookies Sections */}
          <div className="space-y-12">
            {sections.map((section, index) => (
              <section
                key={index}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {section.title}
                </h2>
                <div className="prose prose-lg max-w-none text-gray-600">
                  {section.content.split('\n').map((paragraph, pIndex) => {
                    if (paragraph.startsWith('-')) {
                      return (
                        <li key={pIndex} className="text-gray-600 ml-4">
                          {paragraph.substring(2)}
                        </li>
                      );
                    }
                    return (
                      <p key={pIndex} className="mb-4">
                        {paragraph}
                      </p>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>

          {/* Contact Section */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              Pour toute question concernant notre utilisation des cookies, n&apos;hésitez pas à nous contacter.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#E00201] hover:bg-[#CB0201] transition-colors duration-200"
            >
              Contactez-nous
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}