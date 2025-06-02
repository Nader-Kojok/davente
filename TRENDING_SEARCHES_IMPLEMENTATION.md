# Implémentation des Recherches Tendances

## Vue d'ensemble

Le système de recherches tendances a été implémenté pour être entièrement fonctionnel avec de vraies données provenant de la base de données, remplaçant les données factices précédentes.

## Architecture

### Base de données

Le modèle `SearchTrend` a été ajouté au schéma Prisma :

```prisma
model SearchTrend {
  id          Int      @id @default(autoincrement())
  query       String   @unique
  searchCount Int      @default(1)
  dailyCount  Int      @default(1)
  weeklyCount Int      @default(1)
  lastSearched DateTime @default(now())
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([searchCount])
  @@index([dailyCount])
  @@index([weeklyCount])
  @@index([lastSearched])
  @@index([query])
}
```

### Services

#### `src/lib/trending.ts`

- **`trackSearch(query: string)`** : Enregistre une recherche dans la base de données
- **`getTrendingSearches(limit: number)`** : Récupère les recherches tendances avec calcul des tendances
- **`getTrendingCategories(limit: number)`** : Récupère les catégories tendances basées sur l'activité
- **`cleanupOldTrends()`** : Nettoie les anciennes tendances

### API Routes

#### `/api/search/track` (POST)
Enregistre une nouvelle recherche dans la base de données.

```json
{
  "query": "iPhone 15"
}
```

#### `/api/trending/searches` (GET)
Récupère les recherches tendances avec paramètre optionnel `limit`.

```json
{
  "success": true,
  "data": [
    {
      "query": "appartement",
      "count": 200,
      "dailyCount": 60,
      "weeklyCount": 140,
      "trend": "up",
      "trendPercentage": 25,
      "lastSearched": "2025-06-02T20:44:36.372Z"
    }
  ]
}
```

#### `/api/trending/categories` (GET)
Récupère les catégories tendances basées sur l'activité des annonces.

### Composants

#### `src/components/TrendingSearches.tsx`
- Affiche les recherches tendances en temps réel
- Indicateur de chargement pendant la récupération des données
- Calcul automatique des tendances (hausse/baisse/stable)
- Intégration avec le tracking des recherches

#### `src/hooks/useTrendingData.ts`
- Hook principal pour gérer les données de tendances
- Récupération des données via les API routes
- Mise à jour automatique après tracking
- Gestion des états de chargement et des erreurs

## Fonctionnalités

### Calcul des tendances

Les tendances sont calculées en comparant l'activité récente :

- **En hausse (↗)** : Augmentation de 15% ou plus
- **En baisse (↘)** : Diminution de 10% ou plus  
- **Stable (→)** : Variation entre -10% et +15%

### Réinitialisation automatique

- Les compteurs journaliers sont réinitialisés après 24h
- Les compteurs hebdomadaires sont réinitialisés après 7 jours
- Les recherches anciennes avec peu d'occurrences sont supprimées

### Performance

- Index sur les colonnes importantes pour des requêtes rapides
- Limitation du nombre de résultats pour éviter la surcharge
- Mise en cache côté client avec actualisation automatique

## Scripts utilitaires

### Initialisation des données

```bash
node scripts/seed-search-trends.js
```

Peuple la table avec des données de test initiales.

### Nettoyage périodique

```bash
node scripts/cleanup-search-trends.js
```

Nettoie les anciennes tendances et réinitialise les compteurs.

## Intégration

### Tracking automatique

Le tracking est automatiquement intégré dans :

- `SearchBar` (desktop)
- `MobileSearch` (mobile)
- `TrendingSearches` (clics sur les tendances)
- Toute navigation vers les résultats de recherche

### Mise à jour en temps réel

- Les données sont actualisées après chaque nouvelle recherche
- Délai de 1 seconde pour éviter les appels API excessifs
- Fallback vers des données par défaut en cas d'erreur

## Maintenance

### Surveillance

- Logs détaillés pour le debugging
- Gestion des erreurs avec fallback gracieux
- Métriques de performance intégrées

### Optimisation

- Requêtes optimisées avec les bons index
- Limitation des résultats pour éviter la surcharge
- Nettoyage automatique des anciennes données

### Sécurité

- Validation des entrées utilisateur
- Normalisation des requêtes de recherche
- Protection contre les injections

## Installation et déploiement

1. Appliquer la migration de base de données :
```bash
npx prisma db push
```

2. Générer le client Prisma :
```bash
npx prisma generate
```

3. Initialiser les données (optionnel) :
```bash
node scripts/seed-search-trends.js
```

4. Configurer un cron job pour le nettoyage périodique :
```bash
# Tous les jours à 3h du matin
0 3 * * * cd /path/to/project && node scripts/cleanup-search-trends.js
```

## Monitoring

Le système fournit des métriques utiles :

- Nombre total de recherches trackées
- Recherches actives (dernière semaine)
- Performance des API endpoints
- Erreurs et fallbacks

Les logs incluent des informations détaillées pour le debugging et l'optimisation. 