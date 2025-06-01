const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function setupCategories() {
  console.log('🚀 Configuration des catégories en cours...');

  try {
    // Vérifier si les tables existent déjà
    const existingCategories = await prisma.$queryRaw`
      SELECT COUNT(*) as count FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'Category'
    `;
    
    console.log('Tables existantes:', existingCategories);

    // Créer les tables si elles n'existent pas
    console.log('📋 Création des tables...');
    
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Category" (
          "id" SERIAL PRIMARY KEY,
          "name" TEXT UNIQUE NOT NULL,
          "slug" TEXT UNIQUE NOT NULL,
          "icon" TEXT NOT NULL,
          "description" TEXT,
          "isActive" BOOLEAN NOT NULL DEFAULT true,
          "sortOrder" INTEGER NOT NULL DEFAULT 0,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Subcategory" (
          "id" SERIAL PRIMARY KEY,
          "name" TEXT NOT NULL,
          "slug" TEXT NOT NULL,
          "description" TEXT,
          "isActive" BOOLEAN NOT NULL DEFAULT true,
          "sortOrder" INTEGER NOT NULL DEFAULT 0,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "categoryId" INTEGER NOT NULL,
          CONSTRAINT "Subcategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE,
          CONSTRAINT "Subcategory_categoryId_slug_key" UNIQUE ("categoryId", "slug")
      )
    `;

    // Ajouter les colonnes à la table Annonce
    console.log('🔧 Mise à jour de la table Annonce...');
    
    await prisma.$executeRaw`ALTER TABLE "Annonce" ADD COLUMN IF NOT EXISTS "categoryId" INTEGER`;
    await prisma.$executeRaw`ALTER TABLE "Annonce" ADD COLUMN IF NOT EXISTS "subcategoryId" INTEGER`;
    await prisma.$executeRaw`ALTER TABLE "Annonce" ADD COLUMN IF NOT EXISTS "oldCategory" TEXT`;
    await prisma.$executeRaw`ALTER TABLE "Annonce" ADD COLUMN IF NOT EXISTS "oldSubcategory" TEXT`;

    // Ajouter les contraintes
    try {
      await prisma.$executeRaw`
        ALTER TABLE "Annonce" ADD CONSTRAINT "Annonce_categoryId_fkey" 
        FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE
      `;
    } catch (error) {
      console.log('Contrainte categoryId déjà existante');
    }

    try {
      await prisma.$executeRaw`
        ALTER TABLE "Annonce" ADD CONSTRAINT "Annonce_subcategoryId_fkey" 
        FOREIGN KEY ("subcategoryId") REFERENCES "Subcategory"("id") ON DELETE SET NULL ON UPDATE CASCADE
      `;
    } catch (error) {
      console.log('Contrainte subcategoryId déjà existante');
    }

    // Vérifier si les catégories existent déjà
    const categoryCount = await prisma.$queryRaw`SELECT COUNT(*) as count FROM "Category"`;
    console.log('Nombre de catégories existantes:', categoryCount);

    if (categoryCount[0].count === '0') {
      console.log('📦 Peuplement des catégories...');
      
      // Insérer les catégories principales
      await prisma.$executeRaw`
        INSERT INTO "Category" ("name", "slug", "icon", "description", "sortOrder") VALUES
        ('Véhicules', 'vehicules', '🚗', 'Voitures, motos, camions et autres véhicules', 1),
        ('Immobilier', 'immobilier', '🏠', 'Appartements, maisons, terrains et locaux commerciaux', 2),
        ('Électronique', 'electronique', '📱', 'Téléphones, ordinateurs et appareils électroniques', 3),
        ('Mode', 'mode', '👕', 'Vêtements, chaussures et accessoires de mode', 4),
        ('Maison & Jardin', 'maison-jardin', '🏡', 'Mobilier, électroménager et articles de jardinage', 5),
        ('Services', 'services', '🛠️', 'Services professionnels et personnels', 6),
        ('Emploi', 'emploi', '💼', 'Offres d''emploi et formations professionnelles', 7),
        ('Locations de vacances', 'locations-vacances', '🏖️', 'Locations saisonnières et voyages', 8),
        ('Famille', 'famille', '👶', 'Articles pour bébés et enfants', 9),
        ('Loisirs', 'loisirs', '🎮', 'Divertissement, sport et loisirs', 10),
        ('Matériel professionnel', 'materiel-professionnel', '🚜', 'Équipements et matériel professionnel', 11),
        ('Autre', 'autre', '📦', 'Articles divers et non catégorisés', 12)
      `;

      // Insérer toutes les sous-catégories
      const subcategories = [
        // Véhicules (categoryId = 1)
        ['Voitures', 'voitures', 1, 1],
        ['Motos', 'motos', 1, 2],
        ['Camions', 'camions', 1, 3],
        ['Bateaux', 'bateaux', 1, 4],
        ['Caravaning', 'caravaning', 1, 5],
        ['Utilitaires', 'utilitaires', 1, 6],
        ['Nautisme', 'nautisme', 1, 7],
        
        // Immobilier (categoryId = 2)
        ['Appartements', 'appartements', 2, 1],
        ['Maisons', 'maisons', 2, 2],
        ['Terrains', 'terrains', 2, 3],
        ['Locaux commerciaux', 'locaux-commerciaux', 2, 4],
        ['Colocations', 'colocations', 2, 5],
        ['Bureaux & Commerces', 'bureaux-commerces', 2, 6],
        
        // Électronique (categoryId = 3)
        ['Téléphones & Objets connectés', 'telephones-objets-connectes', 3, 1],
        ['Ordinateurs', 'ordinateurs', 3, 2],
        ['Accessoires informatiques', 'accessoires-informatiques', 3, 3],
        ['Photo & vidéo', 'photo-video', 3, 4],
        
        // Mode (categoryId = 4)
        ['Vêtements', 'vetements', 4, 1],
        ['Chaussures', 'chaussures', 4, 2],
        ['Accessoires', 'accessoires', 4, 3],
        ['Montres & Bijoux', 'montres-bijoux', 4, 4],
        
        // Maison & Jardin (categoryId = 5)
        ['Ameublement', 'ameublement', 5, 1],
        ['Appareils électroménagers', 'electromenager', 5, 2],
        ['Décoration', 'decoration', 5, 3],
        ['Plantes & jardin', 'plantes-jardin', 5, 4],
        ['Bricolage', 'bricolage', 5, 5],
        
        // Services (categoryId = 6)
        ['Services aux entreprises', 'services-entreprises', 6, 1],
        ['Services à la personne', 'services-personne', 6, 2],
        ['Événements', 'evenements', 6, 3],
        ['Artisans & Musiciens', 'artisans-musiciens', 6, 4],
        ['Baby-Sitting', 'baby-sitting', 6, 5],
        ['Cours particuliers', 'cours-particuliers', 6, 6],
        
        // Emploi (categoryId = 7)
        ['Offres d\'emploi', 'offres-emploi', 7, 1],
        ['Formations professionnelles', 'formations-professionnelles', 7, 2],
        
        // Locations de vacances (categoryId = 8)
        ['Locations saisonnières', 'locations-saisonnieres', 8, 1],
        ['Ventes flash vacances', 'ventes-flash-vacances', 8, 2],
        ['Locations Europe', 'locations-europe', 8, 3],
        
        // Famille (categoryId = 9)
        ['Équipement bébé', 'equipement-bebe', 9, 1],
        ['Mobilier enfant', 'mobilier-enfant', 9, 2],
        ['Jouets', 'jouets', 9, 3],
        
        // Loisirs (categoryId = 10)
        ['CD - Musique', 'cd-musique', 10, 1],
        ['DVD - Films', 'dvd-films', 10, 2],
        ['Livres', 'livres', 10, 3],
        ['Jeux & Jouets', 'jeux-jouets', 10, 4],
        ['Sport & Plein Air', 'sport-plein-air', 10, 5],
        
        // Matériel professionnel (categoryId = 11)
        ['Tracteurs', 'tracteurs', 11, 1],
        ['BTP - Chantier', 'btp-chantier', 11, 2],
        ['Matériel agricole', 'materiel-agricole', 11, 3],
        ['Équipements pros', 'equipements-pros', 11, 4],
        
        // Autre (categoryId = 12)
        ['Divers', 'divers', 12, 1],
        ['Non catégorisé', 'non-categorise', 12, 2],
      ];

      for (const [name, slug, categoryId, sortOrder] of subcategories) {
        await prisma.$executeRaw`
          INSERT INTO "Subcategory" ("name", "slug", "categoryId", "sortOrder") 
          VALUES (${name}, ${slug}, ${categoryId}, ${sortOrder})
        `;
      }
    }

    // Vérification finale
    const finalCategoryCount = await prisma.$queryRaw`SELECT COUNT(*) as count FROM "Category"`;
    const finalSubcategoryCount = await prisma.$queryRaw`SELECT COUNT(*) as count FROM "Subcategory"`;
    
    console.log('✅ Configuration terminée !');
    console.log(`📊 ${finalCategoryCount[0].count} catégories créées`);
    console.log(`📊 ${finalSubcategoryCount[0].count} sous-catégories créées`);

  } catch (error) {
    console.error('❌ Erreur lors de la configuration:', error);
    throw error;
  }
}

async function main() {
  try {
    await setupCategories();
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

module.exports = { setupCategories }; 