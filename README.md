# Grabi - Plateforme de Petites Annonces

Grabi est une plateforme moderne de petites annonces pour le Sénégal, construite avec Next.js 15, React 19, TypeScript et Prisma.

## 🚀 Fonctionnalités

- **Authentification complète** : Inscription, connexion, gestion de profil
- **Gestion des annonces** : Création, modification, suppression d'annonces
- **Recherche avancée** : Recherche textuelle avec filtres et suggestions
- **Upload d'images** : Gestion des photos d'annonces
- **Système de catégories** : Organisation par catégories et sous-catégories
- **Interface moderne** : Design responsive avec Tailwind CSS

## 🔍 Système de Recherche

Le système de recherche utilise Prisma pour offrir :

- **Recherche textuelle** : Dans les titres et descriptions
- **Filtres avancés** : Par catégorie, prix, localisation, condition
- **Suggestions en temps réel** : Autocomplétion avec aperçu des annonces
- **Tri flexible** : Par pertinence, prix, date

### API Endpoints

- `GET /api/search/advanced` - Recherche avancée avec filtres
- `GET /api/search/suggestions` - Suggestions d'autocomplétion

## 🛠 Installation

1. **Cloner le projet**
```bash
git clone <repository-url>
cd grabi
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration de l'environnement**
```bash
cp .env.example .env
```

Configurer les variables dans `.env` :
- `DATABASE_URL` : URL de votre base PostgreSQL
- `JWT_SECRET` : Clé secrète pour les tokens JWT
- `NEXT_PUBLIC_SUPABASE_URL` : URL Supabase (optionnel)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` : Clé publique Supabase (optionnel)

4. **Configuration de la base de données**
```bash
npm run prisma:generate
npm run prisma:migrate
```

5. **Peupler les catégories**
```bash
npm run populate:categories
```

6. **Lancer le serveur de développement**
```bash
npm run dev
```

L'application sera disponible sur `http://localhost:3000`

## 📁 Structure du Projet

```
src/
├── app/                    # Pages Next.js (App Router)
│   ├── api/               # API Routes
│   ├── annonces/          # Pages des annonces
│   └── auth/              # Pages d'authentification
├── components/            # Composants React réutilisables
├── lib/                   # Utilitaires et configuration
│   ├── prisma.ts         # Client Prisma
│   └── search.ts         # Système de recherche
├── types/                 # Types TypeScript
└── hooks/                 # Hooks React personnalisés
```

## 🔧 Scripts Disponibles

- `npm run dev` - Serveur de développement
- `npm run build` - Build de production
- `npm run start` - Serveur de production
- `npm run prisma:generate` - Générer le client Prisma
- `npm run prisma:migrate` - Appliquer les migrations
- `npm run prisma:studio` - Interface Prisma Studio
- `npm run populate:categories` - Peupler les catégories

## 🌐 Déploiement sur Vercel

1. **Connecter votre repository à Vercel**
2. **Configurer les variables d'environnement** dans le dashboard Vercel
3. **Déployer** - Vercel détectera automatiquement Next.js

### Variables d'environnement pour la production

```env
DATABASE_URL="postgresql://..."
JWT_SECRET="your-production-jwt-secret"
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
NODE_ENV="production"
```

## 🎯 Fonctionnalités de Recherche

### Recherche Textuelle
- Recherche dans les titres et descriptions
- Insensible à la casse
- Support des caractères spéciaux français

### Filtres Disponibles
- **Catégorie** : Filtrage par catégorie principale
- **Sous-catégorie** : Filtrage par sous-catégorie
- **Prix** : Fourchette de prix min/max
- **Localisation** : Recherche par ville/région
- **Condition** : État de l'article
- **Type d'utilisateur** : Particulier ou professionnel

### Options de Tri
- **Pertinence** : Tri par pertinence du terme de recherche
- **Date** : Plus récent ou plus ancien
- **Prix** : Croissant ou décroissant

## 🔒 Sécurité

- Authentification JWT
- Validation des données côté serveur
- Protection CSRF
- Sanitisation des entrées utilisateur

## 📱 Responsive Design

L'interface s'adapte automatiquement à tous les écrans :
- Mobile (320px+)
- Tablette (768px+)
- Desktop (1024px+)

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -m 'Ajouter nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

Pour toute question ou problème :
- Ouvrir une issue sur GitHub
- Consulter la documentation Prisma : https://www.prisma.io/docs
- Documentation Next.js : https://nextjs.org/docs

## 🚀 Démarrage rapide

### Installation
```bash
git clone <repository-url>
cd grabi
npm install
```

### Configuration
1. Copiez `.env.example` vers `.env`
2. Configurez vos variables d'environnement :
   - `DATABASE_URL` : URL de connexion Supabase (pooled)
   - `DIRECT_URL` : URL de connexion directe Supabase
   - `JWT_SECRET` : Clé secrète pour l'authentification
   - Autres variables Supabase

### Base de données

#### 🧪 Développement local
```bash
# Tests rapides et modifications de schéma
npm run db:push

# Visualiser la base de données
npm run db:studio

# Peupler avec les catégories
npm run db:seed
```

#### 🏗️ Avant déploiement
```bash
# Créer une migration pour vos changements
npm run db:migrate

# Exemple
npx prisma migrate dev --name "add_new_feature"
```

#### 🚀 Production (automatique)
- Vercel applique automatiquement `prisma migrate deploy`
- Les migrations sont versionnées et sécurisées
- Aucune intervention manuelle requise

### Développement
```bash
npm run dev
```

## 📋 Workflow recommandé

### 1. Développement local
```bash
# Modifier schema.prisma
# Tester rapidement
npm run db:push

# Visualiser les changements
npm run db:studio
```

### 2. Avant commit
```bash
# Créer une migration propre
npm run db:migrate

# Commit avec les fichiers de migration
git add prisma/migrations/
git commit -m "feat: add new database schema"
```

### 3. Déploiement
```bash
# Déployer sur Vercel
vercel --prod

# Les migrations s'appliquent automatiquement
```

## 🛠️ Scripts disponibles

| Script | Description |
|--------|-------------|
| `npm run dev` | Démarre le serveur de développement |
| `npm run build` | Build l'application |
| `npm run db:push` | Synchronise le schéma (développement) |
| `npm run db:migrate` | Crée une nouvelle migration |
| `npm run db:studio` | Interface graphique Prisma |
| `npm run db:seed` | Peuple la base avec les catégories |
| `npm run db:reset` | Remet à zéro la base de données |

## 🎯 Fonctionnalités

- ✅ Authentification utilisateur
- ✅ Publication d'annonces avec images
- ✅ Système de catégories (12 catégories, 51 sous-catégories)
- ✅ Recherche avancée et filtres
- ✅ Favoris et bookmarks
- ✅ Interface responsive
- ✅ Optimisations SEO
- ✅ Upload d'images (Vercel Blob)

## 🏗️ Architecture

- **Frontend** : Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Base de données** : Supabase (PostgreSQL)
- **ORM** : Prisma
- **Authentification** : JWT + Supabase Auth
- **Déploiement** : Vercel
- **Storage** : Vercel Blob Storage

## 📦 Structure du projet

```
davente/
├── src/
│   ├── app/              # Pages Next.js (App Router)
│   ├── components/       # Composants React réutilisables
│   ├── lib/             # Utilitaires et configurations
│   └── types/           # Types TypeScript
├── prisma/
│   ├── schema.prisma    # Schéma de base de données
│   └── migrations/      # Historique des migrations
├── scripts/             # Scripts de build et de setup
└── public/             # Assets statiques
```

## 🔒 Sécurité

- Validation côté serveur avec Zod
- Authentification JWT sécurisée
- Row Level Security (RLS) sur Supabase
- Variables d'environnement chiffrées
- Validation des uploads d'images

## 📈 Performance

- Server Components par défaut
- Lazy loading des images
- Code splitting automatique
- Cache optimisé
- Bundle analysis intégré

---

Développé avec ❤️ pour une expérience utilisateur moderne et performante.
