/**
 * Script pour créer la table profiles dans Supabase
 * À exécuter avec: node scripts/setup-supabase-profiles.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement manquantes:');
  console.error('- NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl);
  console.error('- SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupProfilesTable() {
  console.log('🚀 Configuration de la table profiles...');

  try {
    // Essayer d'accéder à la table profiles directement
    const { data, error } = await supabase
      .from('profiles')
      .select('count', { count: 'exact', head: true });

    if (error) {
      if (error.code === '42P01') {
        console.log('❌ La table profiles n\'existe pas.');
        console.log('📝 Veuillez exécuter la migration SQL dans votre tableau de bord Supabase:');
        console.log(`   ${supabaseUrl.replace('/rest/v1', '')}/project/default/sql`);
        console.log('\n📋 Copiez et exécutez le contenu du fichier: supabase-migration.sql');
        return false;
      } else {
        console.error('❌ Erreur lors de l\'accès à la table profiles:', error);
        return false;
      }
    }

    console.log('✅ La table profiles existe');
    console.log(`📊 Nombre de profils existants: ${data || 0}`);
    return true;

  } catch (error) {
    console.error('❌ Erreur lors de la configuration:', error);
    return false;
  }
}

async function createTestProfile() {
  console.log('\n🧪 Test de création d\'un profil...');

  try {
    // Obtenir les utilisateurs
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();

    if (usersError) {
      console.error('❌ Erreur lors de la récupération des utilisateurs:', usersError);
      return;
    }

    if (!users || users.length === 0) {
      console.log('ℹ️  Aucun utilisateur trouvé pour tester');
      return;
    }

    const user = users[0];
    console.log(`👤 Test avec l'utilisateur: ${user.email || user.id}`);

    // Essayer de créer un profil de test
    const { data, error } = await supabase
      .from('profiles')
      .upsert([
        {
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name || user.user_metadata?.full_name || 'Utilisateur Test',
          picture: user.user_metadata?.picture || user.user_metadata?.avatar_url,
          language: 'fr',
          timezone: 'Africa/Dakar',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('❌ Erreur lors de la création du profil test:', error);
    } else {
      console.log('✅ Profil test créé avec succès:', data);
    }

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

async function main() {
  console.log('🔧 Script de configuration Supabase Profiles\n');
  
  const tableExists = await setupProfilesTable();
  
  if (tableExists) {
    await createTestProfile();
  }
  
  console.log('\n✨ Vérification terminée');
}

main().catch(console.error); 