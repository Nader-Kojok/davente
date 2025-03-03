// File: components/MegaFooter.tsx
"use client";

import BaseLink from "next/link";

// Example data array to populate the footer columns
const megaFooterData = [
  {
    title: "Emploi",
    links: [
      "Offres d'emploi",
      "Formations professionnelles",
    ],
  },
  {
    title: "Locations de vacances",
    links: [
      "Locations saisonnières",
      "Ventes flash vacances",
      "Locations Europe",
    ],
  },
  {
    title: "Électronique",
    links: [
      "Ordinateurs",
      "Accessoires informatiques",
      "Photo & vidéo",
      "Téléphones & Objets connectés",
    ],
  },
  {
    title: "Famille",
    links: [
      "Équipement bébé",
      "Mobilier enfant",
      "Jouets",
    ],
  },
  {
    title: "Maison & Jardin",
    links: [
      "Ameublement",
      "Décoration",
      "Appareils électroménagers",
      "Bricolage",
      "Plantes & jardin",
    ],
  },
  {
    title: "Véhicules",
    links: [
      "Voitures",
      "Motos",
      "Caravaning",
      "Utilitaires",
      "Camions",
      "Nautisme",
    ],
  },
  {
    title: "Immobilier",
    links: [
      "Location",
      "Vente",
      "Colocations",
      "Bureaux & Commerces",
    ],
  },
  {
    title: "Loisirs",
    links: [
      "CD - Musique",
      "DVD - Films",
      "Livres",
      "Jeux & Jouets",
      "Sport & Plein Air",
    ],
  },
  {
    title: "Services",
    links: [
      "Artisans & Musiciens",
      "Baby-Sitting",
      "Cours particuliers",
      "Evénements",
      "Services à la personne",
    ],
  },
  {
    title: "Matériel professionnel",
    links: [
      "Tracteurs",
      "BTP - Chantier",
      "Matériel agricole",
      "Équipements pros",
    ],
  },
];

export default function MegaFooter() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"> {/* Adjusted padding */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-8 gap-y-10"> {/* Enhanced grid layout */}
          {megaFooterData.map((column) => (
            <div key={column.title} className="flex flex-col"> {/* Added flex container */}
              <h2 className="text-lg font-bold text-gray-900 mb-4"> {/* Enhanced typography */}
                {column.title}
              </h2>
              <ul className="space-y-2.5 flex-1"> {/* Adjusted spacing */}
                {column.links.map((link) => (
                  <li key={link}>
                    <BaseLink
                      href="#"
                      className="text-sm text-gray-600 hover:text-[#E00201] hover:translate-x-0.5 transition-all duration-200 inline-block"
                    >
                      {link}
                    </BaseLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
