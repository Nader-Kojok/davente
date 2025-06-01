const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testAnnonces() {
  try {
    console.log('🔍 Vérification des annonces dans la base de données...');
    
    // Compter toutes les annonces
    const totalAnnonces = await prisma.annonce.count();
    console.log(`📊 Total des annonces: ${totalAnnonces}`);
    
    // Compter les annonces actives
    const activeAnnonces = await prisma.annonce.count({
      where: { status: 'active' }
    });
    console.log(`✅ Annonces actives: ${activeAnnonces}`);
    
    // Récupérer quelques annonces actives avec leurs utilisateurs
    const annonces = await prisma.annonce.findMany({
      where: { status: 'active' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            picture: true,
            mobile: true,
            accountType: true
          }
        }
      },
      take: 5,
      orderBy: { createdAt: 'desc' }
    });
    
    console.log('\n📋 Dernières annonces actives:');
    annonces.forEach((annonce, index) => {
      console.log(`${index + 1}. ${annonce.title}`);
      console.log(`   Prix: ${annonce.price === 0 ? 'Gratuit' : annonce.price + '€'}`);
      console.log(`   Lieu: ${annonce.location}`);
      console.log(`   Vendeur: ${annonce.user?.name || 'Inconnu'}`);
      console.log(`   Status: ${annonce.status}`);
      console.log(`   Créée le: ${annonce.createdAt.toLocaleDateString('fr-FR')}`);
      console.log('');
    });
    
    if (activeAnnonces === 0) {
      console.log('⚠️ Aucune annonce active trouvée. Création d\'annonces de test...');
      await createTestAnnonces();
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function createTestAnnonces() {
  try {
    // Récupérer un utilisateur existant ou en créer un
    let user = await prisma.user.findFirst();
    
    if (!user) {
      console.log('👤 Création d\'un utilisateur de test...');
      user = await prisma.user.create({
        data: {
          mobile: '+221771234567',
          password: 'hashedpassword',
          name: 'Utilisateur Test',
          picture: 'https://i.pravatar.cc/150?img=1',
          accountType: 'individual'
        }
      });
    }
    
    console.log(`👤 Utilisation de l'utilisateur: ${user.name} (ID: ${user.id})`);
    
    // Créer des annonces de test
    const testAnnonces = [
      {
        title: 'iPhone 14 Pro Max - Excellent état',
        description: 'iPhone 14 Pro Max 256GB, couleur violet, en excellent état. Vendu avec boîte et accessoires d\'origine. Aucune rayure, fonctionne parfaitement.',
        price: 850,
        location: 'Dakar, Sénégal',
        picture: '/images/placeholder.jpg',
        gallery: ['/images/placeholder.jpg'],
        category: 'Électronique',
        subcategory: 'Téléphones',
        condition: 'Excellent',
        status: 'active'
      },
      {
        title: 'Vélo de course Peugeot vintage',
        description: 'Magnifique vélo de course Peugeot des années 80, entièrement restauré. Cadre en acier, composants Shimano, parfait pour les amateurs de cyclisme vintage.',
        price: 450,
        location: 'Thiès, Sénégal',
        picture: '/images/placeholder.jpg',
        gallery: ['/images/placeholder.jpg'],
        category: 'Sport',
        subcategory: 'Vélos',
        condition: 'Bon',
        status: 'active'
      },
      {
        title: 'Cours de français - Professeur expérimenté',
        description: 'Professeur de français avec 10 ans d\'expérience propose des cours particuliers pour tous niveaux. Préparation aux examens, conversation, grammaire.',
        price: 0,
        location: 'Saint-Louis, Sénégal',
        picture: '/images/placeholder.jpg',
        gallery: ['/images/placeholder.jpg'],
        category: 'Services',
        subcategory: 'Éducation',
        condition: 'Neuf',
        status: 'active'
      },
      {
        title: 'Canapé 3 places en cuir marron',
        description: 'Beau canapé 3 places en cuir véritable, couleur marron cognac. Très confortable, quelques signes d\'usure normaux. Idéal pour salon ou bureau.',
        price: 320,
        location: 'Dakar, Sénégal',
        picture: '/images/placeholder.jpg',
        gallery: ['/images/placeholder.jpg'],
        category: 'Maison',
        subcategory: 'Mobilier',
        condition: 'Bon',
        status: 'active'
      },
      {
        title: 'MacBook Air M1 - Comme neuf',
        description: 'MacBook Air M1 13 pouces, 8GB RAM, 256GB SSD. Acheté il y a 6 mois, très peu utilisé. Vendu avec chargeur et housse de protection.',
        price: 950,
        location: 'Dakar, Sénégal',
        picture: '/images/placeholder.jpg',
        gallery: ['/images/placeholder.jpg'],
        category: 'Électronique',
        subcategory: 'Ordinateurs',
        condition: 'Comme neuf',
        status: 'active'
      }
    ];
    
    console.log('📝 Création des annonces de test...');
    
    for (const annonceData of testAnnonces) {
      const annonce = await prisma.annonce.create({
        data: {
          ...annonceData,
          userId: user.id
        }
      });
      console.log(`✅ Créée: ${annonce.title}`);
    }
    
    console.log('🎉 Annonces de test créées avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur lors de la création des annonces de test:', error);
  }
}

testAnnonces(); 