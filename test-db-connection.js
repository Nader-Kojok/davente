const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testDatabase() {
  try {
    console.log('🔄 Test de connexion à la base de données...');
    
    // Test de connexion
    await prisma.$connect();
    console.log('✅ Connexion à la base réussie');
    
    // Compter les utilisateurs
    const userCount = await prisma.user.count();
    console.log('👥 Nombre d\'utilisateurs:', userCount);
    
    // Lister les utilisateurs
    const users = await prisma.user.findMany({
      select: {
        id: true,
        mobile: true,
        name: true,
        createdAt: true
      }
    });
    console.log('📋 Utilisateurs:', users);
    
    // Compter les annonces
    const annonceCount = await prisma.annonce.count();
    console.log('📢 Nombre d\'annonces:', annonceCount);
    
    // Test d'écriture simple
    console.log('🧪 Test d\'écriture simple...');
    
    if (users.length > 0) {
      const testUser = users[0];
      console.log('👤 Utilisation de l\'utilisateur:', testUser);
      
      const testAnnonce = await prisma.annonce.create({
        data: {
          title: 'Test DB Connection',
          description: 'Test pour vérifier la connexion DB',
          price: 1000,
          location: 'Test, Test',
          picture: '/images/test.jpg',
          gallery: ['/images/test.jpg'],
          category: 'test',
          subcategory: 'test',
          condition: 'good',
          userId: testUser.id
        }
      });
      
      console.log('✅ Annonce de test créée:', testAnnonce.id);
      
      // Supprimer l'annonce de test
      await prisma.annonce.delete({
        where: { id: testAnnonce.id }
      });
      
      console.log('🗑️ Annonce de test supprimée');
    } else {
      console.log('⚠️ Aucun utilisateur trouvé pour tester');
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error);
    console.error('Type:', typeof error);
    console.error('Message:', error.message);
    if (error.code) {
      console.error('Code:', error.code);
    }
    if (error.meta) {
      console.error('Meta:', error.meta);
    }
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase(); 