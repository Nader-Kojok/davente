import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAuthState() {
  console.log('🔍 Testing Authentication State...\n');

  try {
    // Get current session
    console.log('1. Getting current session...');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('❌ Session Error:', sessionError);
      return;
    }

    if (!session) {
      console.log('ℹ️  No active session found');
      return;
    }

    console.log('✅ Active session found');
    console.log('   User ID:', session.user.id);
    console.log('   Email:', session.user.email);
    console.log('   Expires at:', new Date(session.expires_at * 1000).toLocaleString());

    // Check if profiles table exists and has data
    console.log('\n2. Checking profiles table...');
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id);

    if (profileError) {
      console.error('❌ Profile Error:', profileError);
      return;
    }

    if (profiles && profiles.length > 0) {
      console.log('✅ Profile found:');
      console.log('   Name:', profiles[0].name);
      console.log('   Email:', profiles[0].email);
      console.log('   Active:', profiles[0].is_active);
      console.log('   Created:', profiles[0].created_at);
    } else {
      console.log('⚠️  No profile found for user');
    }

    // Test RLS policies
    console.log('\n3. Testing RLS policies...');
    const { data: testProfile, error: rlsError } = await supabase
      .from('profiles')
      .select('id, name, email')
      .eq('id', session.user.id)
      .single();

    if (rlsError) {
      console.error('❌ RLS Policy Error:', rlsError);
    } else {
      console.log('✅ RLS policies working correctly');
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testAuthState(); 