const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function clearAndRepopulate() {
  try {
    await prisma.$connect();
    
    console.log('🗑️ Suppression des données existantes...');
    
    // Delete subcategories first (due to foreign key constraints)
    const deletedSubcategories = await prisma.subcategory.deleteMany();
    console.log(`✅ ${deletedSubcategories.count} sous-catégories supprimées`);
    
    // Then delete categories
    const deletedCategories = await prisma.category.deleteMany();
    console.log(`✅ ${deletedCategories.count} catégories supprimées`);
    
    // Verify cleanup
    const categoryCount = await prisma.category.count();
    const subcategoryCount = await prisma.subcategory.count();
    
    console.log(`📊 Catégories restantes: ${categoryCount}`);
    console.log(`📊 Sous-catégories restantes: ${subcategoryCount}`);
    
    if (categoryCount === 0 && subcategoryCount === 0) {
      console.log('🎯 Base de données nettoyée avec succès!');
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

clearAndRepopulate(); 