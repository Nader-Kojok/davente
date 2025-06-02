const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createBasicProfilesTable() {
  console.log('🚀 Creating basic profiles table...\n');

  try {
    // First, let's try a simple approach - just insert a profile directly
    // This will tell us if the table exists or not
    
    console.log('1️⃣ Testing if we can create a profile directly...');
    
    const testUserId = '00000000-0000-0000-0000-000000000001';
    const { data, error } = await supabase
      .from('profiles')
      .insert([{
        id: testUserId,
        name: 'Test User',
        email: 'test@example.com',
        language: 'fr',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.log('❌ Direct insert failed:', error);
      
      if (error.code === '42P01') {
        console.log('\n🔧 Table does not exist. You need to create it manually.');
        console.log('📝 Copy the contents of scripts/create-profiles-table.sql');
        console.log('🔗 And run it in the Supabase SQL Editor:');
        console.log(`   ${process.env.NEXT_PUBLIC_SUPABASE_URL.replace('/rest/v1', '')}/project/default/sql`);
      } else if (error.code === '23503') {
        console.log('\n⚠️  Foreign key constraint failed - user does not exist in auth.users');
        console.log('✅ But this means the table structure is correct!');
      } else {
        console.log('\n🤔 Unexpected error. Here are the details:');
        console.log('Code:', error.code);
        console.log('Message:', error.message);
      }
    } else {
      console.log('✅ Profile created successfully! Table exists and works.');
      console.log('Data:', data);
      
      // Clean up
      await supabase.from('profiles').delete().eq('id', testUserId);
      console.log('🧹 Test data cleaned up');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }

  console.log('\n✨ Test completed');
}

createBasicProfilesTable(); 