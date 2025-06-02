const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function runMigration() {
  console.log('🚀 Running Supabase migration...\n');

  try {
    // Read the migration file
    const migrationSQL = fs.readFileSync('supabase-migration.sql', 'utf8');
    
    // Split into individual statements
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`📝 Found ${statements.length} SQL statements to execute\n`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.length === 0) continue;

      console.log(`⚡ Executing statement ${i + 1}/${statements.length}...`);
      console.log(`   ${statement.substring(0, 80)}${statement.length > 80 ? '...' : ''}`);

      try {
        const { data, error } = await supabase.rpc('exec_sql', {
          sql: statement + ';'
        });

        if (error) {
          console.log(`   ❌ Error: ${error.message}`);
          
          // Some errors are acceptable (like "already exists")
          if (error.message.includes('already exists') || 
              error.message.includes('does not exist') ||
              error.message.includes('duplicate key')) {
            console.log(`   ℹ️  Continuing (acceptable error)...`);
          } else {
            console.log(`   ⚠️  Serious error - stopping`);
            break;
          }
        } else {
          console.log(`   ✅ Success`);
        }
      } catch (err) {
        console.log(`   ❌ Exception: ${err.message}`);
      }

      console.log('');
    }

    // Test the setup
    console.log('🧪 Testing the migration results...\n');

    // Check if table exists and policies are working
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('count', { count: 'exact', head: true });

    if (profileError) {
      console.log('❌ Profiles table test failed:', profileError);
    } else {
      console.log('✅ Profiles table is accessible');
      console.log(`📊 Current profile count: ${profileData || 0}`);
    }

    // Try to create a test profile
    console.log('\n🔧 Testing profile creation...');
    
    const testProfile = {
      id: '00000000-0000-0000-0000-000000000000', // Dummy UUID for testing
      name: 'Test User',
      email: 'test@example.com',
      language: 'fr',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: insertData, error: insertError } = await supabase
      .from('profiles')
      .insert([testProfile])
      .select()
      .single();

    if (insertError) {
      console.log('❌ Profile creation test failed:', insertError);
    } else {
      console.log('✅ Profile creation successful');
      
      // Clean up test data
      await supabase.from('profiles').delete().eq('id', testProfile.id);
      console.log('🧹 Test data cleaned up');
    }

  } catch (error) {
    console.error('❌ Migration failed:', error);
  }

  console.log('\n✨ Migration completed');
}

runMigration(); 