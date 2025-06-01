# Section "Top catégories" dynamique

## Vue d'ensemble

La section "Top catégories" a été rendue dynamique et utilise maintenant la base de données pour afficher les catégories les plus populaires basées sur le nombre d'annonces actives.

## Architecture

### 1. API Route (`/api/categories/top`)

**Fichier**: `src/app/api/categories/top/route.ts`

L'API utilise une requête SQL brute pour optimiser les performances :

```sql
SELECT 
  c.id,
  c.name,
  c.slug,
  c.icon,
  c.description,
  COALESCE(COUNT(a.id), 0) as annonce_count
FROM "Category" c
LEFT JOIN "Annonce" a ON c.id = a."categoryId" AND a.status = 'active'
WHERE c."isActive" = true
GROUP BY c.id, c.name, c.slug, c.icon, c.description, c."sortOrder"
ORDER BY annonce_count DESC, c."sortOrder" ASC
LIMIT 6
```

**Fonctionnalités** :
- Récupère les 6 catégories les plus populaires
- Compte uniquement les annonces actives
- Inclut un système de fallback vers les données statiques
- Gestion d'erreurs robuste

### 2. Hook personnalisé (`useTopCategories`)

**Fichier**: `src/hooks/useTopCategories.ts`

Hook React qui gère :
- Le chargement des données depuis l'API
- La gestion des états de chargement et d'erreur
- Le cache automatique des données

### 3. Types TypeScript

**Fichier**: `src/types/category.ts`

Types partagés pour assurer la cohérence :
- `TopCategory` : Interface pour les catégories populaires
- `CategoryWithSubcategories` : Interface complète avec sous-catégories
- `Subcategory` : Interface pour les sous-catégories

### 4. Composant mis à jour

**Fichier**: `src/components/TopCategories.tsx`

Améliorations apportées :
- Utilisation des données dynamiques de la base de données
- Affichage du nombre d'annonces par catégorie
- États de chargement avec skeleton loading
- Gestion d'erreurs avec message utilisateur
- Affichage des icônes de catégories

## Fonctionnalités

### Données dynamiques
- Les catégories sont triées par popularité (nombre d'annonces)
- Mise à jour en temps réel basée sur les annonces actives
- Fallback automatique vers les données statiques en cas d'erreur

### Interface utilisateur
- **Skeleton loading** : Animation de chargement pendant la récupération des données
- **Compteurs d'annonces** : Affichage du nombre d'annonces par catégorie
- **Icônes** : Affichage des icônes emoji pour chaque catégorie
- **Navigation** : Liens directs vers les annonces de chaque catégorie

### Performance
- Requête SQL optimisée avec JOIN et agrégation
- Limitation à 6 catégories pour éviter la surcharge
- Cache côté client via le hook React

## Page d'administration

**Fichier**: `src/app/admin/categories/page.tsx`

Une page d'administration a été créée pour :
- Visualiser les statistiques des catégories
- Afficher la répartition des annonces
- Monitorer les performances des catégories
- Accéder directement aux annonces de chaque catégorie

**URL d'accès** : `/admin/categories`

### Fonctionnalités de la page admin
- **Statistiques globales** : Total catégories, total annonces, moyenne
- **Tableau détaillé** : Liste des catégories avec pourcentages
- **Graphiques** : Barres de progression pour visualiser la répartition
- **Actions** : Liens directs vers les annonces de chaque catégorie

## Installation et configuration

### 1. Base de données
Les catégories doivent être présentes en base de données :

```bash
# Exécuter le script de configuration
node scripts/setup-categories.js
```

### 2. Types Prisma
S'assurer que le client Prisma est généré :

```bash
npx prisma generate
npx prisma db push
```

### 3. Variables d'environnement
Vérifier que `DATABASE_URL` est configurée dans `.env.local`

## Utilisation

### Dans un composant
```typescript
import { useTopCategories } from '@/hooks/useTopCategories';

function MyComponent() {
  const { categories, isLoading, error } = useTopCategories();
  
  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;
  
  return (
    <div>
      {categories.map(category => (
        <div key={category.id}>
          {category.icon} {category.name} ({category.annonceCount})
        </div>
      ))}
    </div>
  );
}
```

### Appel direct à l'API
```typescript
const response = await fetch('/api/categories/top');
const categories = await response.json();
```

## Avantages

1. **Données en temps réel** : Les catégories reflètent la popularité actuelle
2. **Performance optimisée** : Requête SQL efficace avec agrégation
3. **Robustesse** : Système de fallback en cas d'erreur
4. **Maintenabilité** : Code modulaire avec types TypeScript
5. **Expérience utilisateur** : États de chargement et gestion d'erreurs
6. **Administration** : Interface de monitoring et statistiques

## Évolutions futures

1. **Cache Redis** : Mise en cache des résultats pour améliorer les performances
2. **Mise à jour en temps réel** : WebSockets pour les mises à jour live
3. **Personnalisation** : Permettre aux utilisateurs de personnaliser l'ordre
4. **Analytics** : Tracking des clics sur les catégories
5. **A/B Testing** : Tester différents ordres de catégories
6. **Internationalisation** : Support multi-langue pour les catégories

## Monitoring

### Métriques à surveiller
- Temps de réponse de l'API `/api/categories/top`
- Taux d'erreur et utilisation du fallback
- Popularité des catégories dans le temps
- Performance des requêtes SQL

### Logs
Les erreurs sont automatiquement loggées dans la console avec le contexte approprié.

## Dépannage

### Problèmes courants

1. **Catégories vides** : Vérifier que les catégories sont en base avec `node scripts/setup-categories.js`
2. **Erreurs Prisma** : Régénérer le client avec `npx prisma generate`
3. **Données statiques affichées** : Vérifier les logs pour identifier l'erreur de base de données
4. **Performance lente** : Vérifier les index sur les tables `Category` et `Annonce`

### Debug
Activer les logs Prisma en développement dans `src/lib/prisma.ts` :
```typescript
log: ['query', 'error', 'warn']
``` 