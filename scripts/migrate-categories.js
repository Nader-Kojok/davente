const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Mapping des anciennes catégories vers les nouvelles
const categoryMapping = {
  'vehicles': 'vehicles',
  'vehicules': 'vehicles',
  'real-estate': 'real-estate',
  'immobilier': 'real-estate',
  'electronics': 'electronics',
  'electronique': 'electronics',
  'fashion': 'fashion',
  'mode': 'fashion',
  'home': 'home',
  'maison': 'home',
  'services': 'services',
  'jobs': 'jobs',
  'emploi': 'jobs',
  'vacation': 'vacation',
  'vacances': 'vacation',
  'family': 'family',
  'famille': 'family',
  'leisure': 'leisure',
  'loisirs': 'leisure',
  'professional': 'professional',
  'materiel-professionnel': 'professional',
  'other': 'other',
  'autre': 'other',
};

const subcategoryMapping = {
  // Véhicules
  'cars': 'cars',
  'voitures': 'cars',
  'motorcycles': 'motorcycles',
  'motos': 'motorcycles',
  'trucks': 'trucks',
  'camions': 'trucks',
  'boats': 'boats',
  'bateaux': 'boats',
  
  // Immobilier
  'apartments': 'apartments',
  'appartements': 'apartments',
  'houses': 'houses',
  'maisons': 'houses',
  'land': 'land',
  'terrains': 'land',
  
  // Électronique
  'phones': 'phones',
  'telephones': 'phones',
  'computers': 'computers',
  'ordinateurs': 'computers',
  
  // Mode
  'clothing': 'clothing',
  'vetements': 'clothing',
  'shoes': 'shoes',
  'chaussures': 'shoes',
  
  // Autres mappings...
  'misc': 'misc',
  'divers': 'misc',
};

async function migrateCategories() {
  console.log('🚀 Début de la migration des catégories...');

  try {
    // 1. Sauvegarder les anciennes données dans les nouveaux champs
    console.log('📦 Sauvegarde des anciennes données...');
    
    const annonces = await prisma.annonce.findMany({
      where: {
        OR: [
          { category: { not: null } },
          { subcategory: { not: null } }
        ]
      }
    });

    console.log(`📊 ${annonces.length} annonces avec des catégories trouvées`);

    // 2. Mettre à jour les annonces avec les nouveaux IDs
    for (const annonce of annonces) {
      const updates = {};
      
      // Sauvegarder les anciennes valeurs
      if (annonce.category) {
        updates.oldCategory = annonce.category;
      }
      if (annonce.subcategory) {
        updates.oldSubcategory = annonce.subcategory;
      }

      if (Object.keys(updates).length > 0) {
        await prisma.annonce.update({
          where: { id: annonce.id },
          data: updates
        });
      }
    }

    console.log('✅ Migration terminée avec succès!');
    console.log('ℹ️  Les anciennes données sont sauvegardées dans oldCategory et oldSubcategory');
    
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    throw error;
  }
}

async function main() {
  try {
    await migrateCategories();
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

module.exports = { migrateCategories }; 