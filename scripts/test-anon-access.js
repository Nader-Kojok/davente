const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Test with anon key (frontend perspective)
const supabaseAnon = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Test with service role key (backend perspective)
const supabaseService = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testAccess() {
  console.log('🔍 Testing table access...\n');

  // Test with anon key
  console.log('1️⃣ Testing with ANON key (frontend perspective):');
  try {
    const { data: anonData, error: anonError } = await supabaseAnon
      .from('profiles')
      .select('count', { count: 'exact', head: true });
    
    if (anonError) {
      console.log('❌ Anon access error:', anonError.code, anonError.message);
    } else {
      console.log('✅ Anon access successful, count:', anonData);
    }
  } catch (error) {
    console.log('❌ Anon access exception:', error.message);
  }

  console.log('\n2️⃣ Testing with SERVICE key (backend perspective):');
  try {
    const { data: serviceData, error: serviceError } = await supabaseService
      .from('profiles')
      .select('count', { count: 'exact', head: true });
    
    if (serviceError) {
      console.log('❌ Service access error:', serviceError.code, serviceError.message);
    } else {
      console.log('✅ Service access successful, count:', serviceData);
    }
  } catch (error) {
    console.log('❌ Service access exception:', error.message);
  }

  // Test RLS policies
  console.log('\n3️⃣ Testing RLS policies:');
  try {
    const { data: policies, error: policiesError } = await supabaseService
      .rpc('get_policies', { table_name: 'profiles' })
      .select('*');
    
    if (policiesError) {
      console.log('❌ Policies check error:', policiesError);
    } else {
      console.log('📋 RLS Policies:', policies);
    }
  } catch (error) {
    console.log('ℹ️  Could not fetch policies (function may not exist)');
  }

  console.log('\n✨ Test completed');
}

testAccess(); 