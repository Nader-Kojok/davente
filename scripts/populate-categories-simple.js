const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const categories = [
  {
    name: 'Véhicules',
    slug: 'vehicules',
    icon: '🚗',
    description: 'Voitures, motos, camions et autres véhicules',
    sortOrder: 1,
    subcategories: [
      { name: 'Voitures', slug: 'voitures', sortOrder: 1 },
      { name: 'Motos', slug: 'motos', sortOrder: 2 },
      { name: 'Camions', slug: 'camions', sortOrder: 3 },
      { name: 'Bateaux', slug: 'bateaux', sortOrder: 4 },
      { name: 'Caravaning', slug: 'caravaning', sortOrder: 5 },
      { name: 'Utilitaires', slug: 'utilitaires', sortOrder: 6 },
      { name: 'Nautisme', slug: 'nautisme', sortOrder: 7 },
    ]
  },
  {
    name: 'Immobilier',
    slug: 'immobilier',
    icon: '🏠',
    description: 'Appartements, maisons, terrains et locaux commerciaux',
    sortOrder: 2,
    subcategories: [
      { name: 'Appartements', slug: 'appartements', sortOrder: 1 },
      { name: 'Maisons', slug: 'maisons', sortOrder: 2 },
      { name: 'Terrains', slug: 'terrains', sortOrder: 3 },
      { name: 'Locaux commerciaux', slug: 'locaux-commerciaux', sortOrder: 4 },
      { name: 'Colocations', slug: 'colocations', sortOrder: 5 },
      { name: 'Bureaux & Commerces', slug: 'bureaux-commerces', sortOrder: 6 },
    ]
  },
  {
    name: 'Électronique',
    slug: 'electronique',
    icon: '📱',
    description: 'Téléphones, ordinateurs et appareils électroniques',
    sortOrder: 3,
    subcategories: [
      { name: 'Téléphones & Objets connectés', slug: 'telephones-objets-connectes', sortOrder: 1 },
      { name: 'Ordinateurs', slug: 'ordinateurs', sortOrder: 2 },
      { name: 'Accessoires informatiques', slug: 'accessoires-informatiques', sortOrder: 3 },
      { name: 'Photo & vidéo', slug: 'photo-video', sortOrder: 4 },
    ]
  },
  {
    name: 'Mode',
    slug: 'mode',
    icon: '👕',
    description: 'Vêtements, chaussures et accessoires de mode',
    sortOrder: 4,
    subcategories: [
      { name: 'Vêtements', slug: 'vetements', sortOrder: 1 },
      { name: 'Chaussures', slug: 'chaussures', sortOrder: 2 },
      { name: 'Accessoires', slug: 'accessoires', sortOrder: 3 },
      { name: 'Montres & Bijoux', slug: 'montres-bijoux', sortOrder: 4 },
    ]
  },
  {
    name: 'Maison & Jardin',
    slug: 'maison-jardin',
    icon: '🏡',
    description: 'Mobilier, électroménager et articles de jardinage',
    sortOrder: 5,
    subcategories: [
      { name: 'Ameublement', slug: 'ameublement', sortOrder: 1 },
      { name: 'Appareils électroménagers', slug: 'electromenager', sortOrder: 2 },
      { name: 'Décoration', slug: 'decoration', sortOrder: 3 },
      { name: 'Plantes & jardin', slug: 'plantes-jardin', sortOrder: 4 },
      { name: 'Bricolage', slug: 'bricolage', sortOrder: 5 },
    ]
  },
  {
    name: 'Services',
    slug: 'services',
    icon: '🛠️',
    description: 'Services professionnels et personnels',
    sortOrder: 6,
    subcategories: [
      { name: 'Services aux entreprises', slug: 'services-entreprises', sortOrder: 1 },
      { name: 'Services à la personne', slug: 'services-personne', sortOrder: 2 },
      { name: 'Événements', slug: 'evenements', sortOrder: 3 },
      { name: 'Artisans & Musiciens', slug: 'artisans-musiciens', sortOrder: 4 },
      { name: 'Baby-Sitting', slug: 'baby-sitting', sortOrder: 5 },
      { name: 'Cours particuliers', slug: 'cours-particuliers', sortOrder: 6 },
    ]
  },
  {
    name: 'Emploi',
    slug: 'emploi',
    icon: '💼',
    description: 'Offres d\'emploi et formations professionnelles',
    sortOrder: 7,
    subcategories: [
      { name: 'Offres d\'emploi', slug: 'offres-emploi', sortOrder: 1 },
      { name: 'Formations professionnelles', slug: 'formations-professionnelles', sortOrder: 2 },
    ]
  },
  {
    name: 'Locations de vacances',
    slug: 'locations-vacances',
    icon: '🏖️',
    description: 'Locations saisonnières et voyages',
    sortOrder: 8,
    subcategories: [
      { name: 'Locations saisonnières', slug: 'locations-saisonnieres', sortOrder: 1 },
      { name: 'Ventes flash vacances', slug: 'ventes-flash-vacances', sortOrder: 2 },
      { name: 'Locations Europe', slug: 'locations-europe', sortOrder: 3 },
    ]
  },
  {
    name: 'Famille',
    slug: 'famille',
    icon: '👶',
    description: 'Articles pour bébés et enfants',
    sortOrder: 9,
    subcategories: [
      { name: 'Équipement bébé', slug: 'equipement-bebe', sortOrder: 1 },
      { name: 'Mobilier enfant', slug: 'mobilier-enfant', sortOrder: 2 },
      { name: 'Jouets', slug: 'jouets', sortOrder: 3 },
    ]
  },
  {
    name: 'Loisirs',
    slug: 'loisirs',
    icon: '🎮',
    description: 'Divertissement, sport et loisirs',
    sortOrder: 10,
    subcategories: [
      { name: 'CD - Musique', slug: 'cd-musique', sortOrder: 1 },
      { name: 'DVD - Films', slug: 'dvd-films', sortOrder: 2 },
      { name: 'Livres', slug: 'livres', sortOrder: 3 },
      { name: 'Jeux & Jouets', slug: 'jeux-jouets', sortOrder: 4 },
      { name: 'Sport & Plein Air', slug: 'sport-plein-air', sortOrder: 5 },
    ]
  },
  {
    name: 'Matériel professionnel',
    slug: 'materiel-professionnel',
    icon: '🚜',
    description: 'Équipements et matériel professionnel',
    sortOrder: 11,
    subcategories: [
      { name: 'Tracteurs', slug: 'tracteurs', sortOrder: 1 },
      { name: 'BTP - Chantier', slug: 'btp-chantier', sortOrder: 2 },
      { name: 'Matériel agricole', slug: 'materiel-agricole', sortOrder: 3 },
      { name: 'Équipements pros', slug: 'equipements-pros', sortOrder: 4 },
    ]
  },
  {
    name: 'Autre',
    slug: 'autre',
    icon: '📦',
    description: 'Articles divers et non catégorisés',
    sortOrder: 12,
    subcategories: [
      { name: 'Divers', slug: 'divers', sortOrder: 1 },
      { name: 'Non catégorisé', slug: 'non-categorise', sortOrder: 2 },
    ]
  },
];

async function populateCategories() {
  console.log('🚀 Peuplement des catégories...');

  try {
    // Vérifier si des catégories existent déjà
    const existingCategories = await prisma.category.count();
    
    if (existingCategories > 0) {
      console.log(`📊 ${existingCategories} catégories existent déjà. Suppression...`);
      await prisma.subcategory.deleteMany();
      await prisma.category.deleteMany();
    }

    console.log('📦 Création des catégories et sous-catégories...');

    for (const categoryData of categories) {
      const { subcategories, ...categoryInfo } = categoryData;
      
      console.log(`📝 Création de la catégorie: ${categoryInfo.name}`);
      
      const category = await prisma.category.create({
        data: {
          ...categoryInfo,
          Subcategory: {
            create: subcategories
          }
        },
        include: {
          Subcategory: true
        }
      });

      console.log(`✅ Catégorie "${category.name}" créée avec ${category.Subcategory.length} sous-catégories`);
    }

    // Vérification finale
    const totalCategories = await prisma.category.count();
    const totalSubcategories = await prisma.subcategory.count();
    
    console.log('🎉 Peuplement terminé !');
    console.log(`📊 ${totalCategories} catégories créées`);
    console.log(`📊 ${totalSubcategories} sous-catégories créées`);

    // Afficher un résumé
    const categoriesWithCounts = await prisma.category.findMany({
      include: {
        _count: {
          select: { Subcategory: true }
        }
      },
      orderBy: { sortOrder: 'asc' }
    });

    console.log('\n📋 Résumé des catégories:');
    categoriesWithCounts.forEach(cat => {
      console.log(`  ${cat.icon} ${cat.name}: ${cat._count.Subcategory} sous-catégories`);
    });

  } catch (error) {
    console.error('❌ Erreur lors du peuplement:', error);
    throw error;
  }
}

async function main() {
  try {
    await populateCategories();
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}

module.exports = { populateCategories }; 