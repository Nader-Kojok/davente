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
