// Test des nouvelles routes de catégories
const testRoutes = [
  // Routes de catégories principales
  'http://localhost:3000/categories/vehicules',
  'http://localhost:3000/categories/immobilier',
  'http://localhost:3000/categories/electronique',
  'http://localhost:3000/categories/mode',
  'http://localhost:3000/categories/maison-jardin',
  
  // Routes avec sous-catégories
  'http://localhost:3000/categories/vehicules?subcategory=voitures',
  'http://localhost:3000/categories/electronique?subcategory=telephones-objets-connectes',
  'http://localhost:3000/categories/immobilier?subcategory=appartements',
  
  // Routes avec filtres
  'http://localhost:3000/categories/vehicules?q=toyota',
  'http://localhost:3000/categories/electronique?subcategory=ordinateurs&minPrice=100000',
  'http://localhost:3000/categories/immobilier?location=dakar&maxPrice=500000',
];

async function testRoute(url) {
  try {
    console.log(`🔍 Test de: ${url}`);
    const response = await fetch(url);
    
    if (response.ok) {
      console.log(`✅ ${response.status} - OK`);
      return true;
    } else {
      console.log(`❌ ${response.status} - ${response.statusText}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Erreur: ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Test des nouvelles routes de catégories...\n');
  
  let successCount = 0;
  let totalCount = testRoutes.length;
  
  for (const route of testRoutes) {
    const success = await testRoute(route);
    if (success) successCount++;
    console.log(''); // Ligne vide pour la lisibilité
  }
  
  console.log(`📊 Résultats: ${successCount}/${totalCount} routes fonctionnent`);
  
  if (successCount === totalCount) {
    console.log('🎉 Tous les tests sont passés !');
  } else {
    console.log('⚠️  Certains tests ont échoué');
  }
}

// Attendre que le serveur soit démarré
setTimeout(() => {
  runTests();
}, 3000); 