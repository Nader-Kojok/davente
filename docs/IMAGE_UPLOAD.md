# Fonctionnalité de Téléchargement d'Images

## Vue d'ensemble

La fonctionnalité de téléchargement d'images permet aux utilisateurs de télécharger et gérer leurs avatars de profil.

## Composants

### ImageUpload Component

Le composant `ImageUpload` est un composant réutilisable qui gère :
- Sélection de fichiers image
- Validation des fichiers (type, taille)
- Aperçu en temps réel
- Téléchargement vers le serveur
- Suppression d'images

**Props :**
- `currentImage?: string` - URL de l'image actuelle
- `onImageChange: (imageUrl: string) => void` - Callback appelé lors du changement d'image
- `size?: 'sm' | 'md' | 'lg'` - Taille du composant
- `shape?: 'circle' | 'square'` - Forme du composant
- `disabled?: boolean` - État désactivé

### API Endpoints

#### POST /api/upload/image

Télécharge une image vers le serveur.

**Headers requis :**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Body :**
- `image`: File - Le fichier image à télécharger
- `type`: string - Type d'image ('avatar', 'listing', etc.)

**Validation :**
- Types acceptés : image/*
- Taille maximale : 5MB
- Authentification requise

**Réponse :**
```json
{
  "url": "/uploads/avatar/avatar_123_1234567890_abc123.jpg",
  "fileName": "avatar_123_1234567890_abc123.jpg",
  "size": 1024000,
  "type": "image/jpeg",
  "message": "Image téléchargée avec succès"
}
```

#### PATCH /api/user/profile

Met à jour le profil utilisateur, y compris l'avatar.

**Headers requis :**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body :**
```json
{
  "name": "Nom de l'utilisateur",
  "mobile": "+221771234567",
  "picture": "/uploads/avatar/avatar_123_1234567890_abc123.jpg"
}
```

## Structure des Fichiers

```
public/
├── uploads/
│   ├── avatar/
│   │   ├── .gitkeep
│   │   └── [fichiers téléchargés]
│   └── .gitignore
└── default-avatar.svg

src/
├── components/ui/
│   └── ImageUpload.tsx
├── app/api/
│   ├── upload/image/
│   │   └── route.ts
│   └── user/profile/
│       └── route.ts
└── app/profil/
    └── page.tsx
```

## Sécurité

### Validation des Fichiers
- Vérification du type MIME
- Limitation de la taille (5MB max)
- Génération de noms de fichiers uniques
- Authentification requise pour tous les uploads

### Stockage
- Les fichiers sont stockés dans `public/uploads/`
- Noms de fichiers générés : `{type}_{userId}_{timestamp}_{random}.{extension}`
- Les fichiers uploadés sont exclus du contrôle de version

## Utilisation

### Dans un composant React

```tsx
import ImageUpload from '@/components/ui/ImageUpload';

function ProfileForm() {
  const [avatar, setAvatar] = useState('');

  return (
    <ImageUpload
      currentImage={avatar}
      onImageChange={setAvatar}
      size="lg"
      shape="circle"
    />
  );
}
```

### Gestion des erreurs

Le composant gère automatiquement :
- Validation des fichiers
- Messages d'erreur via toast
- États de chargement
- Gestion des échecs de téléchargement

## Configuration

### Next.js

Assurez-vous que la configuration Next.js permet les images locales :

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  images: {
    domains: ['localhost'], // Ajoutez votre domaine de production
  }
};
```

### Variables d'environnement

```bash
# .env
JWT_SECRET=your-jwt-secret-key
DATABASE_URL=your-database-url
```

## Limitations

- Taille maximale : 5MB par fichier
- Types supportés : Tous les types d'images (image/*)
- Stockage local uniquement (pas de CDN intégré)
- Pas de redimensionnement automatique

## Améliorations futures

- Intégration avec un service de stockage cloud (AWS S3, Cloudinary)
- Redimensionnement automatique des images
- Support de plusieurs formats d'export
- Compression automatique
- Gestion des métadonnées EXIF 