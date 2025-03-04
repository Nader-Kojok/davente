'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function TermsPage() {
  const sections = [
    {
      title: 'Conditions Générales d&apos;Utilisation',
      content: `En accédant à davente, vous acceptez d&apos;être lié par ces conditions d&apos;utilisation, toutes les lois et réglementations applicables, et acceptez que vous êtes responsable du respect des lois locales applicables. Si vous n&apos;acceptez pas ces conditions, vous ne devez pas utiliser ou accéder à ce site.

Les documents contenus dans ce site Web sont protégés par les lois applicables sur la propriété intellectuelle.`
    },
    {
      title: 'Inscription et Compte Utilisateur',
      content: `Pour utiliser certaines fonctionnalités de davente, vous devez créer un compte. Vous acceptez de :
- Fournir des informations exactes, actuelles et complètes
- Maintenir et mettre à jour vos informations
- Protéger la sécurité de votre compte
- Être responsable de toutes les activités sur votre compte
- Notifier immédiatement toute utilisation non autorisée`
    },
    {
      title: 'Règles de Publication',
      content: `En publiant du contenu sur davente, vous acceptez de :
- Ne pas publier de contenu illégal ou frauduleux
- Ne pas violer les droits de propriété intellectuelle
- Ne pas publier de contenu offensant ou inapproprié
- Fournir des descriptions précises des articles
- Respecter les catégories appropriées`
    },
    {
      title: 'Transactions',
      content: `davente facilite les transactions entre acheteurs et vendeurs mais n'est pas partie aux transactions. Les utilisateurs acceptent que :
- davente n'est pas responsable des transactions
- Les vendeurs sont responsables de leurs annonces
- Les acheteurs doivent vérifier les articles avant l'achat
- Les transactions se font à leurs propres risques`
    },
    {
      title: 'Politique de Confidentialité',
      content: `Nous nous engageons à protéger votre vie privée. Nous collectons et utilisons vos informations pour :
- Gérer votre compte
- Améliorer nos services
- Communiquer avec vous
- Assurer la sécurité

Vos données sont traitées conformément aux lois sur la protection des données.`
    },
    {
      title: 'Modifications des Conditions',
      content: 'Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications prennent effet dès leur publication. L\'utilisation continue du site après les modifications constitue votre acceptation des nouvelles conditions.'
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
              alt="Davente Logo"
              width={160}
              height={60}
              className="mx-auto mb-8"
              priority
            />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Conditions Générales
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Veuillez lire attentivement nos conditions d&apos;utilisation et notre politique de confidentialité.
            </p>
          </div>

          {/* Terms Sections */}
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
              Pour toute question concernant nos conditions d&apos;utilisation, veuillez nous contacter.
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