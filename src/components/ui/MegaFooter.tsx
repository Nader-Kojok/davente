// File: components/MegaFooter.tsx
"use client";

import Link from "next/link";

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Responsive grid: changes column count at various breakpoints */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8">
          {megaFooterData.map((column) => (
            <div key={column.title}>
              {/* Section title */}
              <h2 className="text-base font-semibold text-gray-900 mb-3">
                {column.title}
              </h2>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-sm text-gray-600 hover:text-[#EC5A12] transition-colors duration-200"
                    >
                      {link}
                    </Link>
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