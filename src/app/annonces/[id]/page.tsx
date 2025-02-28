'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, MapPin, Heart, Star, Share2, Flag, MessageCircle, ChevronLeft, Truck, ShieldCheck, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/ui/Footer';
import { ListingBadge } from '@/components/ui/ListingCard';

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number | 'Gratuit';
  location: string;
  postedAt: string;
  imageUrl: string;
  badges: ListingBadge[];
  isSponsored?: boolean;
  seller: {
    name: string;
    rating: number;
    reviewCount: number;
    avatarUrl: string;
  };
  condition: string;
  deliveryAvailable: boolean;
  // Additional fields for detail page
  images?: string[];
  category?: string;
  subcategory?: string;
  brand?: string;
  model?: string;
  year?: number;
  shippingCost?: number | 'Gratuit';
  returnPolicy?: string;
  paymentMethods?: string[];
  specifications?: Record<string, string>;
}

// Example data (in a real app, this would come from an API)
const listings: Record<string, Listing> = {
  '1': {
    id: '1',
    title: 'Video projecteur EPSON NEUF H692B LCD projector',
    description:
      'Vidéo projecteur EPSON NEUF H692B LCD projector en excellent état. Résolution native Full HD 1080p, luminosité de 3500 lumens, contraste 15000:1. Livré avec télécommande, câble HDMI et sacoche de transport. Idéal pour home cinéma ou présentations professionnelles.\n\nCaractéristiques techniques:\n- Technologie: 3LCD\n- Résolution native: 1920 x 1080 (Full HD)\n- Luminosité: 3500 ANSI lumens\n- Contraste: 15000:1\n- Durée de vie de la lampe: jusqu\'à 5000 heures (mode normal)\n- Connectique: 2x HDMI, VGA, USB, Audio in/out\n- Haut-parleur intégré: 10W\n- Correction keystone: Vertical ±30°, Horizontal ±30°\n- Poids: 2.8 kg\n\nAccessoires inclus:\n- Télécommande avec piles\n- Câble d\'alimentation\n- Câble HDMI\n- Manuel d\'utilisation\n- Sacoche de transport\n\nGarantie 6 mois.',
    price: 520,
    location: 'Paris 75001 1er Arrondissement',
    postedAt: 'il y a 2 jours',
    imageUrl: 'https://picsum.photos/800/600?random=1',
    badges: ['pro'],
    isSponsored: true,
    seller: {
      name: 'Sissibou',
      rating: 5,
      reviewCount: 5,
      avatarUrl: 'https://i.pravatar.cc/150?img=1',
    },
    condition: 'État neuf',
    deliveryAvailable: true,
    images: [
      'https://picsum.photos/800/600?random=1',
      'https://picsum.photos/800/600?random=2',
      'https://picsum.photos/800/600?random=3',
      'https://picsum.photos/800/600?random=4',
      'https://picsum.photos/800/600?random=5',
    ],
    category: 'Électronique',
    subcategory: 'Vidéoprojecteurs',
    brand: 'EPSON',
    model: 'H692B',
    year: 2023,
    shippingCost: 15,
    returnPolicy: 'Retours acceptés sous 14 jours',
    paymentMethods: ['Carte bancaire', 'PayPal', 'Virement bancaire'],
    specifications: {
      'Marque': 'EPSON',
      'Modèle': 'H692B',
      'Résolution': '1920 x 1080 (Full HD)',
      'Luminosité': '3500 ANSI lumens',
      'Contraste': '15000:1',
      'Connectique': '2x HDMI, VGA, USB, Audio in/out',
      'Poids': '2.8 kg',
      'Dimensions': '30 x 25 x 10 cm',
      'Garantie': '6 mois',
    },
  },
};

// Similar listings for the bottom section
const similarListings: Listing[] = [
  {
    id: '2',
    title: 'Vends vidéo projecteur laser UHD 4K',
    description: 'Vidéoprojecteur laser UHD 4K en excellent état',
    price: 1690,
    location: 'Schoelcher 97233',
    postedAt: 'il y a 3 heures',
    imageUrl: 'https://picsum.photos/400/300?random=2',
    badges: ['pro'],
    isSponsored: false,
    seller: {
      name: 'louloune',
      rating: 5,
      reviewCount: 4,
      avatarUrl: 'https://i.pravatar.cc/30?img=2',
    },
    condition: 'Très bon état',
    deliveryAvailable: false,
  },
  {
    id: '3',
    title: 'Vidéoprojecteur Philips NeoPix Ultra 2',
    description: 'Vidéoprojecteur Philips NeoPix Ultra 2 en parfait état',
    price: 350,
    location: 'Thiès',
    postedAt: 'il y a 1 jour',
    imageUrl: 'https://picsum.photos/400/300?random=3',
    badges: ['pro', 'urgent'],
    isSponsored: false,
    seller: {
      name: 'John Doe',
      rating: 4,
      reviewCount: 10,
      avatarUrl: 'https://i.pravatar.cc/30?img=3',
    },
    condition: 'Neuf',
    deliveryAvailable: true,
  },
  {
    id: '4',
    title: 'Mini projecteur portable LED HD',
    description: 'Mini projecteur portable LED HD compatible smartphone',
    price: 120,
    location: 'Dakar',
    postedAt: 'il y a 5 heures',
    imageUrl: 'https://picsum.photos/400/300?random=4',
    badges: ['delivery'],
    isSponsored: false,
    seller: {
      name: 'Jane Smith',
      rating: 4.5,
      reviewCount: 25,
      avatarUrl: 'https://i.pravatar.cc/30?img=4',
    },
    condition: 'Occasion',
    deliveryAvailable: false,
  },
];

// Image Gallery component
function ImageGallery({ images }: { images: string[] }) {
  const [mainImage, setMainImage] = useState(images[0]);

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
        <Image
          src={mainImage}
          alt="Product image"
          fill
          className="object-contain"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      {/* Thumbnails */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setMainImage(img)}
            className={`relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0 ${mainImage === img ? 'ring-2 ring-[#EC5A12]' : 'ring-1 ring-gray-200'}`}
          >
            <Image
              src={img}
              alt={`Thumbnail ${index + 1}`}
              fill
              className="object-cover"
              sizes="80px"
            />
          </button>
        ))}
        <button className="flex items-center justify-center w-20 h-20 bg-gray-100 rounded-md text-gray-500 hover:bg-gray-200 transition-colors flex-shrink-0">
          <span className="text-xs font-medium">Voir toutes les photos</span>
        </button>
      </div>
    </div>
  );
}

// Breadcrumb component
function Breadcrumb({ category, subcategory }: { category?: string; subcategory?: string }) {
  return (
    <nav className="flex text-sm text-gray-500 mb-4">
      <Link href="/" className="hover:text-[#EC5A12] transition-colors">
        Accueil
      </Link>
      <ChevronRight className="w-4 h-4 mx-1" />
      <Link href="/annonces" className="hover:text-[#EC5A12] transition-colors">
        Annonces
      </Link>
      {category && (
        <>
          <ChevronRight className="w-4 h-4 mx-1" />
          <Link href={`/categories/${category.toLowerCase()}`} className="hover:text-[#EC5A12] transition-colors">
            {category}
          </Link>
        </>
      )}
      {subcategory && (
        <>
          <ChevronRight className="w-4 h-4 mx-1" />
          <Link href={`/categories/${category?.toLowerCase()}/${subcategory.toLowerCase()}`} className="hover:text-[#EC5A12] transition-colors">
            {subcategory}
          </Link>
        </>
      )}
    </nav>
  );
}

// Seller Card component
function SellerCard({ seller }: { seller: Listing['seller'] }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center space-x-3 mb-4">
        <div className="relative w-12 h-12 rounded-full overflow-hidden">
          <Image
            src={seller.avatarUrl}
            alt={seller.name}
            fill
            className="object-cover"
            sizes="48px"
          />
        </div>
        <div>
          <h3 className="font-medium text-gray-900">{seller.name}</h3>
          <div className="flex items-center text-sm text-gray-600">
            <Star className="w-4 h-4 mr-1 text-yellow-500 fill-yellow-500" />
            <span>
              {seller.rating} ({seller.reviewCount} avis)
            </span>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <button className="w-full py-2 px-4 bg-[#EC5A12] text-white rounded-lg hover:bg-[#d94e0a] transition-colors font-medium">
          Contacter
        </button>
        <button className="w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center">
          <MessageCircle className="w-4 h-4 mr-2" />
          Chat
        </button>
        <div className="text-xs text-gray-500 text-center mt-2">
          Membre depuis janvier 2023
        </div>
      </div>
    </div>
  );
}
