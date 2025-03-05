'use client';

import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';

type Category = {
  id: string;
  name: string;
  icon: string;
  subcategories: SubCategory[];
};

type SubCategory = {
  id: string;
  name: string;
};

type CategorySelectProps = {
  onSelect: (category: string, subcategory: string) => void;
};

const categories: Category[] = [
  {
    id: 'vehicles',
    name: 'Véhicules',
    icon: '🚗',
    subcategories: [
      { id: 'cars', name: 'Voitures' },
      { id: 'motorcycles', name: 'Motos' },
      { id: 'trucks', name: 'Camions' },
      { id: 'boats', name: 'Bateaux' },
      { id: 'caravaning', name: 'Caravaning' },
      { id: 'utility', name: 'Utilitaires' },
      { id: 'nautical', name: 'Nautisme' },
    ],
  },
  {
    id: 'real-estate',
    name: 'Immobilier',
    icon: '🏠',
    subcategories: [
      { id: 'apartments', name: 'Appartements' },
      { id: 'houses', name: 'Maisons' },
      { id: 'land', name: 'Terrains' },
      { id: 'commercial', name: 'Locaux commerciaux' },
      { id: 'colocation', name: 'Colocations' },
      { id: 'offices', name: 'Bureaux & Commerces' },
    ],
  },
  {
    id: 'electronics',
    name: 'Électronique',
    icon: '📱',
    subcategories: [
      { id: 'phones', name: 'Téléphones & Objets connectés' },
      { id: 'computers', name: 'Ordinateurs' },
      { id: 'accessories', name: 'Accessoires informatiques' },
      { id: 'photo-video', name: 'Photo & vidéo' },
    ],
  },
  {
    id: 'fashion',
    name: 'Mode',
    icon: '👕',
    subcategories: [
      { id: 'clothing', name: 'Vêtements' },
      { id: 'shoes', name: 'Chaussures' },
      { id: 'accessories', name: 'Accessoires' },
      { id: 'watches', name: 'Montres & Bijoux' },
    ],
  },
  {
    id: 'home',
    name: 'Maison & Jardin',
    icon: '🏡',
    subcategories: [
      { id: 'furniture', name: 'Ameublement' },
      { id: 'appliances', name: 'Appareils électroménagers' },
      { id: 'decoration', name: 'Décoration' },
      { id: 'garden', name: 'Plantes & jardin' },
      { id: 'diy', name: 'Bricolage' },
    ],
  },
  {
    id: 'services',
    name: 'Services',
    icon: '🛠️',
    subcategories: [
      { id: 'business', name: 'Services aux entreprises' },
      { id: 'personal', name: 'Services à la personne' },
      { id: 'events', name: 'Evénements' },
      { id: 'artisans', name: 'Artisans & Musiciens' },
      { id: 'babysitting', name: 'Baby-Sitting' },
      { id: 'courses', name: 'Cours particuliers' },
    ],
  },
  {
    id: 'jobs',
    name: 'Emploi',
    icon: '💼',
    subcategories: [
      { id: 'job-offers', name: "Offres d'emploi" },
      { id: 'training', name: 'Formations professionnelles' },
    ],
  },
  {
    id: 'vacation',
    name: 'Locations de vacances',
    icon: '🏖️',
    subcategories: [
      { id: 'seasonal', name: 'Locations saisonnières' },
      { id: 'flash-sales', name: 'Ventes flash vacances' },
      { id: 'europe', name: 'Locations Europe' },
    ],
  },
  {
    id: 'family',
    name: 'Famille',
    icon: '👶',
    subcategories: [
      { id: 'baby-equipment', name: 'Équipement bébé' },
      { id: 'kids-furniture', name: 'Mobilier enfant' },
      { id: 'toys', name: 'Jouets' },
    ],
  },
  {
    id: 'leisure',
    name: 'Loisirs',
    icon: '🎮',
    subcategories: [
      { id: 'music', name: 'CD - Musique' },
      { id: 'movies', name: 'DVD - Films' },
      { id: 'books', name: 'Livres' },
      { id: 'toys-games', name: 'Jeux & Jouets' },
      { id: 'sports', name: 'Sport & Plein Air' },
    ],
  },
  {
    id: 'professional',
    name: 'Matériel professionnel',
    icon: '🚜',
    subcategories: [
      { id: 'tractors', name: 'Tracteurs' },
      { id: 'construction', name: 'BTP - Chantier' },
      { id: 'agricultural', name: 'Matériel agricole' },
      { id: 'pro-equipment', name: 'Équipements pros' },
    ],
  },
  {
    id: 'other',
    name: 'Autre',
    icon: '📦',
    subcategories: [
      { id: 'misc', name: 'Divers' },
      { id: 'uncategorized', name: 'Non catégorisé' },
    ],
  },
];


export default function CategorySelect({ onSelect }: CategorySelectProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category);
  };

  const handleSubcategoryClick = (subcategoryId: string) => {
    if (selectedCategory) {
      onSelect(selectedCategory.id, subcategoryId);
    }
  };

  const handleBack = () => {
    setSelectedCategory(null);
  };

  if (selectedCategory) {
    return (
      <div>
        <button
          onClick={handleBack}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Retour aux catégories
        </button>

        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          {selectedCategory.name}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {selectedCategory.subcategories.map((subcategory) => (
            <button
              key={subcategory.id}
              onClick={() => handleSubcategoryClick(subcategory.id)}
              className="p-4 text-left border rounded-lg hover:border-[#E00201] hover:shadow-sm transition-all duration-200"
            >
              <span className="text-lg font-medium text-gray-900">
                {subcategory.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Choisissez une catégorie
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category)}
            className="p-6 text-center border rounded-lg hover:border-[#E00201] hover:shadow-sm transition-all duration-200"
          >
            <span className="text-4xl mb-3 block">{category.icon}</span>
            <span className="text-lg font-medium text-gray-900">
              {category.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}