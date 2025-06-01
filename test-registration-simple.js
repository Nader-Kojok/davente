async function testSimpleRegistration() {
  console.log('🧪 Test d\'inscription simplifié...\n');

  const testData = {
    mobile: '+221771234567',
    password: 'TestPassword123!',
    name: 'Test User'
  };

  try {
    console.log('📤 Envoi de la requête d\'inscription...');
    console.log('URL:', 'http://localhost:3000/api/auth/register');
    console.log('Data:', JSON.stringify(testData, null, 2));

    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    console.log('📥 Statut de la réponse:', response.status);
    console.log('📥 Headers de la réponse:', Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log('📥 Réponse brute:', responseText);

    if (responseText) {
      try {
        const responseJson = JSON.parse(responseText);
        console.log('📥 Réponse JSON:', JSON.stringify(responseJson, null, 2));
      } catch (parseError) {
        console.log('❌ Erreur de parsing JSON:', parseError.message);
      }
    } else {
      console.log('❌ Réponse vide');
    }

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
    console.error('❌ Stack trace:', error.stack);
  }
}

testSimpleRegistration(); 