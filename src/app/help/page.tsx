'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function HelpPage() {
  const sections = [
    {
      title: 'Comment ça marche',
      content: `Découvrez comment utiliser davente :
- Créez votre compte gratuitement
- Publiez vos annonces en quelques clics
- Gérez vos favoris et vos recherches
- Communiquez avec les vendeurs en toute sécurité`
    },
    {
      title: 'Publier une annonce',
      content: `Conseils pour une annonce efficace :
- Choisissez la bonne catégorie
- Ajoutez des photos de qualité
- Rédigez une description détaillée
- Fixez un prix cohérent avec le marché
- Répondez rapidement aux messages`
    },
    {
      title: 'Sécurité des transactions',
      content: `Pour des transactions sûres :
- Privilégiez les rencontres en personne
- Vérifiez l'état des articles
- Méfiez-vous des prix anormalement bas
- Ne communiquez pas hors de la plateforme
- N'envoyez jamais d'argent à l'avance`
    },
    {
      title: 'Mon compte',
      content: `Gérez votre compte davente :
- Modifiez vos informations personnelles
- Consultez vos annonces actives
- Suivez vos conversations
- Gérez vos notifications
- Paramétrez vos préférences`
    },
    {
      title: 'Problèmes fréquents',
      content: `Solutions aux problèmes courants :
- Réinitialisation du mot de passe
- Récupération d'un compte
- Suppression d'une annonce
- Signalement d'un contenu inapproprié
- Blocage d'un utilisateur`
    },
    {
      title: 'Nous contacter',
      content: `Besoin d'aide supplémentaire ? Contactez-nous :
- Par email : support@davente.sn
- Par téléphone : +221 XX XXX XX XX
- Via notre formulaire de contact
- Sur nos réseaux sociaux

Notre équipe est disponible du lundi au vendredi, de 9h à 18h.`
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
              Centre d'aide
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Trouvez toutes les réponses à vos questions et apprenez à utiliser davente efficacement.
            </p>
          </div>

          {/* Help Sections */}
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
              Vous ne trouvez pas la réponse à votre question ?
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