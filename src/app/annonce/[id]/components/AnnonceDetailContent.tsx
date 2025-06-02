'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Phone, 
  Mail, 
  MessageCircle, 
  MapPin, 
  Calendar, 
  Eye, 
  Share2,
  Flag,
  User,
  Star,
  Clock,
  Shield,
  CheckCircle,
  Package,
  ChevronLeft,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';
import BookmarkButton from '@/components/ui/BookmarkButton';
import { getCategoryById, getSubcategoryById } from '@/lib/categories';

interface User {
  id: number;
  name: string;
  picture: string;
  mobile: string;
  email?: string;
  bio?: string;
  location?: string;
  profession?: string;
  company?: string;
  website?: string;
  accountType: string;
  showPhone: boolean;
  showEmail: boolean;
  isVerified: boolean;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  totalViews: number;
  totalListings: number;
  successfulSales: number;
  createdAt: string;
}

interface AdditionalFields {
  [key: string]: string | number | boolean;
}

interface Annonce {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  picture: string;
  gallery: string[];
  category: string;
  subcategory: string;
  condition: string;
  additionalFields?: AdditionalFields;
  status: string;
  createdAt: string;
  updatedAt: string;
  user: User;
}

interface AnnonceDetailContentProps {
  annonceId: string;
}

// Fonctions de traduction
const translateCategory = (category: string): string => {
  const translations: { [key: string]: string } = {
    'electronics': 'Électronique',
    'computers': 'Ordinateurs',
    'phones': 'Téléphones',
    'tablets': 'Tablettes',
    'gaming': 'Jeux vidéo',
    'audio': 'Audio & Hi-Fi',
    'photo': 'Photo & Vidéo',
    'tv': 'TV & Cinéma',
    'accessories': 'Accessoires',
    'vehicles': 'Véhicules',
    'cars': 'Voitures',
    'motorcycles': 'Motos',
    'bicycles': 'Vélos',
    'trucks': 'Camions',
    'boats': 'Bateaux',
    'parts': 'Pièces & Accessoires',
    'real-estate': 'Immobilier',
    'apartments': 'Appartements',
    'houses': 'Maisons',
    'commercial': 'Commercial',
    'land': 'Terrains',
    'rentals': 'Locations',
    'fashion': 'Mode',
    'clothing': 'Vêtements',
    'shoes': 'Chaussures',
    'bags': 'Sacs',
    'jewelry': 'Bijoux',
    'watches': 'Montres',
    'beauty': 'Beauté',
    'home': 'Maison & Jardin',
    'furniture': 'Meubles',
    'appliances': 'Électroménager',
    'decoration': 'Décoration',
    'garden': 'Jardin',
    'tools': 'Outils',
    'sports': 'Sports & Loisirs',
    'fitness': 'Fitness',
    'outdoor': 'Plein air',
    'music': 'Musique',
    'books': 'Livres',
    'movies': 'Films',
    'art': 'Art & Collection',
    'jobs': 'Emplois',
    'services': 'Services',
    'education': 'Éducation',
    'health': 'Santé',
    'animals': 'Animaux',
    'pets': 'Animaux de compagnie',
    'livestock': 'Bétail',
    'pet-supplies': 'Accessoires pour animaux',
    'other': 'Autres'
  };
  
  return translations[category.toLowerCase()] || category;
};

const translateCondition = (condition: string): string => {
  const translations: { [key: string]: string } = {
    'new': 'Neuf',
    'like-new': 'Comme neuf',
    'very-good': 'Très bon état',
    'good': 'Bon état',
    'fair': 'État correct',
    'poor': 'Mauvais état',
    'used': 'Occasion',
    'refurbished': 'Reconditionné',
    'damaged': 'Endommagé',
    'for-parts': 'Pour pièces'
  };
  
  return translations[condition.toLowerCase()] || condition;
};

const translateStatus = (status: string): string => {
  const translations: { [key: string]: string } = {
    'active': 'Disponible',
    'sold': 'Vendu',
    'pending': 'En attente',
    'expired': 'Expiré',
    'suspended': 'Suspendu',
    'draft': 'Brouillon'
  };
  
  return translations[status.toLowerCase()] || status;
};

const translateFieldName = (fieldName: string): string => {
  const translations: { [key: string]: string } = {
    'brand': 'Marque',
    'model': 'Modèle',
    'year': 'Année',
    'color': 'Couleur',
    'size': 'Taille',
    'weight': 'Poids',
    'material': 'Matériau',
    'storage': 'Stockage',
    'memory': 'Mémoire',
    'processor': 'Processeur',
    'screen': 'Écran',
    'battery': 'Batterie',
    'connectivity': 'Connectivité',
    'warranty': 'Garantie',
    'mileage': 'Kilométrage',
    'fuel': 'Carburant',
    'transmission': 'Transmission',
    'doors': 'Portes',
    'seats': 'Places',
    'engine': 'Moteur',
    'power': 'Puissance',
    'rooms': 'Pièces',
    'bedrooms': 'Chambres',
    'bathrooms': 'Salles de bain',
    'area': 'Surface',
    'floor': 'Étage',
    'parking': 'Parking',
    'furnished': 'Meublé',
    'balcony': 'Balcon',
    'garden': 'Jardin',
    'price': 'Prix',
    'negotiable': 'Négociable',
    'shipping': 'Livraison',
    'pickup': 'Retrait'
  };
  
  // Transformer camelCase en mots séparés et traduire
  const readable = fieldName.replace(/([A-Z])/g, ' $1').toLowerCase().trim();
  
  return translations[readable] || translations[fieldName.toLowerCase()] || 
         fieldName.charAt(0).toUpperCase() + fieldName.slice(1).replace(/([A-Z])/g, ' $1');
};

export default function AnnonceDetailContent({ annonceId }: AnnonceDetailContentProps) {
  const router = useRouter();
  const [annonce, setAnnonce] = useState<Annonce | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [similarAnnonces, setSimilarAnnonces] = useState<Annonce[]>([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);

  const fetchAnnonce = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/annonces/${annonceId}`);
      
      if (response.ok) {
        const data = await response.json();
        setAnnonce(data);
        // Charger les annonces similaires après avoir chargé l'annonce principale
        fetchSimilarAnnonces(data);
      } else if (response.status === 404) {
        toast.error('Annonce non trouvée');
        router.push('/');
      } else {
        toast.error('Erreur lors du chargement de l\'annonce');
      }
    } catch (_error) {
      console.error('Erreur:', _error);
      toast.error('Erreur de connexion au serveur');
    } finally {
      setIsLoading(false);
    }
  }, [annonceId, router]);

  const fetchSimilarAnnonces = useCallback(async (currentAnnonce: Annonce) => {
    try {
      setLoadingSimilar(true);
      // Construire l'URL de recherche pour les annonces similaires
      const searchParams = new URLSearchParams({
        category: currentAnnonce.category
      });

      const response = await fetch(`/api/annonces?${searchParams.toString()}`);
      
      if (response.ok) {
        const data = await response.json();
        // Filtrer les annonces pour exclure l'annonce actuelle et limiter à 3
        const filteredAnnonces = data
          .filter((annonce: Annonce) => annonce.id !== currentAnnonce.id)
          .slice(0, 3);
        setSimilarAnnonces(filteredAnnonces);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des annonces similaires:', error);
    } finally {
      setLoadingSimilar(false);
    }
  }, []);

  useEffect(() => {
    fetchAnnonce();
  }, [fetchAnnonce]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: annonce?.title,
        text: annonce?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Lien copié dans le presse-papiers');
    }
  };

  const handleContact = (type: 'phone' | 'whatsapp' | 'email') => {
    if (!annonce) return;
    
    if (type === 'phone') {
      window.location.href = `tel:${annonce.user.mobile}`;
    } else if (type === 'whatsapp') {
      window.open(`https://wa.me/${annonce.user.mobile.replace('+', '')}?text=Bonjour, je suis intéressé par votre annonce: ${annonce.title}`, '_blank');
    } else if (type === 'email' && annonce.user.email) {
      window.location.href = `mailto:${annonce.user.email}?subject=Intérêt pour votre annonce: ${annonce.title}`;
    }
  };

  const reportAd = () => {
    toast.success('Annonce signalée. Merci pour votre vigilance.');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Aujourd\'hui';
    if (diffDays === 2) return 'Hier';
    if (diffDays <= 7) return `Il y a ${diffDays} jours`;
    return date.toLocaleDateString('fr-FR');
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="aspect-[4/3] bg-gray-200 animate-pulse"></div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="h-10 w-1/3 bg-gray-200 rounded animate-pulse mb-6"></div>
              <div className="space-y-3">
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-4/6 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse mr-4"></div>
                <div className="flex-1">
                  <div className="h-5 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-12 w-full bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-12 w-full bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!annonce) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-12 h-12 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Annonce non trouvée</h1>
          <p className="text-gray-600 mb-8">Cette annonce n'existe pas ou a été supprimée.</p>
          <Link 
            href="/" 
            className="inline-flex items-center px-6 py-3 bg-[#E00201] text-white rounded-lg hover:bg-[#CB0201] transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  const images = annonce.gallery && annonce.gallery.length > 0 ? annonce.gallery : [annonce.picture];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb Navigation */}
      <nav className="mb-6" aria-label="Breadcrumb">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-[#E00201] transition-colors">
            Accueil
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/annonces" className="hover:text-[#E00201] transition-colors">
            Annonces
          </Link>
          <ChevronRight className="w-4 h-4" />
          {(() => {
            const categoryData = getCategoryById(annonce.category);
            const categorySlug = categoryData?.slug || annonce.category;
            return (
              <Link href={`/categories/${categorySlug}`} className="hover:text-[#E00201] transition-colors">
                {translateCategory(annonce.category)}
              </Link>
            );
          })()}
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium truncate">{annonce.title}</span>
        </div>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="relative aspect-[4/3] bg-gray-100">
              <Image
                src={images[currentImageIndex] || '/images/placeholder.svg'}
                alt={annonce.title}
                fill
                className="object-cover"
                priority
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/placeholder.svg';
                }}
              />
              
              {/* Image Counter */}
              {images.length > 1 && (
                <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {currentImageIndex + 1} / {images.length}
                </div>
              )}
              
              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImageIndex(currentImageIndex > 0 ? currentImageIndex - 1 : images.length - 1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all hover:scale-105"
                    aria-label="Image précédente"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex(currentImageIndex < images.length - 1 ? currentImageIndex + 1 : 0)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all hover:scale-105"
                    aria-label="Image suivante"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Action Buttons Overlay */}
              <div className="absolute top-4 left-4 flex space-x-2">
                <BookmarkButton
                  annonceId={annonce.id}
                  annonceData={{
                    id: annonce.id,
                    title: annonce.title,
                    description: annonce.description,
                    price: annonce.price,
                    location: annonce.location,
                    picture: annonce.picture,
                    gallery: annonce.gallery,
                    createdAt: annonce.createdAt,
                    status: annonce.status,
                    category: annonce.category,
                    subcategory: annonce.subcategory,
                    condition: annonce.condition,
                    user: {
                      id: annonce.user.id,
                      name: annonce.user.name,
                      picture: annonce.user.picture,
                      mobile: annonce.user.mobile,
                      showPhone: annonce.user.showPhone,
                      isVerified: annonce.user.isVerified
                    }
                  }}
                  size="md"
                  variant="default"
                />
                
                <button
                  onClick={handleShare}
                  className="p-3 rounded-full bg-white/90 text-gray-700 hover:bg-white shadow-lg transition-all hover:scale-105"
                  aria-label="Partager l'annonce"
                >
                  <Share2 className="w-5 h-5" />
                </button>

                <button
                  onClick={reportAd}
                  className="p-3 rounded-full bg-white/90 text-gray-700 hover:bg-white shadow-lg transition-all hover:scale-105"
                  aria-label="Signaler l'annonce"
                >
                  <Flag className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="p-4 bg-gray-50">
                <div className="flex space-x-2 overflow-x-auto">
                  {images.map((image: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                        currentImageIndex === index 
                          ? 'border-[#E00201] ring-2 ring-red-200' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Image
                        src={image || '/images/placeholder.svg'}
                        alt={`${annonce.title} ${index + 1}`}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/placeholder.svg';
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="mb-6">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                {annonce.title}
              </h1>
              
              <div className="flex items-center justify-between mb-6">
                <div className="text-3xl lg:text-4xl font-bold text-[#E00201]">
                  {annonce.price.toLocaleString('fr-FR')} FCFA
                </div>
                <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                  annonce.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : annonce.status === 'sold'
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {translateStatus(annonce.status)}
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-[#E00201]" />
                  <span>{annonce.location}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-[#E00201]" />
                  <span>Publié {formatDate(annonce.createdAt)}</span>
                </div>
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-2 text-[#E00201]" />
                  <span>1,234 vues</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{annonce.description}</p>
              </div>
            </div>

            {/* Characteristics */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Caractéristiques</h2>
              <div className="space-y-0 bg-white rounded-lg overflow-hidden">
                {(() => {
                  const characteristics = [];
                  let index = 0;
                  
                  if (annonce.category) {
                    // Trouver la catégorie par ID pour obtenir le slug
                    const categoryData = getCategoryById(annonce.category);
                    const categorySlug = categoryData?.slug || annonce.category;
                    
                    characteristics.push(
                      <div key="category" className={`flex justify-between py-3 px-4 border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <span className="text-gray-600 font-medium">Catégorie</span>
                        <Link 
                          href={`/categories/${categorySlug}`}
                          className="font-semibold text-[#E00201] hover:text-[#CB0201] transition-colors cursor-pointer"
                        >
                          {translateCategory(annonce.category)}
                        </Link>
                      </div>
                    );
                    index++;
                  }
                  
                  if (annonce.subcategory) {
                    // Trouver la catégorie et sous-catégorie par ID pour obtenir les slugs
                    const categoryData = getCategoryById(annonce.category);
                    const subcategoryData = getSubcategoryById(annonce.category, annonce.subcategory);
                    const categorySlug = categoryData?.slug || annonce.category;
                    const subcategorySlug = subcategoryData?.slug || annonce.subcategory;
                    
                    characteristics.push(
                      <div key="subcategory" className={`flex justify-between py-3 px-4 border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <span className="text-gray-600 font-medium">Sous-catégorie</span>
                        <Link 
                          href={`/categories/${categorySlug}?subcategory=${subcategorySlug}`}
                          className="font-semibold text-[#E00201] hover:text-[#CB0201] transition-colors cursor-pointer"
                        >
                          {translateCategory(annonce.subcategory)}
                        </Link>
                      </div>
                    );
                    index++;
                  }
                  
                  if (annonce.condition) {
                    characteristics.push(
                      <div key="condition" className={`flex justify-between py-3 px-4 border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <span className="text-gray-600 font-medium">État</span>
                        <span className="font-semibold text-gray-900">{translateCondition(annonce.condition)}</span>
                      </div>
                    );
                    index++;
                  }
                  
                  if (annonce.additionalFields && Object.keys(annonce.additionalFields).length > 0) {
                    Object.entries(annonce.additionalFields).forEach(([key, value]) => {
                      characteristics.push(
                        <div key={key} className={`flex justify-between py-3 px-4 border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                          <span className="text-gray-600 font-medium capitalize">{translateFieldName(key)}</span>
                          <span className="font-semibold text-gray-900">{String(value)}</span>
                        </div>
                      );
                      index++;
                    });
                  }
                  
                  return characteristics;
                })()}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Seller Profile */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center mb-6">
              <div className="relative w-16 h-16 mr-4">
                {annonce.user.picture ? (
                  <Image
                    src={annonce.user.picture}
                    alt={annonce.user.name}
                    fill
                    className="object-cover rounded-full"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#E00201] to-[#CB0201] rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold text-white">
                      {annonce.user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                
                {/* Verification Badges */}
                {(annonce.user.isVerified || annonce.user.isPhoneVerified) && (
                  <div className="absolute -bottom-1 -right-1 flex space-x-1">
                    {annonce.user.isVerified && (
                      <div className="bg-[#E00201] rounded-full p-1">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{annonce.user.name}</h3>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
                  <span className="font-medium">4.8</span>
                  <span className="mx-1">•</span>
                  <span>{annonce.user.totalListings} annonces</span>
                </div>
                <div className="text-xs text-gray-500">
                  <div className="flex items-center mb-1">
                    <Clock className="w-3 h-3 mr-1" />
                    Actif il y a 2 heures
                  </div>
                  <div>Répond généralement en 1 heure</div>
                </div>
              </div>
            </div>

            {/* Contact Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => handleContact('whatsapp')}
                className="w-full bg-[#E00201] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#CB0201] transition-colors flex items-center justify-center"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Contacter par WhatsApp
              </button>
              
              {annonce.user.showPhone && (
                <button
                  onClick={() => handleContact('phone')}
                  className="w-full border border-[#E00201] text-[#E00201] py-3 px-4 rounded-lg font-medium hover:bg-red-50 transition-colors flex items-center justify-center"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Appeler
                </button>
              )}

              {annonce.user.showEmail && annonce.user.email && (
                <button
                  onClick={() => handleContact('email')}
                  className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Envoyer un email
                </button>
              )}
            </div>

            {/* Security Info */}
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start">
                <Shield className="w-5 h-5 text-[#E00201] mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-red-800 mb-2">Conseils de sécurité</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Rencontrez le vendeur en personne</li>
                    <li>• Vérifiez l'article avant le paiement</li>
                    <li>• Évitez les virements à l'avance</li>
                  </ul>
                  <Link 
                    href="/help/security" 
                    className="text-sm text-[#E00201] hover:text-[#CB0201] font-medium mt-2 inline-flex items-center"
                  >
                    En savoir plus
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-[#E00201]" />
              Localisation et remise
            </h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Remise en main propre</h4>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  À {annonce.location}
                </div>
                <p className="text-sm text-gray-600">
                  Rencontrez le vendeur pour vérifier l'article avant l'achat.
                </p>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-2">Livraison possible</h4>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-1" />
                    À convenir avec le vendeur
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Frais de livraison à négocier directement.
                </p>
              </div>
            </div>
          </div>

          {/* Similar Ads */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Annonces similaires</h3>
            
            {loadingSimilar ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0 animate-pulse"></div>
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : similarAnnonces.length > 0 ? (
              <div className="space-y-3">
                {similarAnnonces.map((similarAnnonce) => (
                  <Link 
                    key={similarAnnonce.id} 
                    href={`/annonce/${similarAnnonce.id}`} 
                    className="block p-3 border border-gray-200 rounded-lg hover:border-red-300 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                        <Image
                          src={similarAnnonce.picture || '/images/placeholder.svg'}
                          alt={similarAnnonce.title}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/images/placeholder.svg';
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate" title={similarAnnonce.title}>
                          {similarAnnonce.title}
                        </p>
                        <p className="text-sm text-[#E00201] font-semibold">
                          {similarAnnonce.price.toLocaleString('fr-FR')} FCFA
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {similarAnnonce.location}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">Aucune annonce similaire trouvée</p>
              </div>
            )}
            
            {(() => {
              const categoryData = getCategoryById(annonce.category);
              const categorySlug = categoryData?.slug || annonce.category;
              const subcategoryData = getSubcategoryById(annonce.category, annonce.subcategory);
              const subcategorySlug = subcategoryData?.slug;
              
              const linkHref = subcategorySlug 
                ? `/categories/${categorySlug}?subcategory=${subcategorySlug}`
                : `/categories/${categorySlug}`;
              
              return (
                <Link 
                  href={linkHref}
                  className="block mt-4 text-center text-sm text-[#E00201] hover:text-[#CB0201] font-medium"
                >
                  Voir plus d'annonces similaires
                </Link>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
} 