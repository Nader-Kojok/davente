'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
  const sections = [
    {
      title: 'Collecte des Données',
      content: `Nous collectons les informations suivantes lorsque vous utilisez Grabi :
- Informations de profil (nom, numéro de téléphone)
- Données de connexion et d'utilisation
- Informations sur les annonces publiées
- Données de localisation (avec votre consentement)
- Informations sur vos interactions avec le site`
    },
    {
      title: 'Utilisation des Données',
      content: `Vos données sont utilisées pour :
- Gérer votre compte et vos annonces
- Améliorer nos services et votre expérience
- Personnaliser le contenu et les recommandations
- Assurer la sécurité de la plateforme
- Communiquer avec vous concernant nos services`
    },
    {
      title: 'Protection des Données',
      content: `Nous mettons en œuvre des mesures de sécurité pour protéger vos données :
- Cryptage des données sensibles
- Accès restreint aux données personnelles
- Surveillance continue de la sécurité
- Mise à jour régulière de nos systèmes
- Formation de notre personnel sur la confidentialité`
    },
    {
      title: 'Cookies et Technologies Similaires',
      content: `Nous utilisons des cookies et technologies similaires pour :
- Maintenir votre session connectée
- Analyser l'utilisation du site
- Personnaliser votre expérience
- Améliorer nos services

Vous pouvez gérer vos préférences de cookies dans les paramètres de votre navigateur.`
    },
    {
      title: 'Partage des Données',
      content: `Nous ne partageons vos données que dans les cas suivants :
- Avec votre consentement explicite
- Pour fournir les services demandés
- Pour respecter nos obligations légales
- Pour protéger nos droits et ceux des utilisateurs

Nous ne vendons jamais vos données personnelles à des tiers.`
    },
    {
      title: 'Vos Droits',
      content: `Vous disposez des droits suivants concernant vos données :
- Droit d'accès à vos données
- Droit de rectification des données inexactes
- Droit à l'effacement ("droit à l'oubli")
- Droit à la limitation du traitement
- Droit à la portabilité des données
- Droit d'opposition au traitement`
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
              Politique de Confidentialité
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Nous nous engageons à protéger votre vie privée et vos données personnelles.
            </p>
          </div>

          {/* Privacy Sections */}
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
              Pour toute question concernant notre politique de confidentialité, n&apos;hésitez pas à nous contacter.
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