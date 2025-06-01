const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Configuration
const API_BASE = 'http://localhost:3000/api';
const JWT_SECRET = process.env.JWT_SECRET || 'm2sln+yn85jJGzQ4DBNmg94jl8ZgH3G4gC83G6I3nx+ZUpPkfr4meoWHR87qbCRzWVMKNsz7OF5KKbCR/goI3w==';

// Fonction utilitaire pour faire des requêtes
async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    return { status: 500, error: error.message };
  }
}

// Test complet des APIs de paramètres
async function testSettingsAPIs() {
  console.log('🧪 Test des APIs de paramètres - Grabi\n');

  // 1. Créer un utilisateur de test
  console.log('1️⃣ Création d\'un utilisateur de test...');
  const registerResult = await makeRequest(`${API_BASE}/auth/register`, {
    method: 'POST',
    body: JSON.stringify({
      mobile: '+221700000001',
      password: 'TestPassword123!',
      name: 'Test User Settings',
      picture: ''
    })
  });

  if (registerResult.status !== 201) {
    console.error('❌ Échec de la création de l\'utilisateur:', registerResult.data);
    return;
  }

  const { user, token } = registerResult.data;
  console.log('✅ Utilisateur créé:', user.name, '(ID:', user.id, ')');

  const authHeaders = { 'Authorization': `Bearer ${token}` };

  // 2. Test de récupération du profil
  console.log('\n2️⃣ Test de récupération du profil...');
  const profileResult = await makeRequest(`${API_BASE}/user/profile`, {
    headers: authHeaders
  });

  if (profileResult.status === 200) {
    console.log('✅ Profil récupéré avec succès');
    console.log('   - Langue:', profileResult.data.user.language);
    console.log('   - Fuseau horaire:', profileResult.data.user.timezone);
    console.log('   - Notifications email:', profileResult.data.user.emailNotifications);
  } else {
    console.error('❌ Échec de récupération du profil:', profileResult.data);
  }

  // 3. Test de mise à jour des paramètres du compte
  console.log('\n3️⃣ Test de mise à jour des paramètres du compte...');
  const accountUpdateResult = await makeRequest(`${API_BASE}/user/profile`, {
    method: 'PATCH',
    headers: authHeaders,
    body: JSON.stringify({
      language: 'en',
      timezone: 'Europe/Paris',
      isActive: true
    })
  });

  if (accountUpdateResult.status === 200) {
    console.log('✅ Paramètres du compte mis à jour');
    console.log('   - Nouvelle langue:', accountUpdateResult.data.user.language);
    console.log('   - Nouveau fuseau horaire:', accountUpdateResult.data.user.timezone);
  } else {
    console.error('❌ Échec de mise à jour des paramètres du compte:', accountUpdateResult.data);
  }

  // 4. Test de mise à jour des notifications
  console.log('\n4️⃣ Test de mise à jour des notifications...');
  const notificationUpdateResult = await makeRequest(`${API_BASE}/user/profile`, {
    method: 'PATCH',
    headers: authHeaders,
    body: JSON.stringify({
      emailNotifications: false,
      smsNotifications: true,
      pushNotifications: false,
      marketingEmails: true
    })
  });

  if (notificationUpdateResult.status === 200) {
    console.log('✅ Préférences de notification mises à jour');
    console.log('   - Email:', notificationUpdateResult.data.user.emailNotifications);
    console.log('   - SMS:', notificationUpdateResult.data.user.smsNotifications);
    console.log('   - Push:', notificationUpdateResult.data.user.pushNotifications);
    console.log('   - Marketing:', notificationUpdateResult.data.user.marketingEmails);
  } else {
    console.error('❌ Échec de mise à jour des notifications:', notificationUpdateResult.data);
  }

  // 5. Test de mise à jour des paramètres de confidentialité
  console.log('\n5️⃣ Test de mise à jour des paramètres de confidentialité...');
  const privacyUpdateResult = await makeRequest(`${API_BASE}/user/profile`, {
    method: 'PATCH',
    headers: authHeaders,
    body: JSON.stringify({
      showPhone: false,
      showEmail: true,
      allowSms: false,
      allowCalls: true
    })
  });

  if (privacyUpdateResult.status === 200) {
    console.log('✅ Paramètres de confidentialité mis à jour');
    console.log('   - Afficher téléphone:', privacyUpdateResult.data.user.showPhone);
    console.log('   - Afficher email:', privacyUpdateResult.data.user.showEmail);
    console.log('   - Autoriser SMS:', privacyUpdateResult.data.user.allowSms);
    console.log('   - Autoriser appels:', privacyUpdateResult.data.user.allowCalls);
  } else {
    console.error('❌ Échec de mise à jour de la confidentialité:', privacyUpdateResult.data);
  }

  // 6. Test de changement de mot de passe
  console.log('\n6️⃣ Test de changement de mot de passe...');
  const passwordChangeResult = await makeRequest(`${API_BASE}/user/password`, {
    method: 'PATCH',
    headers: authHeaders,
    body: JSON.stringify({
      currentPassword: 'TestPassword123!',
      newPassword: 'NewTestPassword456!'
    })
  });

  if (passwordChangeResult.status === 200) {
    console.log('✅ Mot de passe changé avec succès');
  } else {
    console.error('❌ Échec du changement de mot de passe:', passwordChangeResult.data);
  }

  // 7. Test de désactivation du compte
  console.log('\n7️⃣ Test de désactivation du compte...');
  const deactivateResult = await makeRequest(`${API_BASE}/user/profile`, {
    method: 'PATCH',
    headers: authHeaders,
    body: JSON.stringify({
      isActive: false
    })
  });

  if (deactivateResult.status === 200) {
    console.log('✅ Compte désactivé avec succès');
    console.log('   - Statut actif:', deactivateResult.data.user.isActive);
  } else {
    console.error('❌ Échec de désactivation du compte:', deactivateResult.data);
  }

  // 8. Test de suppression du compte
  console.log('\n8️⃣ Test de suppression du compte...');
  const deleteResult = await makeRequest(`${API_BASE}/user/delete`, {
    method: 'DELETE',
    headers: authHeaders
  });

  if (deleteResult.status === 200) {
    console.log('✅ Compte supprimé définitivement avec succès');
  } else {
    console.error('❌ Échec de suppression du compte:', deleteResult.data);
  }

  console.log('\n🎉 Tests terminés !');
}

// Exécuter les tests
if (typeof window === 'undefined') {
  // Node.js environment
  const fetch = require('node-fetch');
  global.fetch = fetch;
  testSettingsAPIs().catch(console.error);
} else {
  // Browser environment
  testSettingsAPIs().catch(console.error);
} 