// Script pour tester l'API avec un token réel
// Remplacez le token par celui de votre session

const testWithRealToken = async () => {
  // ⚠️ REMPLACEZ CE TOKEN PAR CELUI DE VOTRE NAVIGATEUR
  // Pour le récupérer: F12 > Application > Local Storage > auth_token
  const realToken = 'REMPLACEZ_PAR_VOTRE_TOKEN_ICI';
  
  const testAnnonce = {
    title: 'Test Annonce avec vrai token',
    description: 'Description de test pour vérifier la création avec un vrai utilisateur',
    price: 75000,
    location: 'Dakar, Dakar',
    picture: '/images/test.jpg',
    gallery: ['/images/test1.jpg'],
    category: 'electronics',
    subcategory: 'phones',
    condition: 'good',
    additionalFields: { brand: 'iPhone', model: '13 Pro' }
  };

  try {
    console.log('🧪 Test avec token réel...');
    console.log('📋 Données à envoyer:', testAnnonce);
    
    const response = await fetch('http://localhost:3001/api/annonces', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${realToken}`
      },
      body: JSON.stringify(testAnnonce)
    });

    console.log('📊 Statut de la réponse:', response.status);
    console.log('📋 Headers de la réponse:', Object.fromEntries(response.headers.entries()));

    const contentType = response.headers.get('content-type');
    let result;
    
    if (contentType && contentType.includes('application/json')) {
      result = await response.json();
    } else {
      result = await response.text();
    }
    
    if (response.ok) {
      console.log('✅ Annonce créée avec succès:', result);
    } else {
      console.log('❌ Erreur lors de la création:', result);
    }
    
  } catch (error) {
    console.log('💥 Erreur de connexion:', error.message);
  }
};

// Lancer le test
if (process.argv[2]) {
  // Si un token est passé en argument
  testWithRealToken();
} else {
  console.log('ℹ️ Usage: node test-real-api.js VOTRE_TOKEN_ICI');
  console.log('ℹ️ Ou modifiez le script avec votre token');
} 