# Migration vers l'authentification Supabase

Ce document décrit la migration du système d'authentification personnalisé (JWT + bcrypt) vers Supabase Auth pour simplifier l'expérience utilisateur.

## 🎯 Objectifs de la migration

1. **Simplification** : Supprimer la complexité du système d'authentification personnalisé
2. **Providers sociaux** : Ajouter Google et Facebook OAuth facilement
3. **Sécurité** : Bénéficier des meilleures pratiques de Supabase
4. **Fonctionnalités** : Email/SMS OTP, gestion des sessions, etc.

## 📋 Checklist de migration

### ✅ 1. Configuration Supabase

- [x] Installation des packages nécessaires (`@supabase/supabase-js`, `@supabase/ssr`)
- [x] Configuration du client Supabase (`src/lib/supabase.ts`)
- [x] Variables d'environnement ajoutées

### ✅ 2. Base de données

- [x] Schéma SQL pour la table `profiles` (`supabase-migration.sql`)
- [x] Politiques RLS (Row Level Security)
- [x] Triggers automatiques pour la création de profils
- [x] Index pour les performances

### ✅ 3. Authentification

- [x] Nouveau `AuthContext` utilisant Supabase Auth
- [x] Support email/téléphone + mot de passe
- [x] Providers sociaux (Google, Facebook)
- [x] Page de callback OAuth (`/auth/callback`)

### ✅ 4. Interface utilisateur

- [x] Page de connexion mise à jour (`/login`)
- [x] Page d'inscription mise à jour (`/register`)
- [x] Middleware pour protéger les routes

### 🔄 5. À configurer dans Supabase Dashboard

#### Authentification par email
1. Aller dans **Authentication > Settings**
2. Activer **Email confirmations** si souhaité
3. Configurer les templates d'email

#### Authentification par téléphone
1. Aller dans **Authentication > Settings > Phone Auth**
2. Choisir un provider SMS (Twilio, MessageBird, etc.)
3. Configurer les clés API du provider

#### Providers OAuth
1. **Google OAuth** :
   - Aller dans **Authentication > Providers > Google**
   - Activer le provider
   - Ajouter `Client ID` et `Client Secret` depuis Google Cloud Console
   - URL de redirection : `https://votre-projet.supabase.co/auth/v1/callback`

2. **Facebook OAuth** :
   - Aller dans **Authentication > Providers > Facebook**
   - Activer le provider
   - Ajouter `App ID` et `App Secret` depuis Facebook Developers
   - URL de redirection : `https://votre-projet.supabase.co/auth/v1/callback`

### 📝 6. Variables d'environnement requises

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://votre-projet.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="votre-anon-key"
SUPABASE_SERVICE_ROLE_KEY="votre-service-role-key"

# Site URL pour les redirections OAuth
NEXT_PUBLIC_SITE_URL="https://votre-domaine.com"
```

## 🔄 Changements principaux

### AuthContext

**Avant** (JWT personnalisé) :
```typescript
const { login, register, logout } = useAuth();
await login(phone, password);
```

**Après** (Supabase) :
```typescript
const { signInWithEmail, signInWithPhone, signUpWithEmail, signUpWithPhone, signInWithGoogle, signOut } = useAuth();
await signInWithEmail(email, password);
await signInWithGoogle(); // OAuth automatique
```

### Structure des données utilisateur

**Avant** :
- Table `users` personnalisée
- Token JWT stocké en localStorage

**Après** :
- Table `auth.users` (gérée par Supabase)
- Table `profiles` (données étendues)
- Session gérée automatiquement

### Authentification sociale

**Avant** : Non disponible

**Après** : 
- Google OAuth en un clic
- Facebook OAuth en un clic
- Redirection automatique via `/auth/callback`

## 🛡️ Sécurité

### Améliorations de sécurité

1. **Sessions sécurisées** : Gérées par Supabase avec refresh tokens
2. **RLS (Row Level Security)** : Protection automatique des données
3. **PKCE Flow** : Flux OAuth sécurisé
4. **Rate limiting** : Protection contre les attaques par force brute
5. **Validation email/SMS** : Vérification automatique des comptes

### Politiques RLS

```sql
-- Les utilisateurs ne peuvent voir que leur propre profil
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Les utilisateurs ne peuvent modifier que leur propre profil
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
```

## 🔧 Guide de déploiement

### 1. Préparer Supabase

```bash
# 1. Créer un nouveau projet Supabase
# 2. Exécuter le script SQL dans l'éditeur SQL
# 3. Configurer les providers OAuth
# 4. Configurer les templates d'email/SMS
```

### 2. Mise à jour des variables d'environnement

```bash
# Mettre à jour .env.production avec les nouvelles variables Supabase
```

### 3. Déploiement

```bash
npm run build
# Déployer sur Vercel/votre plateforme
```

## 🎨 Expérience utilisateur

### Nouveautés pour les utilisateurs

1. **Connexion rapide** avec Google/Facebook
2. **Choix** entre email ou téléphone pour l'inscription
3. **Mot de passe oublié** avec reset automatique
4. **Vérification** email/SMS optionnelle
5. **Sessions persistantes** - plus besoin de se reconnecter

### Interface

- Toggle élégant Email/Téléphone
- Boutons sociaux intégrés
- Messages d'erreur clairs
- Flow d'inscription simplifié (3 étapes au lieu de 4)

## 🔍 Tests

### Tester l'authentification

1. **Inscription email** : Créer un compte avec email + mot de passe
2. **Inscription téléphone** : Créer un compte avec téléphone + mot de passe
3. **Connexion Google** : Test OAuth Google
4. **Connexion Facebook** : Test OAuth Facebook
5. **Persistance** : Vérifier que la session persiste après refresh
6. **Protection** : Tenter d'accéder à `/profil` sans être connecté

### Commandes de test

```bash
# Vérifier que l'application compile
npm run build

# Tester en développement
npm run dev
```

## 🚀 Prochaines étapes

1. **Migration des utilisateurs existants** (si nécessaire)
2. **Configuration des templates d'email** personnalisés
3. **Ajout d'autres providers** (Apple, GitHub, etc.)
4. **Mise en place des analytics** d'authentification
5. **Tests de charge** sur les nouvelles API

## 📞 Support

En cas de problème :
1. Vérifier les logs Supabase Dashboard
2. Consulter la documentation Supabase Auth
3. Vérifier les variables d'environnement
4. Tester les redirections OAuth

---

**Note** : Cette migration simplifie grandement l'authentification tout en ajoutant de nouvelles fonctionnalités. L'expérience utilisateur est considérablement améliorée avec les connexions sociales et la persistance automatique des sessions. 