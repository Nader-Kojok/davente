-- Migration pour l'authentification Supabase
-- À exécuter dans le tableau de bord Supabase SQL Editor

-- 1. Créer la table profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  name TEXT,
  mobile TEXT,
  picture TEXT,
  bio TEXT,
  location TEXT,
  profession TEXT,
  language TEXT DEFAULT 'fr',
  company TEXT,
  website TEXT,
  date_of_birth DATE,
  gender TEXT,
  
  -- Préférences de contact
  show_phone BOOLEAN DEFAULT true,
  show_email BOOLEAN DEFAULT true,
  allow_sms BOOLEAN DEFAULT true,
  allow_calls BOOLEAN DEFAULT true,
  
  -- Préférences de notification
  email_notifications BOOLEAN DEFAULT true,
  sms_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT true,
  marketing_emails BOOLEAN DEFAULT false,
  
  -- Informations de vérification
  is_verified BOOLEAN DEFAULT false,
  is_phone_verified BOOLEAN DEFAULT false,
  is_email_verified BOOLEAN DEFAULT false,
  
  -- Métadonnées
  last_login_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  timezone TEXT DEFAULT 'Africa/Dakar',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Activer RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 3. Créer les politiques RLS
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 4. Créer une fonction pour automatiquement créer un profil lors de l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, picture)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name'),
    COALESCE(new.raw_user_meta_data->>'picture', new.raw_user_meta_data->>'avatar_url')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Créer le trigger pour appeler la fonction
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 6. Créer une fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Créer le trigger pour updated_at
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- 8. Créer des index pour améliorer les performances
CREATE INDEX IF NOT EXISTS profiles_email_idx ON profiles(email);
CREATE INDEX IF NOT EXISTS profiles_mobile_idx ON profiles(mobile);
CREATE INDEX IF NOT EXISTS profiles_location_idx ON profiles(location);
CREATE INDEX IF NOT EXISTS profiles_is_active_idx ON profiles(is_active);

-- 9. Insérer des données par défaut si nécessaire
-- (optionnel - vous pouvez ajuster selon vos besoins)

-- 10. Activer l'authentification par téléphone dans Supabase
-- Note: Ceci doit être configuré dans le tableau de bord Supabase
-- Authentication > Settings > Phone Auth

COMMENT ON TABLE profiles IS 'Profils utilisateurs étendus pour Grabi';
COMMENT ON COLUMN profiles.id IS 'UUID de l''utilisateur depuis auth.users';
COMMENT ON COLUMN profiles.mobile IS 'Numéro de téléphone avec code pays (+221...)';
COMMENT ON COLUMN profiles.language IS 'Langue préférée de l''utilisateur';
COMMENT ON COLUMN profiles.location IS 'Région du Sénégal';
COMMENT ON COLUMN profiles.profession IS 'Profession ou secteur d''activité'; 