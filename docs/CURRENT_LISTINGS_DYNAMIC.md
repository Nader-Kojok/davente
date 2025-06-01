# Section "En ce moment sur Grabi" dynamique

## Vue d'ensemble

La section "En ce moment sur Grabi" a été rendue dynamique et utilise maintenant la base de données pour afficher les annonces les plus récentes d'une catégorie spécifique (par défaut : Électronique).

## Architecture

### 1. API Route (`/api/annonces/recent`)

**Fichier**: `src/app/api/annonces/recent/route.ts`

L'API utilise une requête SQL brute pour optimiser les performances :

```sql
SELECT 
  a.id,
  a.title,
  a.price,
  a.picture,
  a.location,
  a."createdAt" as created_at,
  u.id as user_id,
  u.name as user_name,
  u.picture as user_picture,
  c.id as category_id,
  c.name as category_name,
  c.slug as category_slug,
  s.id as subcategory_id,
  s.name as subcategory_name,
  s.slug as subcategory_slug
FROM "Annonce" a
INNER JOIN "User" u ON a."userId" = u.id
LEFT JOIN "Category" c ON a."categoryId" = c.id
LEFT JOIN "Subcategory" s ON a."subcategoryId" = s.id
WHERE a.status = 'active'
ORDER BY a."createdAt" DESC
LIMIT 8
```

**Paramètres supportés** :
- `limit` : Nombre d'annonces à récupérer (défaut: 8)
- `categoryId` : ID de la catégorie à filtrer (optionnel)

**Fonctionnalités** :
- Récupère les annonces les plus récentes
- Filtre uniquement les annonces actives
- Inclut les informations utilisateur et catégorie
- Système de fallback vers des données simulées
- Gestion d'erreurs robuste

### 2. Hook personnalisé (`useRecentListings`)

**Fichier**: `src/hooks/useRecentListings.ts`

Hook React qui gère :
- Le chargement des données depuis l'API
- La gestion des états de chargement et d'erreur
- Le filtrage par catégorie
- La fonction de rechargement des données

**Options disponibles** :
```typescript
interface UseRecentListingsOptions {
  limit?: number;        // Nombre d'annonces à récupérer
  categoryId?: number;   // ID de la catégorie à filtrer
}
```

### 3. Types TypeScript

**Fichier**: `src/types/category.ts`

Interface `RecentListing` pour assurer la cohérence :
```typescript
interface RecentListing {
  id: number;
  title: string;
  price: number;
  picture: string;
  location: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
    picture: string;
  };
  category: {
    id: number;
    name: string;
    slug: string;
  } | null;
  subcategory: {
    id: number;
    name: string;
    slug: string;
  } | null;
}
```

### 4. Composant mis à jour

**Fichier**: `src/components/CurrentListings.tsx`

Améliorations apportées :
- Utilisation des données dynamiques de la base de données
- Affichage des vraies informations utilisateur
- États de chargement avec skeleton loading
- Gestion d'erreurs avec message utilisateur
- Liens vers les vraies annonces
- Affichage des sous-catégories

## Fonctionnalités

### Données dynamiques
- Les annonces sont triées par date de création (plus récentes en premier)
- Filtrage par catégorie (par défaut : Électronique, ID 3)
- Mise à jour en temps réel basée sur les nouvelles annonces
- Fallback automatique vers les données simulées en cas d'erreur

### Interface utilisateur
- **Skeleton loading** : Animation de chargement pendant la récupération des données
- **Informations utilisateur** : Affichage du nom et avatar du vendeur
- **Images d'annonces** : Affichage des vraies images ou fallback vers Picsum
- **Navigation** : Liens directs vers les annonces individuelles
- **Sous-catégories** : Affichage des sous-catégories comme tags

### Performance
- Requête SQL optimisée avec JOIN pour récupérer toutes les données en une fois
- Limitation configurable du nombre d'annonces
- Cache côté client via le hook React
- Images optimisées avec Next.js Image

## Page d'administration

**Fichier**: `src/app/admin/annonces/page.tsx`

Une page d'administration a été créée pour :
- Visualiser les annonces récentes avec détails complets
- Filtrer par catégorie
- Afficher les statistiques (total, valeur, prix moyen, vendeurs uniques)
- Monitorer la répartition par catégorie
- Accéder directement aux annonces et profils utilisateur

**URL d'accès** : `/admin/annonces`

### Fonctionnalités de la page admin
- **Filtres** : Sélection par catégorie
- **Statistiques globales** : Métriques importantes
- **Tableau détaillé** : Liste complète avec images et informations
- **Graphiques** : Visualisation de la répartition par catégorie
- **Actions** : Liens vers annonces et profils

## Installation et configuration

### 1. Base de données
Les annonces doivent être présentes en base de données avec les relations appropriées :

```bash
# S'assurer que les tables sont créées
npx prisma db push
```

### 2. Types Prisma
S'assurer que le client Prisma est généré :

```bash
npx prisma generate
```

### 3. Variables d'environnement
Vérifier que `DATABASE_URL` est configurée dans `.env.local`

## Utilisation

### Dans un composant
```typescript
import { useRecentListings } from '@/hooks/useRecentListings';

function MyComponent() {
  const { listings, isLoading, error, refetch } = useRecentListings({
    limit: 10,
    categoryId: 3 // Électronique
  });
  
  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;
  
  return (
    <div>
      {listings.map(listing => (
        <div key={listing.id}>
          <h3>{listing.title}</h3>
          <p>{listing.price.toLocaleString()} F</p>
          <p>Par {listing.user.name}</p>
        </div>
      ))}
    </div>
  );
}
```

### Appel direct à l'API
```typescript
// Récupérer toutes les annonces récentes
const response = await fetch('/api/annonces/recent');
const listings = await response.json();

// Récupérer les annonces d'une catégorie spécifique
const response = await fetch('/api/annonces/recent?categoryId=3&limit=5');
const listings = await response.json();
```

## Avantages

1. **Données en temps réel** : Les annonces reflètent les publications récentes
2. **Performance optimisée** : Requête SQL efficace avec JOIN
3. **Robustesse** : Système de fallback en cas d'erreur
4. **Maintenabilité** : Code modulaire avec types TypeScript
5. **Expérience utilisateur** : États de chargement et gestion d'erreurs
6. **Administration** : Interface de monitoring et statistiques
7. **Flexibilité** : Filtrage par catégorie configurable

## Évolutions futures

1. **Cache Redis** : Mise en cache des résultats pour améliorer les performances
2. **Pagination** : Support de la pagination pour les grandes listes
3. **Filtres avancés** : Filtrage par prix, localisation, date
4. **Recommandations** : Algorithme de recommandation personnalisée
5. **Temps réel** : WebSockets pour les mises à jour live
6. **Analytics** : Tracking des vues et interactions
7. **A/B Testing** : Tester différents algorithmes de tri

## Monitoring

### Métriques à surveiller
- Temps de réponse de l'API `/api/annonces/recent`
- Taux d'erreur et utilisation du fallback
- Nombre d'annonces récentes par catégorie
- Performance des requêtes SQL
- Taux de clics sur les annonces

### Logs
Les erreurs sont automatiquement loggées dans la console avec le contexte approprié.

## Dépannage

### Problèmes courants

1. **Aucune annonce affichée** : Vérifier qu'il y a des annonces actives en base
2. **Erreurs Prisma** : Régénérer le client avec `npx prisma generate`
3. **Données simulées affichées** : Vérifier les logs pour identifier l'erreur de base de données
4. **Performance lente** : Vérifier les index sur les tables `Annonce`, `User`, `Category`
5. **Images manquantes** : Vérifier les URLs des images ou utiliser les fallbacks

### Debug
Activer les logs Prisma en développement dans `src/lib/prisma.ts` :
```typescript
log: ['query', 'error', 'warn']
```

## Intégration avec les autres sections

La section "En ce moment sur Grabi" s'intègre parfaitement avec :
- **Top catégories** : Utilise les mêmes catégories
- **Recherche** : Peut être filtrée par les résultats de recherche
- **Profils utilisateur** : Liens vers les profils des vendeurs
- **Pages d'annonces** : Navigation vers les détails des annonces 