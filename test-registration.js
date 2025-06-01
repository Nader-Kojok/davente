// Test script for the new registration system
const API_BASE = 'http://localhost:3000/api';

async function testRegistration() {
  console.log('🧪 Testing New Registration System...\n');

  // Test data for individual account
  const individualData = {
    mobile: '+221771234567',
    password: 'TestPassword123!',
    name: 'Amadou Diallo',
    picture: '',
    accountType: 'individual',
    email: 'amadou.diallo@example.com',
    location: 'Dakar',
    profession: 'Développeur',
    bio: 'Passionné de technologie et développeur web.',
    dateOfBirth: '1990-05-15',
    gender: 'homme',
    language: 'fr',
    emailNotifications: true,
    smsNotifications: true,
    marketingEmails: false
  };

  // Test data for business account
  const businessData = {
    mobile: '+221772345678',
    password: 'BusinessPass456!',
    name: 'Fatou Sall',
    picture: '',
    accountType: 'business',
    email: 'contact@boutiquefatou.sn',
    location: 'Thiès',
    company: 'Boutique Fatou',
    profession: 'Commerce',
    website: 'https://www.boutiquefatou.sn',
    bio: 'Boutique spécialisée dans les vêtements traditionnels sénégalais.',
    language: 'fr',
    emailNotifications: true,
    smsNotifications: true,
    marketingEmails: true
  };

  try {
    // Test 1: Register individual account
    console.log('📝 Test 1: Registering individual account...');
    const individualResponse = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(individualData)
    });

    if (individualResponse.ok) {
      const individualResult = await individualResponse.json();
      console.log('✅ Individual account created successfully');
      console.log(`   User ID: ${individualResult.user.id}`);
      console.log(`   Account Type: ${individualResult.user.accountType}`);
      console.log(`   Name: ${individualResult.user.name}`);
      console.log(`   Location: ${individualResult.user.location}`);
      console.log(`   Email: ${individualResult.user.email}`);
    } else {
      const error = await individualResponse.json();
      console.log('❌ Individual registration failed:', error.error);
    }

    console.log('');

    // Test 2: Register business account
    console.log('📝 Test 2: Registering business account...');
    const businessResponse = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(businessData)
    });

    if (businessResponse.ok) {
      const businessResult = await businessResponse.json();
      console.log('✅ Business account created successfully');
      console.log(`   User ID: ${businessResult.user.id}`);
      console.log(`   Account Type: ${businessResult.user.accountType}`);
      console.log(`   Name: ${businessResult.user.name}`);
      console.log(`   Company: ${businessResult.user.company}`);
      console.log(`   Website: ${businessResult.user.website}`);
      console.log(`   Email: ${businessResult.user.email}`);
    } else {
      const error = await businessResponse.json();
      console.log('❌ Business registration failed:', error.error);
    }

    console.log('');

    // Test 3: Try to register with existing phone number
    console.log('📝 Test 3: Testing duplicate phone number validation...');
    const duplicateResponse = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...individualData,
        name: 'Different Name'
      })
    });

    if (!duplicateResponse.ok) {
      const error = await duplicateResponse.json();
      console.log('✅ Duplicate phone validation working:', error.error);
    } else {
      console.log('❌ Duplicate phone validation failed - should have been rejected');
    }

    console.log('');

    // Test 4: Try to register business without company name
    console.log('📝 Test 4: Testing business validation...');
    const invalidBusinessResponse = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mobile: '+221773456789',
        password: 'TestPass123!',
        name: 'Test User',
        accountType: 'business',
        // Missing company field
      })
    });

    if (!invalidBusinessResponse.ok) {
      const error = await invalidBusinessResponse.json();
      console.log('✅ Business validation working:', error.error);
    } else {
      console.log('❌ Business validation failed - should require company name');
    }

    console.log('');

    // Test 5: Test invalid email format
    console.log('📝 Test 5: Testing email validation...');
    const invalidEmailResponse = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mobile: '+221774567890',
        password: 'TestPass123!',
        name: 'Test User',
        email: 'invalid-email-format'
      })
    });

    if (!invalidEmailResponse.ok) {
      const error = await invalidEmailResponse.json();
      console.log('✅ Email validation working:', error.error);
    } else {
      console.log('❌ Email validation failed - should reject invalid format');
    }

    console.log('\n🎉 Registration testing completed!');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

// Run the test
testRegistration(); 