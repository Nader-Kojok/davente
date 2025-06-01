// Script de test pour vérifier l'API
const jwt = require('jsonwebtoken');

// Créer un token de test
const testUser = {
  userId: 1,
  mobile: '+221123456789',
  name: 'Test User'
};

const token = jwt.sign(testUser, 'm2sln+yn85jJGzQ4DBNmg94jl8ZgH3G4gC83G6I3nx+ZUpPkfr4meoWHR87qbCRzWVMKNsz7OF5KKbCR/goI3w==');

console.log('Token de test généré:', token);

// Test de création d'annonce
const testAnnonce = {
  title: 'Test Annonce API',
  description: 'Description de test pour vérifier la création d\'annonce',
  price: 50000,
  location: 'Dakar, Sénégal',
  picture: '/images/test.jpg',
  gallery: ['/images/test1.jpg', '/images/test2.jpg'],
  category: 'electronics',
  subcategory: 'phones',
  condition: 'good',
  additionalFields: { brand: 'Samsung', model: 'Galaxy S21' }
};

async function testCreateAnnonce() {
  try {
    const response = await fetch('http://localhost:3000/api/annonces', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(testAnnonce)
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Annonce créée avec succès:', result);
    } else {
      console.log('❌ Erreur lors de la création:', result);
    }
  } catch (error) {
    console.log('❌ Erreur de connexion:', error.message);
  }
}

// Lancer le test
console.log('🧪 Test de création d\'annonce...');
testCreateAnnonce(); 