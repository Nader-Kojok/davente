# Structure des Catégories - Davente

## Vue d'ensemble

Les catégories ont été restructurées pour une meilleure gestion et cohérence des données. Au lieu d'utiliser des chaînes de caractères simples, nous utilisons maintenant une structure relationnelle avec des tables dédiées.

## Structure de la base de données

### Modèle Category
```prisma
model Category {
  id            Int           @id @default(autoincrement())
  name          String        @unique
  slug          String        @unique
  icon          String
  description   String?
  isActive      Boolean       @default(true)
  sortOrder     Int           @default(0)
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  subcategories Subcategory[]
  annonces      Annonce[]
}
```

### Modèle Subcategory
```prisma
model Subcategory {
  id          Int      @id @default(autoincrement())
  name        String
  slug        String
  description String?
  isActive    Boolean  @default(true)
  sortOrder   Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  categoryId  Int
  category    Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  annonces    Annonce[]

  @@unique([categoryId, slug])
}
```

### Modèle Annonce (mis à jour)
```prisma
model Annonce {
  // ... autres champs
  categoryId       Int?
  subcategoryId    Int?
  category         Category?    @relation(fields: [categoryId], references: [id])
  subcategory      Subcategory? @relation(fields: [subcategoryId], references: [id])
  
  // Champs de migration (temporaires)
  oldCategory      String?
  oldSubcategory   String?
}
```

## Catégories disponibles

### 1. Véhicules (🚗)
- Voitures
- Motos
- Camions
- Bateaux
- Caravaning
- Utilitaires
- Nautisme

### 2. Immobilier (🏠)
- Appartements
- Maisons
- Terrains
- Locaux commerciaux
- Colocations
- Bureaux & Commerces

### 3. Électronique (📱)
- Téléphones & Objets connectés
- Ordinateurs
- Accessoires informatiques
- Photo & vidéo

### 4. Mode (👕)
- Vêtements
- Chaussures
- Accessoires
- Montres & Bijoux

### 5. Maison & Jardin (🏡)
- Ameublement
- Appareils électroménagers
- Décoration
- Plantes & jardin
- Bricolage

### 6. Services (🛠️)
- Services aux entreprises
- Services à la personne
- Événements
- Artisans & Musiciens
- Baby-Sitting
- Cours particuliers

### 7. Emploi (💼)
- Offres d'emploi
- Formations professionnelles

### 8. Locations de vacances (🏖️)
- Locations saisonnières
- Ventes flash vacances
- Locations Europe

### 9. Famille (👶)
- Équipement bébé
- Mobilier enfant
- Jouets

### 10. Loisirs (🎮)
- CD - Musique
- DVD - Films
- Livres
- Jeux & Jouets
- Sport & Plein Air

### 11. Matériel professionnel (🚜)
- Tracteurs
- BTP - Chantier
- Matériel agricole
- Équipements pros

### 12. Autre (📦)
- Divers
- Non catégorisé

## Service centralisé

Le fichier `src/lib/categories.ts` contient :

### Interfaces TypeScript
```typescript
export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description?: string;
  sortOrder: number;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  sortOrder: number;
}
```

### Fonctions utilitaires
- `getAllCategories()`: Retourne toutes les catégories
- `getCategoryById(id)`: Trouve une catégorie par ID
- `getCategoryBySlug(slug)`: Trouve une catégorie par slug
- `getSubcategoryById(categoryId, subcategoryId)`: Trouve une sous-catégorie
- `getSubcategoryBySlug(categorySlug, subcategorySlug)`: Trouve une sous-catégorie par slug
- `getCategoriesForDisplay()`: Format pour l'affichage dans les composants

## API

### GET /api/categories
Retourne toutes les catégories avec leurs sous-catégories :

```json
[
  {
    "id": "vehicles",
    "name": "Véhicules",
    "slug": "vehicules",
    "icon": "🚗",
    "description": "Voitures, motos, camions et autres véhicules",
    "sortOrder": 1,
    "subcategories": [
      {
        "id": "cars",
        "name": "Voitures",
        "slug": "voitures",
        "sortOrder": 1
      }
    ]
  }
]
```

## Migration

### Étapes de migration

1. **Sauvegarde des données existantes**
   ```bash
   node scripts/migrate-categories.js
   ```

2. **Application de la migration Prisma**
   ```bash
   npx prisma migrate dev --name add-categories-structure
   ```

3. **Génération du client Prisma**
   ```bash
   npx prisma generate
   ```

4. **Peuplement des nouvelles tables**
   ```bash
   npx prisma db seed
   ```

### Champs de migration temporaires

Les champs `oldCategory` et `oldSubcategory` dans le modèle `Annonce` permettent de conserver les anciennes valeurs pendant la transition.

## Utilisation dans les composants

### Exemple d'utilisation
```typescript
import { getAllCategories, getCategoryById } from '@/lib/categories';

// Dans un composant
const categories = getAllCategories();
const vehicleCategory = getCategoryById('vehicles');
```

### Composants mis à jour
- `CategorySelect.tsx`: Sélection de catégorie dans les formulaires
- `TopCategories.tsx`: Affichage des catégories populaires
- `TrendingCategories.tsx`: Catégories tendance
- `FilterBar.tsx`: Filtres par catégorie
- `Header.tsx`: Navigation par catégorie

## Avantages de la nouvelle structure

1. **Cohérence des données**: Une seule source de vérité
2. **Facilité de maintenance**: Modifications centralisées
3. **Extensibilité**: Ajout facile de nouvelles catégories
4. **Performance**: Relations optimisées en base
5. **Validation**: Contraintes de base de données
6. **Internationalisation**: Préparation pour le multi-langue
7. **Analytics**: Suivi précis par catégorie

## Prochaines étapes

1. Appliquer la migration en production
2. Supprimer les anciens champs après validation
3. Ajouter la gestion des catégories dans l'admin
4. Implémenter la recherche par catégorie optimisée
5. Ajouter des statistiques par catégorie 