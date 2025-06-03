// Utiliser fetch natif de Node.js 18+ ou fallback
const fetch = globalThis.fetch || require('node-fetch');

// Configuration du test
const CONFIG = {
  baseUrl: 'http://localhost:3000',
  endpoints: [
    '/api/annonces',
    '/api/annonces?page=1&limit=10',
    '/api/annonces?category=electronics',
    '/api/annonces?sortBy=price_asc',
    '/api/performance'
  ],
  concurrentRequests: 5,
  totalRequests: 20,
  delayBetweenRequests: 100 // ms
};

// Métriques de test
const testMetrics = {
  totalRequests: 0,
  successfulRequests: 0,
  failedRequests: 0,
  responseTimes: [],
  errors: [],
  cacheHits: 0,
  cacheMisses: 0
};

// Fonction pour faire une requête et mesurer le temps
async function makeRequest(url) {
  const startTime = Date.now();
  
  try {
    const response = await fetch(url);
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    const isCacheHit = response.headers.get('x-cache') === 'HIT';
    
    testMetrics.totalRequests++;
    testMetrics.responseTimes.push(responseTime);
    
    if (response.ok) {
      testMetrics.successfulRequests++;
      if (isCacheHit) {
        testMetrics.cacheHits++;
      } else {
        testMetrics.cacheMisses++;
      }
    } else {
      testMetrics.failedRequests++;
      testMetrics.errors.push({
        url,
        status: response.status,
        statusText: response.statusText,
        responseTime
      });
    }
    
    return {
      url,
      status: response.status,
      responseTime,
      isCacheHit,
      success: response.ok
    };
  } catch (error) {
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    testMetrics.totalRequests++;
    testMetrics.failedRequests++;
    testMetrics.errors.push({
      url,
      error: error.message,
      responseTime
    });
    
    return {
      url,
      error: error.message,
      responseTime,
      success: false
    };
  }
}

// Fonction pour exécuter un test de charge
async function runLoadTest() {
  console.log('🚀 Début du test de performance...');
  console.log(`📊 Configuration:
  - URL de base: ${CONFIG.baseUrl}
  - Endpoints testés: ${CONFIG.endpoints.length}
  - Requêtes concurrentes: ${CONFIG.concurrentRequests}
  - Total requêtes: ${CONFIG.totalRequests}
  - Délai entre requêtes: ${CONFIG.delayBetweenRequests}ms
  `);
  
  const startTime = Date.now();
  const promises = [];
  
  // Créer les requêtes concurrentes
  for (let i = 0; i < CONFIG.totalRequests; i++) {
    const endpoint = CONFIG.endpoints[i % CONFIG.endpoints.length];
    const url = `${CONFIG.baseUrl}${endpoint}`;
    
    // Ajouter un délai pour éviter de surcharger le serveur
    const delay = Math.floor(i / CONFIG.concurrentRequests) * CONFIG.delayBetweenRequests;
    
    const promise = new Promise(resolve => {
      setTimeout(async () => {
        const result = await makeRequest(url);
        resolve(result);
      }, delay);
    });
    
    promises.push(promise);
  }
  
  // Attendre toutes les requêtes
  console.log('⏳ Exécution des requêtes...');
  const results = await Promise.all(promises);
  
  const endTime = Date.now();
  const totalTestTime = endTime - startTime;
  
  // Calculer les statistiques
  const stats = calculateStats(results, totalTestTime);
  
  // Afficher les résultats
  displayResults(stats);
  
  return stats;
}

// Fonction pour calculer les statistiques
function calculateStats(results, totalTestTime) {
  const responseTimes = testMetrics.responseTimes.sort((a, b) => a - b);
  
  const stats = {
    totalTime: totalTestTime,
    totalRequests: testMetrics.totalRequests,
    successfulRequests: testMetrics.successfulRequests,
    failedRequests: testMetrics.failedRequests,
    successRate: ((testMetrics.successfulRequests / testMetrics.totalRequests) * 100).toFixed(2),
    cacheHitRate: testMetrics.cacheHits > 0 ? ((testMetrics.cacheHits / (testMetrics.cacheHits + testMetrics.cacheMisses)) * 100).toFixed(2) : '0.00',
    responseTimes: {
      min: Math.min(...responseTimes),
      max: Math.max(...responseTimes),
      avg: (responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length).toFixed(2),
      p50: responseTimes[Math.floor(responseTimes.length * 0.5)],
      p95: responseTimes[Math.floor(responseTimes.length * 0.95)],
      p99: responseTimes[Math.floor(responseTimes.length * 0.99)]
    },
    throughput: (testMetrics.successfulRequests / (totalTestTime / 1000)).toFixed(2),
    errors: testMetrics.errors
  };
  
  return stats;
}

// Fonction pour afficher les résultats
function displayResults(stats) {
  console.log('\n📊 RÉSULTATS DU TEST DE PERFORMANCE');
  console.log('=====================================');
  
  console.log(`⏱️  Temps total: ${stats.totalTime}ms`);
  console.log(`📈 Requêtes totales: ${stats.totalRequests}`);
  console.log(`✅ Requêtes réussies: ${stats.successfulRequests}`);
  console.log(`❌ Requêtes échouées: ${stats.failedRequests}`);
  console.log(`📊 Taux de succès: ${stats.successRate}%`);
  console.log(`🎯 Taux de cache hit: ${stats.cacheHitRate}%`);
  console.log(`🚀 Débit: ${stats.throughput} req/s`);
  
  console.log('\n⏱️  TEMPS DE RÉPONSE:');
  console.log(`   Min: ${stats.responseTimes.min}ms`);
  console.log(`   Max: ${stats.responseTimes.max}ms`);
  console.log(`   Moyenne: ${stats.responseTimes.avg}ms`);
  console.log(`   P50: ${stats.responseTimes.p50}ms`);
  console.log(`   P95: ${stats.responseTimes.p95}ms`);
  console.log(`   P99: ${stats.responseTimes.p99}ms`);
  
  if (stats.errors.length > 0) {
    console.log('\n❌ ERREURS:');
    stats.errors.forEach((error, index) => {
      console.log(`   ${index + 1}. ${error.url}: ${error.error || error.statusText} (${error.responseTime}ms)`);
    });
  }
  
  console.log('\n💡 RECOMMANDATIONS:');
  
  if (parseFloat(stats.successRate) < 95) {
    console.log('   ⚠️ Taux de succès faible (<95%). Vérifiez la stabilité du serveur.');
  }
  
  if (stats.responseTimes.p95 > 2000) {
    console.log('   🐌 P95 élevé (>2s). Optimisez les requêtes lentes.');
  }
  
  if (parseFloat(stats.cacheHitRate) < 30) {
    console.log('   📈 Taux de cache faible (<30%). Améliorez la stratégie de cache.');
  }
  
  if (parseFloat(stats.throughput) < 5) {
    console.log('   🚀 Débit faible (<5 req/s). Optimisez les performances générales.');
  }
  
  if (parseFloat(stats.successRate) >= 95 && stats.responseTimes.p95 <= 2000 && parseFloat(stats.cacheHitRate) >= 30) {
    console.log('   ✅ Performances excellentes ! Continuez ainsi.');
  }
  
  console.log('\n🎯 PROCHAINES ÉTAPES:');
  console.log('   1. Surveillez les métriques avec: npm run performance:monitor');
  console.log('   2. Optimisez la base de données avec: npm run db:optimize');
  console.log('   3. Relancez ce test après optimisations');
}

// Test de stress spécifique
async function runStressTest() {
  console.log('\n🔥 TEST DE STRESS - CACHE');
  console.log('========================');
  
  // Test 1: Cache miss (première requête)
  console.log('📊 Test 1: Cache miss...');
  const cacheMissResult = await makeRequest(`${CONFIG.baseUrl}/api/annonces?test=${Date.now()}`);
  console.log(`   Temps: ${cacheMissResult.responseTime}ms, Cache: ${cacheMissResult.isCacheHit ? 'HIT' : 'MISS'}`);
  
  // Test 2: Cache hit (même requête)
  console.log('📊 Test 2: Cache hit...');
  const cacheHitResult = await makeRequest(`${CONFIG.baseUrl}/api/annonces?test=${Date.now()}`);
  console.log(`   Temps: ${cacheHitResult.responseTime}ms, Cache: ${cacheHitResult.isCacheHit ? 'HIT' : 'MISS'}`);
  
  // Test 3: Requêtes multiples simultanées
  console.log('📊 Test 3: Requêtes simultanées...');
  const simultaneousPromises = Array(10).fill().map(() => 
    makeRequest(`${CONFIG.baseUrl}/api/annonces`)
  );
  const simultaneousResults = await Promise.all(simultaneousPromises);
  const avgSimultaneous = simultaneousResults.reduce((sum, r) => sum + r.responseTime, 0) / simultaneousResults.length;
  const cacheHits = simultaneousResults.filter(r => r.isCacheHit).length;
  console.log(`   Temps moyen: ${avgSimultaneous.toFixed(2)}ms, Cache hits: ${cacheHits}/10`);
}

// Fonction principale
async function main() {
  try {
    // Vérifier que le serveur est accessible
    console.log('🔍 Vérification de la connexion au serveur...');
    const healthCheck = await makeRequest(`${CONFIG.baseUrl}/api/test`);
    
    if (!healthCheck.success) {
      console.error('❌ Serveur non accessible. Assurez-vous que le serveur de développement fonctionne (npm run dev).');
      process.exit(1);
    }
    
    console.log('✅ Serveur accessible');
    
    // Exécuter le test de charge principal
    await runLoadTest();
    
    // Exécuter le test de stress
    await runStressTest();
    
    console.log('\n🎉 Tests terminés avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
    process.exit(1);
  }
}

// Exécuter si appelé directement
if (require.main === module) {
  main();
}

module.exports = { runLoadTest, runStressTest, makeRequest }; 