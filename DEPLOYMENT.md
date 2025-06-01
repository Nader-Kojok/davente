# 🚀 Guide de Déploiement Production - Davente

## Étapes de Déploiement

### 1. 📋 Préparation de la Base de Données

#### Étape 1.1 : Exécuter les Scripts SQL dans Supabase

1. **Connectez-vous à Supabase Dashboard**
   - URL : https://pfapdbddlnkcunvffwoi.supabase.co
   - Allez dans `SQL Editor`

2. **Exécuter le script de création des tables**
   - Copiez le contenu de `scripts/create-categories-tables.sql`
   - Collez dans l'éditeur SQL et exécutez

3. **Exécuter le script de peuplement**
   - Copiez le contenu de `scripts/populate-categories.sql`
   - Collez dans l'éditeur SQL et exécutez

#### Étape 1.2 : Vérification de la Base de Données

```sql
-- Vérifier que les tables ont été créées
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Vérifier les catégories
SELECT COUNT(*) as total_categories FROM "Category";
SELECT COUNT(*) as total_subcategories FROM "Subcategory";

-- Vérifier la structure complète
SELECT 
    c.name as category_name,
    COUNT(s.id) as subcategory_count
FROM "Category" c
LEFT JOIN "Subcategory" s ON c.id = s."categoryId"
GROUP BY c.id, c.name, c."sortOrder"
ORDER BY c."sortOrder";
```

### 2. 🔧 Configuration de l'Application

#### Étape 2.1 : Variables d'Environnement

Vérifiez que toutes les variables sont configurées dans `.env` :

```bash
# Base de données
DATABASE_URL="postgresql://prisma.pfapdbddlnkcunvffwoi:PrismaDB2024!SecurePass@aws-0-eu-west-3.pooler.supabase.com:5432/postgres"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://pfapdbddlnkcunvffwoi.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Authentification
JWT_SECRET="m2sln+yn85jJGzQ4DBNmg94jl8ZgH3G4gC83G6I3nx+ZUpPkfr4meoWHR87qbCRzWVMKNsz7OF5KKbCR/goI3w=="
```

#### Étape 2.2 : Génération du Client Prisma

```bash
npx prisma generate
```

### 3. 🏗️ Build et Test Local

#### Étape 3.1 : Build de Production

```bash
npm run build
```

#### Étape 3.2 : Test Local

```bash
npm start
```

#### Étape 3.3 : Test des APIs

```bash
# Test de l'API des catégories
curl http://localhost:3000/api/categories

# Test de connexion à la base de données
curl http://localhost:3000/api/test
```

### 4. 🌐 Déploiement Vercel

#### Étape 4.1 : Configuration Vercel

```bash
# Installer Vercel CLI si pas déjà fait
npm i -g vercel

# Se connecter à Vercel
vercel login

# Déployer
vercel --prod
```

#### Étape 4.2 : Variables d'Environnement Vercel

Configurez les variables d'environnement dans Vercel Dashboard :

1. Allez sur https://vercel.com/dashboard
2. Sélectionnez votre projet
3. Allez dans `Settings` > `Environment Variables`
4. Ajoutez toutes les variables de `.env`

### 5. ✅ Vérification Post-Déploiement

#### Étape 5.1 : Tests Fonctionnels

1. **Page d'accueil** : Vérifiez que les catégories s'affichent
2. **API Categories** : `https://votre-domaine.vercel.app/api/categories`
3. **Filtres** : Testez les filtres par catégorie
4. **Publication** : Testez la sélection de catégories
5. **Navigation** : Vérifiez le menu des catégories

#### Étape 5.2 : Tests de Performance

```bash
# Test de charge basique
curl -w "@curl-format.txt" -o /dev/null -s "https://votre-domaine.vercel.app/api/categories"
```

### 6. 📊 Monitoring et Maintenance

#### Étape 6.1 : Logs Vercel

- Surveillez les logs dans Vercel Dashboard
- Vérifiez les erreurs de build ou runtime

#### Étape 6.2 : Monitoring Base de Données

- Surveillez les performances dans Supabase Dashboard
- Vérifiez l'utilisation des ressources

## 🔍 Résolution de Problèmes

### Problème : Tables de catégories non créées

**Solution :**
1. Vérifiez la connexion à Supabase
2. Exécutez manuellement les scripts SQL
3. Vérifiez les permissions de la base de données

### Problème : Erreur Prisma Client

**Solution :**
```bash
npx prisma generate
npm run build
```

### Problème : Variables d'environnement manquantes

**Solution :**
1. Vérifiez `.env.local` pour le développement
2. Configurez les variables dans Vercel Dashboard
3. Redéployez l'application

## 📈 Métriques de Succès

- ✅ 12 catégories principales créées
- ✅ 49 sous-catégories créées
- ✅ API `/api/categories` fonctionnelle
- ✅ Composants utilisant les nouvelles catégories
- ✅ Filtres par catégorie opérationnels
- ✅ Sélection de catégories dans les formulaires

## 🎯 Prochaines Étapes

1. **Optimisation SEO** : Pages dédiées par catégorie
2. **Analytics** : Suivi des catégories populaires
3. **Admin Interface** : Gestion des catégories
4. **Cache** : Mise en cache des catégories
5. **Internationalisation** : Support multi-langue

---

**Status : 🟢 PRÊT POUR LA PRODUCTION**

Toutes les fonctionnalités de catégories sont implémentées et testées. L'application est prête pour le déploiement en production. 