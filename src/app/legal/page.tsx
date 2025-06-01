'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function LegalPage() {
  const sections = [
    {
      title: 'Informations Légales',
      content: `Grabi est une plateforme de commerce en ligne opérée par :
- Raison sociale : Grabi SARL
- Siège social : Dakar, Sénégal
- Capital social : 10.000.000 FCFA
- RCCM : SN-DKR-2025-B-1234
- NINEA : 123456789`
    },
    {
      title: 'Hébergement',
      content: `Le site Grabi.sn est hébergé par :
- Nom de l'hébergeur : Cloud Services SARL
- Adresse : Dakar, Sénégal
- Contact : support@cloudservices.sn`
    },
    {
      title: 'Propriété Intellectuelle',
      content: `Tous les éléments du site Grabi sont protégés par le droit de la propriété intellectuelle :
- La marque Grabi est une marque déposée
- Les logos, graphismes et charte graphique sont protégés
- Le contenu éditorial est protégé par le droit d'auteur
- Toute reproduction non autorisée est interdite`
    },
    {
      title: 'Responsabilité',
      content: `Grabi s'efforce d'assurer au mieux de ses possibilités :
- L'exactitude et la mise à jour des informations diffusées
- L'accessibilité du site web
- La sécurité de la plateforme

Toutefois, Grabi ne peut garantir la continuité absolue de ses services.`
    },
    {
      title: 'Litiges et Juridiction Compétente',
      content: `En cas de litige :
- Une solution amiable sera privilégiée
- Les tribunaux de Dakar sont seuls compétents
- Le droit sénégalais est applicable
- La médiation peut être proposée avant toute action judiciaire`
    },
    {
      title: 'Contact Juridique',
      content: `Pour toute question d'ordre juridique :
- Email : juridique@Grabi.sn
- Adresse : Service Juridique, Grabi SARL, Dakar
- Téléphone : +221 XX XXX XX XX

Nous nous efforçons de répondre dans les meilleurs délais.`
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
              Mentions Légales
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Informations légales et réglementaires concernant Grabi et ses services.
            </p>
          </div>

          {/* Legal Sections */}
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
              Pour toute question concernant nos mentions légales, n&apos;hésitez pas à nous contacter.
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