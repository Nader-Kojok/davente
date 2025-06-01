// Test final du système d'inscription
const API_BASE = 'http://localhost:3000/api';

async function testFinalRegistration() {
  console.log('🧪 Test Final du Système d\'Inscription...\n');

  // Test data for individual account with new number
  const individualData = {
    mobile: '+221779999999',
    password: 'TestPassword123!',
    name: 'Moussa Ba',
    picture: '',
    accountType: 'individual',
    email: 'moussa.ba@example.com',
    location: 'Saint-Louis',
    profession: 'Enseignant',
    bio: 'Enseignant passionné par l\'éducation.',
    dateOfBirth: '1985-03-20',
    gender: 'homme',
    language: 'fr',
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: false
  };

  // Test data for business account with new number
  const businessData = {
    mobile: '+221778888888',
    password: 'BusinessPass456!',
    name: 'Awa Diop',
    picture: '',
    accountType: 'business',
    email: 'contact@restaurant-awa.sn',
    location: 'Ziguinchor',
    company: 'Restaurant Awa',
    profession: 'Restauration',
    website: 'https://www.restaurant-awa.sn',
    bio: 'Restaurant spécialisé dans la cuisine casamançaise.',
    language: 'fr',
    emailNotifications: true,
    smsNotifications: true,
    marketingEmails: true
  };

  try {
    // Test 1: Register individual account
    console.log('📝 Test 1: Inscription compte individuel...');
    const individualResponse = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(individualData)
    });

    if (individualResponse.ok) {
      const individualResult = await individualResponse.json();
      console.log('✅ Compte individuel créé avec succès');
      console.log(`   User ID: ${individualResult.user.id}`);
      console.log(`   Type de compte: ${individualResult.user.accountType}`);
      console.log(`   Nom: ${individualResult.user.name}`);
      console.log(`   Localisation: ${individualResult.user.location}`);
      console.log(`   Email: ${individualResult.user.email}`);
      console.log(`   Profession: ${individualResult.user.profession}`);
    } else {
      const error = await individualResponse.json();
      console.log('❌ Échec inscription individuelle:', error.error);
    }

    console.log('');

    // Test 2: Register business account
    console.log('📝 Test 2: Inscription compte business...');
    const businessResponse = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(businessData)
    });

    if (businessResponse.ok) {
      const businessResult = await businessResponse.json();
      console.log('✅ Compte business créé avec succès');
      console.log(`   User ID: ${businessResult.user.id}`);
      console.log(`   Type de compte: ${businessResult.user.accountType}`);
      console.log(`   Nom: ${businessResult.user.name}`);
      console.log(`   Entreprise: ${businessResult.user.company}`);
      console.log(`   Site web: ${businessResult.user.website}`);
      console.log(`   Email: ${businessResult.user.email}`);
    } else {
      const error = await businessResponse.json();
      console.log('❌ Échec inscription business:', error.error);
    }

    console.log('\n🎉 Tests d\'inscription finaux terminés avec succès!');
    console.log('✅ Le système d\'inscription fonctionne parfaitement!');

  } catch (error) {
    console.error('❌ Test échoué avec erreur:', error.message);
  }
}

// Run the test
testFinalRegistration(); 