const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function populateCategories() {
  try {
    await prisma.$connect();
    
    console.log('🚀 Début du peuplement des catégories...');
    
    // Vider les tables existantes
    console.log('🗑️ Suppression des données existantes...');
    await prisma.$executeRaw`DELETE FROM "Subcategory"`;
    await prisma.$executeRaw`DELETE FROM "Category"`;
    
    // Réinitialiser les séquences
    await prisma.$executeRaw`ALTER SEQUENCE "Category_id_seq" RESTART WITH 1`;
    await prisma.$executeRaw`ALTER SEQUENCE "Subcategory_id_seq" RESTART WITH 1`;
    
    // Insérer les catégories principales
    console.log('📦 Insertion des catégories principales...');
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
    console.log('📋 Insertion des sous-catégories...');
    
    // Véhicules
    await prisma.$executeRaw`
      INSERT INTO "Subcategory" ("name", "slug", "categoryId", "sortOrder") VALUES
      ('Voitures', 'voitures', 1, 1),
      ('Motos', 'motos', 1, 2),
      ('Camions', 'camions', 1, 3),
      ('Bateaux', 'bateaux', 1, 4),
      ('Caravaning', 'caravaning', 1, 5),
      ('Utilitaires', 'utilitaires', 1, 6),
      ('Nautisme', 'nautisme', 1, 7)
    `;
    
    // Immobilier
    await prisma.$executeRaw`
      INSERT INTO "Subcategory" ("name", "slug", "categoryId", "sortOrder") VALUES
      ('Appartements', 'appartements', 2, 1),
      ('Maisons', 'maisons', 2, 2),
      ('Terrains', 'terrains', 2, 3),
      ('Locaux commerciaux', 'locaux-commerciaux', 2, 4),
      ('Colocations', 'colocations', 2, 5),
      ('Bureaux & Commerces', 'bureaux-commerces', 2, 6)
    `;
    
    // Électronique
    await prisma.$executeRaw`
      INSERT INTO "Subcategory" ("name", "slug", "categoryId", "sortOrder") VALUES
      ('Téléphones & Objets connectés', 'telephones-objets-connectes', 3, 1),
      ('Ordinateurs', 'ordinateurs', 3, 2),
      ('Accessoires informatiques', 'accessoires-informatiques', 3, 3),
      ('Photo & vidéo', 'photo-video', 3, 4)
    `;
    
    // Mode
    await prisma.$executeRaw`
      INSERT INTO "Subcategory" ("name", "slug", "categoryId", "sortOrder") VALUES
      ('Vêtements', 'vetements', 4, 1),
      ('Chaussures', 'chaussures', 4, 2),
      ('Accessoires', 'accessoires', 4, 3),
      ('Montres & Bijoux', 'montres-bijoux', 4, 4)
    `;
    
    // Maison & Jardin
    await prisma.$executeRaw`
      INSERT INTO "Subcategory" ("name", "slug", "categoryId", "sortOrder") VALUES
      ('Ameublement', 'ameublement', 5, 1),
      ('Appareils électroménagers', 'electromenager', 5, 2),
      ('Décoration', 'decoration', 5, 3),
      ('Plantes & jardin', 'plantes-jardin', 5, 4),
      ('Bricolage', 'bricolage', 5, 5)
    `;
    
    // Services
    await prisma.$executeRaw`
      INSERT INTO "Subcategory" ("name", "slug", "categoryId", "sortOrder") VALUES
      ('Services aux entreprises', 'services-entreprises', 6, 1),
      ('Services à la personne', 'services-personne', 6, 2),
      ('Événements', 'evenements', 6, 3),
      ('Artisans & Musiciens', 'artisans-musiciens', 6, 4),
      ('Baby-Sitting', 'baby-sitting', 6, 5),
      ('Cours particuliers', 'cours-particuliers', 6, 6)
    `;
    
    // Emploi
    await prisma.$executeRaw`
      INSERT INTO "Subcategory" ("name", "slug", "categoryId", "sortOrder") VALUES
      ('Offres d''emploi', 'offres-emploi', 7, 1),
      ('Formations professionnelles', 'formations-professionnelles', 7, 2)
    `;
    
    // Locations de vacances
    await prisma.$executeRaw`
      INSERT INTO "Subcategory" ("name", "slug", "categoryId", "sortOrder") VALUES
      ('Locations saisonnières', 'locations-saisonnieres', 8, 1),
      ('Ventes flash vacances', 'ventes-flash-vacances', 8, 2),
      ('Locations Europe', 'locations-europe', 8, 3)
    `;
    
    // Famille
    await prisma.$executeRaw`
      INSERT INTO "Subcategory" ("name", "slug", "categoryId", "sortOrder") VALUES
      ('Équipement bébé', 'equipement-bebe', 9, 1),
      ('Mobilier enfant', 'mobilier-enfant', 9, 2),
      ('Jouets', 'jouets', 9, 3)
    `;
    
    // Loisirs
    await prisma.$executeRaw`
      INSERT INTO "Subcategory" ("name", "slug", "categoryId", "sortOrder") VALUES
      ('CD - Musique', 'cd-musique', 10, 1),
      ('DVD - Films', 'dvd-films', 10, 2),
      ('Livres', 'livres', 10, 3),
      ('Jeux & Jouets', 'jeux-jouets', 10, 4),
      ('Sport & Plein Air', 'sport-plein-air', 10, 5)
    `;
    
    // Matériel professionnel
    await prisma.$executeRaw`
      INSERT INTO "Subcategory" ("name", "slug", "categoryId", "sortOrder") VALUES
      ('Tracteurs', 'tracteurs', 11, 1),
      ('BTP - Chantier', 'btp-chantier', 11, 2),
      ('Matériel agricole', 'materiel-agricole', 11, 3),
      ('Équipements pros', 'equipements-pros', 11, 4)
    `;
    
    // Autre
    await prisma.$executeRaw`
      INSERT INTO "Subcategory" ("name", "slug", "categoryId", "sortOrder") VALUES
      ('Divers', 'divers', 12, 1),
      ('Non catégorisé', 'non-categorise', 12, 2)
    `;
    
    // Vérification des données insérées
    console.log('📊 Vérification des données...');
    const verification = await prisma.$queryRaw`
      SELECT 
          c.name as category_name,
          COUNT(s.id) as subcategory_count
      FROM "Category" c
      LEFT JOIN "Subcategory" s ON c.id = s."categoryId"
      GROUP BY c.id, c.name, c."sortOrder"
      ORDER BY c."sortOrder"
    `;
    
    console.log('✅ Catégories et sous-catégories insérées:');
    verification.forEach(row => {
      console.log(`  - ${row.category_name}: ${row.subcategory_count} sous-catégories`);
    });
    
    const totalCategories = await prisma.category.count();
    const totalSubcategories = await prisma.subcategory.count();
    
    console.log(`\n🎯 Total: ${totalCategories} catégories, ${totalSubcategories} sous-catégories`);
    
  } catch (error) {
    console.error('❌ Erreur lors du peuplement:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

populateCategories(); 