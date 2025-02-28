'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ChevronRight, MapPin, Heart, Star, Share2, Flag } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/ui/Footer';

interface Specification {
  label: string;
  value: string;
}

interface Seller {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  memberSince: string;
  responseRate: string;
  responseTime: string;
  avatarUrl: string;
  badges: string[];
}

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  location: string;
  postedAt: string;
  condition: string;
  brand: string;
  model: string;
  deliveryOptions: string[];
  shippingCost: number;
  images: string[];
  seller: Seller;
  specifications: Specification[];
}

type MockListings = {
  [key: string]: Listing;
};

// Mock data for development - In a real app, this would come from an API or database
const mockListings: MockListings = {
  '1': {
    id: '1',
    title: 'Video projecteur EPSON NEUF H692B LCD projector',
    description: 'Projecteur LCD haute performance avec une résolution native Full HD (1920x1080). Luminosité de 3500 lumens et un contraste de 15000:1. Parfait pour home cinéma et présentations professionnelles.',
    price: 520,
    originalPrice: 699,
    location: 'Paris 75001 1er Arrondissement',
    postedAt: '2024-02-26T10:00:00Z',
    condition: 'Neuf',
    brand: 'EPSON',
    model: 'H692B',
    deliveryOptions: ['Livraison à domicile', 'Retrait en point relais'],
    shippingCost: 15,
    images: [
      'https://picsum.photos/800/600?random=1',
      'https://picsum.photos/800/600?random=2',
      'https://picsum.photos/800/600?random=3',
      'https://picsum.photos/800/600?random=4',
    ],
    seller: {
      id: 'seller1',
      name: 'Sissibou',
      rating: 4.8,
      reviewCount: 156,
      memberSince: '2023',
      responseRate: '98%',
      responseTime: '< 1h',
      avatarUrl: 'https://i.pravatar.cc/150?img=1',
      badges: ['pro', 'verified'],
    },
    specifications: [
      { label: 'Marque', value: 'EPSON' },
      { label: 'Modèle', value: 'H692B' },
      { label: 'État', value: 'Neuf' },
      { label: 'Résolution', value: '1920x1080 (Full HD)' },
      { label: 'Luminosité', value: '3500 lumens' },
      { label: 'Contraste', value: '15000:1' },
    ],
  },
};

export default function ListingDetailPage() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const fetchListing = async () => {
      setIsLoading(true);
      try {
        // Simulate API call with mock data
        const id = params.id as string;
        const data = mockListings[id];
        
        if (!data) {
          router.push('/404');
          return;
        }

        setListing(data);
      } catch (error) {
        console.error('Error fetching listing:', error);
        router.push('/404');
      } finally {
        setIsLoading(false);
      }
    };

    fetchListing();
  }, [params.id, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-gray-50 py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="aspect-4/3 bg-gray-200 rounded-lg"></div>
                  <div className="flex space-x-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                    ))}
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!listing) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-gray-900">Accueil</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link href="/annonces" className="hover:text-gray-900">Annonces</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-gray-900">Projecteur</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Images */}
            <div className="space-y-4">
              <div className="relative aspect-4/3 rounded-lg overflow-hidden bg-gray-200">
                <Image
                  src={listing.images[selectedImage]}
                  alt={listing.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex space-x-4 overflow-x-auto pb-2">
                {listing.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 ${selectedImage === index ? 'ring-2 ring-[#EC5A12]' : 'ring-1 ring-gray-200'}`}
                  >
                    <Image
                      src={image}
                      alt={`${listing.title} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="space-y-6">
              {/* Title and Price */}
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-4">{listing.title}</h1>
                <div className="flex items-baseline space-x-3">
                  <span className="text-3xl font-bold text-gray-900">{listing.price.toLocaleString()} €</span>
                  {listing.originalPrice && (
                    <span className="text-lg text-gray-500 line-through">{listing.originalPrice.toLocaleString()} €</span>
                  )}
                </div>
              </div>

              {/* Seller Info */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={listing.seller.avatarUrl}
                      alt={listing.seller.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{listing.seller.name}</h3>
                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                      <span>{listing.seller.rating}</span>
                      <span className="mx-1">•</span>
                      <span>{listing.seller.reviewCount} avis</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="flex-1 bg-[#EC5A12] text-white px-4 py-2 rounded-lg hover:bg-[#d94e0a] transition-colors duration-200">
                    Contacter
                  </button>
                  <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200">
                    <Heart className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200">
                    <Share2 className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200">
                    <Flag className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Location and Delivery */}
              <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{listing.location}</span>
                </div>
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Options de livraison</h4>
                  <ul className="space-y-2">
                    {listing.deliveryOptions.map((option: string, index: number) => (
                      <li key={index} className="text-gray-600">{option}</li>
                    ))}
                  </ul>
                  <p className="text-sm text-gray-500 mt-2">Frais de livraison: {listing.shippingCost} €</p>
                </div>
              </div>
            </div>
          </div>

          {/* Description and Specifications */}
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
                <p className="text-gray-600 whitespace-pre-line">{listing.description}</p>
              </div>

              {/* Specifications */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Caractéristiques</h2>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                  {listing.specifications.map((spec: Specification, index: number) => (
                    <div key={index} className="flex justify-between py-2 border-b border-gray-100">
                      <dt className="text-gray-500">{spec.label}</dt>
                      <dd className="text-gray-900 font-medium">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            {/* Seller Details */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 h-fit">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">À propos du vendeur</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Membre depuis</span>
                  <span className="text-gray-900">{listing.seller.memberSince}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Taux de réponse</span>
                  <span className="text-gray-900">{listing.seller.responseRate}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Délai de réponse</span>
                  <span className="text-gray-900">{listing.seller.responseTime}</span>
                </div>
                <div className="pt-4 border-t">
                  <button className="w-full bg-gray-100 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200">
                    Voir le profil
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}