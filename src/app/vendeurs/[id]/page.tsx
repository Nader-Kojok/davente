'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/ui/Footer';
import ListingCard from '@/components/ui/ListingCard';
import { Star, MapPin } from 'lucide-react';
import { ListingBadge } from '@/components/ui/ListingCard';

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  reviewer: {
    name: string;
    avatarUrl: string;
  };
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
  location: string;
  description: string;
  badges: string[];
  totalListings: number;
  reviews: Review[];
}

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number | 'Gratuit';
  location: string;
  postedAt: string;
  imageUrl: string;
  badges: ListingBadge[];
  seller: {
    name: string;
    rating: number;
    reviewCount: number;
    avatarUrl: string;
  };
  condition: string;
  deliveryAvailable: boolean;
}

// Mock data for development
const mockSeller: Seller = {
  id: 'seller1',
  name: 'Sissibou',
  rating: 4.8,
  reviewCount: 156,
  memberSince: '2023',
  responseRate: '98%',
  responseTime: '< 1h',
  avatarUrl: 'https://i.pravatar.cc/150?img=1',
  location: 'Paris 75001',
  description: 'Vendeur professionnel spécialisé dans les produits high-tech et électroniques.',
  badges: ['pro', 'verified'],
  totalListings: 45,
  reviews: [
    {
      id: 'review1',
      rating: 5,
      comment: 'Excellent vendeur, très professionnel et réactif.',
      createdAt: '2024-02-20',
      reviewer: {
        name: 'Marie L.',
        avatarUrl: 'https://i.pravatar.cc/150?img=10'
      }
    },
    {
      id: 'review2',
      rating: 4,
      comment: 'Bon produit, livraison rapide.',
      createdAt: '2024-02-18',
      reviewer: {
        name: 'Thomas D.',
        avatarUrl: 'https://i.pravatar.cc/150?img=11'
      }
    }
  ]
};

const mockListings: Listing[] = [
  {
    id: '1',
    title: 'Video projecteur EPSON NEUF H692B LCD projector',
    description: 'Projecteur LCD haute performance',
    price: 520,
    location: 'Paris 75001',
    postedAt: '2024-02-26',
    imageUrl: 'https://picsum.photos/400/300?random=1',
    badges: ['pro'],
    seller: {
      name: 'Sissibou',
      rating: 4.8,
      reviewCount: 156,
      avatarUrl: 'https://i.pravatar.cc/150?img=1'
    },
    condition: 'Neuf',
    deliveryAvailable: true
  },
  // Add more listings as needed
];

export default function SellerProfilePage() {
  const params = useParams();
  const [seller, setSeller] = useState<Seller | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [activeTab, setActiveTab] = useState<'listings' | 'reviews'>('listings');

  useEffect(() => {
    // Simulate API call to fetch seller data
    setSeller(mockSeller);
    setListings(mockListings);
  }, [params.id]);

  if (!seller) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Seller Profile Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="relative w-24 h-24 rounded-full overflow-hidden flex-shrink-0">
                <img
                  src={seller.avatarUrl}
                  alt={seller.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Seller Info */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-2xl font-bold text-gray-900">{seller.name}</h1>
                  <div className="flex items-center gap-2">
                    {seller.badges.map((badge) => (
                      <span
                        key={badge}
                        className="px-2 py-1 text-sm font-medium rounded-full
                          bg-purple-100 text-purple-800"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                  <div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                      <span>{seller.rating}</span>
                      <span className="mx-1">•</span>
                      <span>{seller.reviewCount} avis</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="text-gray-500">Membre depuis:</span>
                    <span className="ml-1">{seller.memberSince}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="text-gray-500">Taux de réponse:</span>
                    <span className="ml-1">{seller.responseRate}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="text-gray-500">Délai de réponse:</span>
                    <span className="ml-1">{seller.responseTime}</span>
                  </div>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{seller.location}</span>
                </div>

                <p className="mt-4 text-gray-600">{seller.description}</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab('listings')}
              className={`px-4 py-2 text-sm font-medium ${activeTab === 'listings' ? 'text-[#EC5A12] border-b-2 border-[#EC5A12]' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Annonces ({seller.totalListings})
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-4 py-2 text-sm font-medium ${activeTab === 'reviews' ? 'text-[#EC5A12] border-b-2 border-[#EC5A12]' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Avis ({seller.reviewCount})
            </button>
          </div>

          {/* Content */}
          {activeTab === 'listings' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {seller.reviews.map((review) => (
                <div key={review.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center gap-4 mb-3">
                    <img
                      src={review.reviewer.avatarUrl}
                      alt={review.reviewer.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <div className="font-medium text-gray-900">
                        {review.reviewer.name}
                      </div>
                      <div className="text-sm text-gray-500">{review.createdAt}</div>
                    </div>
                    <div className="ml-auto flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="ml-1 text-sm font-medium text-gray-900">
                        {review.rating}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}