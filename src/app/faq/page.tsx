'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function FAQPage() {
  const sections = [
    {
      title: 'Compte et Inscription',
      questions: [
        {
          question: 'Comment créer un compte sur Grabi ?',
          answer: 'Pour créer un compte, cliquez sur "S\'inscrire" en haut de la page. Remplissez le formulaire avec vos informations personnelles, acceptez les conditions d\'utilisation, et validez votre inscription via le lien envoyé par email.'
        },
        {
          question: 'Comment modifier mes informations personnelles ?',
          answer: 'Connectez-vous à votre compte, accédez à "Mon Profil" et cliquez sur "Modifier". Vous pourrez y mettre à jour vos coordonnées, votre photo de profil et vos préférences de notification.'
        },
        {
          question: 'J\'ai oublié mon mot de passe, que faire ?',
          answer: 'Cliquez sur "Se connecter" puis sur "Mot de passe oublié ?". Entrez votre adresse email pour recevoir un lien de réinitialisation. Suivez les instructions pour créer un nouveau mot de passe.'
        }
      ]
    },
    {
      title: 'Acheter sur Grabi',
      questions: [
        {
          question: 'Comment contacter un vendeur ?',
          answer: 'Sur la page de l\'annonce, cliquez sur "Contacter le vendeur". Vous pourrez alors envoyer un message via notre système de messagerie intégré. Pour votre sécurité, privilégiez toujours la communication via notre plateforme.'
        },
        {
          question: 'Comment payer en toute sécurité ?',
          answer: 'Nous recommandons de privilégier les rencontres en personne et le paiement en espèces. Évitez les paiements à l\'avance et les transferts d\'argent à des inconnus. Vérifiez toujours l\'article avant de payer.'
        },
        {
          question: 'Puis-je faire une offre sur un article ?',
          answer: 'Oui, vous pouvez négocier le prix directement avec le vendeur via notre système de messagerie. Restez courtois et faites des offres raisonnables basées sur le prix du marché.'
        }
      ]
    },
    {
      title: 'Vendre sur Grabi',
      questions: [
        {
          question: 'Comment publier une annonce ?',
          answer: 'Cliquez sur "Déposer une annonce", sélectionnez la catégorie appropriée, ajoutez des photos de qualité, rédigez une description détaillée et fixez votre prix. Plus votre annonce est complète, plus elle a de chances d\'attirer des acheteurs.'
        },
        {
          question: 'Combien coûte la publication d\'une annonce ?',
          answer: 'La publication d\'annonces est gratuite pour les particuliers. Des options de mise en avant payantes sont disponibles pour augmenter la visibilité de vos annonces.'
        },
        {
          question: 'Comment gérer mes annonces ?',
          answer: 'Dans votre espace personnel, accédez à "Mes annonces" pour voir, modifier, renouveler ou supprimer vos annonces. Vous pouvez également suivre les statistiques de vues et de contacts.'
        }
      ]
    },
    {
      title: 'Sécurité et Confiance',
      questions: [
        {
          question: 'Comment reconnaître une arnaque ?',
          answer: 'Méfiez-vous des prix anormalement bas, des demandes de paiement à l\'avance, des comptes récemment créés sans avis, et des vendeurs pressés. Ne communiquez jamais en dehors de la plateforme et ne transmettez pas d\'informations sensibles.'
        },
        {
          question: 'Comment signaler un contenu inapproprié ?',
          answer: 'Utilisez le bouton "Signaler" présent sur chaque annonce et profil. Notre équipe de modération examine rapidement tous les signalements pour maintenir un environnement sûr et de qualité.'
        },
        {
          question: 'Mes données sont-elles protégées ?',
          answer: 'Oui, nous prenons la protection de vos données très au sérieux. Nous utilisons un cryptage SSL, ne partageons jamais vos informations avec des tiers et respectons strictement notre politique de confidentialité.'
        }
      ]
    },
    {
      title: 'Support Technique',
      questions: [
        {
          question: 'L\'application ne fonctionne pas, que faire ?',
          answer: 'Essayez de vider le cache, de vous déconnecter puis reconnecter, ou de réinstaller l\'application. Si le problème persiste, contactez notre support technique avec une description détaillée du problème.'
        },
        {
          question: 'Comment activer les notifications ?',
          answer: 'Dans les paramètres de votre compte, accédez à "Notifications" pour personnaliser vos préférences. Sur mobile, assurez-vous d\'avoir autorisé les notifications dans les paramètres de votre téléphone.'
        },
        {
          question: 'Je ne peux pas télécharger mes photos, pourquoi ?',
          answer: 'Vérifiez que vos photos respectent les formats acceptés (JPG, PNG) et la taille maximale (10 MB). Assurez-vous d\'avoir une connexion internet stable et réessayez. Si le problème persiste, essayez de réduire la taille de vos images.'
        }
      ]
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
              Questions Fréquentes
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Trouvez rapidement des réponses aux questions les plus courantes sur Grabi.
            </p>
          </div>

          {/* FAQ Sections */}
          <div className="space-y-12">
            {sections.map((section, index) => (
              <section
                key={index}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {section.title}
                </h2>
                <div className="space-y-6">
                  {section.questions.map((item, qIndex) => (
                    <div key={qIndex} className="border-b border-gray-200 last:border-0 pb-6 last:pb-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        {item.question}
                      </h3>
                      <p className="text-gray-600">
                        {item.answer}
                      </p>
                    </div>
                  ))}
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