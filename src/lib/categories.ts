export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description?: string;
  sortOrder: number;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  sortOrder: number;
}

export const CATEGORIES: Category[] = [
  {
    id: 'vehicles',
    name: 'Véhicules',
    slug: 'vehicules',
    icon: '🚗',
    description: 'Voitures, motos, camions et autres véhicules',
    sortOrder: 1,
    subcategories: [
      { id: 'cars', name: 'Voitures', slug: 'voitures', sortOrder: 1 },
      { id: 'motorcycles', name: 'Motos', slug: 'motos', sortOrder: 2 },
      { id: 'trucks', name: 'Camions', slug: 'camions', sortOrder: 3 },
      { id: 'boats', name: 'Bateaux', slug: 'bateaux', sortOrder: 4 },
      { id: 'caravaning', name: 'Caravaning', slug: 'caravaning', sortOrder: 5 },
      { id: 'utility', name: 'Utilitaires', slug: 'utilitaires', sortOrder: 6 },
      { id: 'nautical', name: 'Nautisme', slug: 'nautisme', sortOrder: 7 },
    ],
  },
  {
    id: 'real-estate',
    name: 'Immobilier',
    slug: 'immobilier',
    icon: '🏠',
    description: 'Appartements, maisons, terrains et locaux commerciaux',
    sortOrder: 2,
    subcategories: [
      { id: 'apartments', name: 'Appartements', slug: 'appartements', sortOrder: 1 },
      { id: 'houses', name: 'Maisons', slug: 'maisons', sortOrder: 2 },
      { id: 'land', name: 'Terrains', slug: 'terrains', sortOrder: 3 },
      { id: 'commercial', name: 'Locaux commerciaux', slug: 'locaux-commerciaux', sortOrder: 4 },
      { id: 'colocation', name: 'Colocations', slug: 'colocations', sortOrder: 5 },
      { id: 'offices', name: 'Bureaux & Commerces', slug: 'bureaux-commerces', sortOrder: 6 },
    ],
  },
  {
    id: 'electronics',
    name: 'Électronique',
    slug: 'electronique',
    icon: '📱',
    description: 'Téléphones, ordinateurs et appareils électroniques',
    sortOrder: 3,
    subcategories: [
      { id: 'phones', name: 'Téléphones & Objets connectés', slug: 'telephones-objets-connectes', sortOrder: 1 },
      { id: 'computers', name: 'Ordinateurs', slug: 'ordinateurs', sortOrder: 2 },
      { id: 'accessories', name: 'Accessoires informatiques', slug: 'accessoires-informatiques', sortOrder: 3 },
      { id: 'photo-video', name: 'Photo & vidéo', slug: 'photo-video', sortOrder: 4 },
    ],
  },
  {
    id: 'fashion',
    name: 'Mode',
    slug: 'mode',
    icon: '👕',
    description: 'Vêtements, chaussures et accessoires de mode',
    sortOrder: 4,
    subcategories: [
      { id: 'clothing', name: 'Vêtements', slug: 'vetements', sortOrder: 1 },
      { id: 'shoes', name: 'Chaussures', slug: 'chaussures', sortOrder: 2 },
      { id: 'accessories', name: 'Accessoires', slug: 'accessoires', sortOrder: 3 },
      { id: 'watches', name: 'Montres & Bijoux', slug: 'montres-bijoux', sortOrder: 4 },
    ],
  },
  {
    id: 'home',
    name: 'Maison & Jardin',
    slug: 'maison-jardin',
    icon: '🏡',
    description: 'Mobilier, électroménager et articles de jardinage',
    sortOrder: 5,
    subcategories: [
      { id: 'furniture', name: 'Ameublement', slug: 'ameublement', sortOrder: 1 },
      { id: 'appliances', name: 'Appareils électroménagers', slug: 'electromenager', sortOrder: 2 },
      { id: 'decoration', name: 'Décoration', slug: 'decoration', sortOrder: 3 },
      { id: 'garden', name: 'Plantes & jardin', slug: 'plantes-jardin', sortOrder: 4 },
      { id: 'diy', name: 'Bricolage', slug: 'bricolage', sortOrder: 5 },
    ],
  },
  {
    id: 'services',
    name: 'Services',
    slug: 'services',
    icon: '🛠️',
    description: 'Services professionnels et personnels',
    sortOrder: 6,
    subcategories: [
      { id: 'business', name: 'Services aux entreprises', slug: 'services-entreprises', sortOrder: 1 },
      { id: 'personal', name: 'Services à la personne', slug: 'services-personne', sortOrder: 2 },
      { id: 'events', name: 'Événements', slug: 'evenements', sortOrder: 3 },
      { id: 'artisans', name: 'Artisans & Musiciens', slug: 'artisans-musiciens', sortOrder: 4 },
      { id: 'babysitting', name: 'Baby-Sitting', slug: 'baby-sitting', sortOrder: 5 },
      { id: 'courses', name: 'Cours particuliers', slug: 'cours-particuliers', sortOrder: 6 },
    ],
  },
  {
    id: 'jobs',
    name: 'Emploi',
    slug: 'emploi',
    icon: '💼',
    description: 'Offres d\'emploi et formations professionnelles',
    sortOrder: 7,
    subcategories: [
      { id: 'job-offers', name: 'Offres d\'emploi', slug: 'offres-emploi', sortOrder: 1 },
      { id: 'training', name: 'Formations professionnelles', slug: 'formations-professionnelles', sortOrder: 2 },
    ],
  },
  {
    id: 'vacation',
    name: 'Locations de vacances',
    slug: 'locations-vacances',
    icon: '🏖️',
    description: 'Locations saisonnières et voyages',
    sortOrder: 8,
    subcategories: [
      { id: 'seasonal', name: 'Locations saisonnières', slug: 'locations-saisonnieres', sortOrder: 1 },
      { id: 'flash-sales', name: 'Ventes flash vacances', slug: 'ventes-flash-vacances', sortOrder: 2 },
      { id: 'europe', name: 'Locations Europe', slug: 'locations-europe', sortOrder: 3 },
    ],
  },
  {
    id: 'family',
    name: 'Famille',
    slug: 'famille',
    icon: '👶',
    description: 'Articles pour bébés et enfants',
    sortOrder: 9,
    subcategories: [
      { id: 'baby-equipment', name: 'Équipement bébé', slug: 'equipement-bebe', sortOrder: 1 },
      { id: 'kids-furniture', name: 'Mobilier enfant', slug: 'mobilier-enfant', sortOrder: 2 },
      { id: 'toys', name: 'Jouets', slug: 'jouets', sortOrder: 3 },
    ],
  },
  {
    id: 'leisure',
    name: 'Loisirs',
    slug: 'loisirs',
    icon: '🎮',
    description: 'Divertissement, sport et loisirs',
    sortOrder: 10,
    subcategories: [
      { id: 'music', name: 'CD - Musique', slug: 'cd-musique', sortOrder: 1 },
      { id: 'movies', name: 'DVD - Films', slug: 'dvd-films', sortOrder: 2 },
      { id: 'books', name: 'Livres', slug: 'livres', sortOrder: 3 },
      { id: 'toys-games', name: 'Jeux & Jouets', slug: 'jeux-jouets', sortOrder: 4 },
      { id: 'sports', name: 'Sport & Plein Air', slug: 'sport-plein-air', sortOrder: 5 },
    ],
  },
  {
    id: 'professional',
    name: 'Matériel professionnel',
    slug: 'materiel-professionnel',
    icon: '🚜',
    description: 'Équipements et matériel professionnel',
    sortOrder: 11,
    subcategories: [
      { id: 'tractors', name: 'Tracteurs', slug: 'tracteurs', sortOrder: 1 },
      { id: 'construction', name: 'BTP - Chantier', slug: 'btp-chantier', sortOrder: 2 },
      { id: 'agricultural', name: 'Matériel agricole', slug: 'materiel-agricole', sortOrder: 3 },
      { id: 'pro-equipment', name: 'Équipements pros', slug: 'equipements-pros', sortOrder: 4 },
    ],
  },
  {
    id: 'other',
    name: 'Autre',
    slug: 'autre',
    icon: '📦',
    description: 'Articles divers et non catégorisés',
    sortOrder: 12,
    subcategories: [
      { id: 'misc', name: 'Divers', slug: 'divers', sortOrder: 1 },
      { id: 'uncategorized', name: 'Non catégorisé', slug: 'non-categorise', sortOrder: 2 },
    ],
  },
];

// Fonctions utilitaires
export function getAllCategories(): Category[] {
  return CATEGORIES;
}

export function getCategoryById(id: string): Category | undefined {
  return CATEGORIES.find(cat => cat.id === id);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find(cat => cat.slug === slug);
}

export function getSubcategoryById(categoryId: string, subcategoryId: string): Subcategory | undefined {
  const category = getCategoryById(categoryId);
  return category?.subcategories.find(sub => sub.id === subcategoryId);
}

export function getSubcategoryBySlug(categorySlug: string, subcategorySlug: string): Subcategory | undefined {
  const category = getCategoryBySlug(categorySlug);
  return category?.subcategories.find(sub => sub.slug === subcategorySlug);
}

export function getCategoriesForDisplay() {
  return CATEGORIES.map(cat => ({
    name: cat.name,
    icon: cat.icon,
    href: `/categories/${cat.slug}`,
  }));
} 