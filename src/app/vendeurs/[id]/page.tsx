// src/app/vendeurs/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ListingCard from '@/components/ui/ListingCard';
import { Star, MapPin, MessageCircle, UserPlus, Share2, Flag, ChevronLeft, ChevronRight } from 'lucide-react';
import { ListingBadge } from '@/components/ui/ListingCard';
import Textarea from '@/components/ui/Textarea'; // Import Textarea

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
    description: 'Projecteur LCD haute performance, résolution 4K, 3600 lumens, parfait pour home cinéma ou présentations professionnelles.',
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
  {
    id: '2',
    title: 'MacBook Pro 14" M3 Pro - 1TB SSD',
    description: 'MacBook Pro dernière génération, processeur M3 Pro, 18GB RAM, 1TB SSD, état impeccable, sous garantie Apple Care+.',
    price: 2199,
    location: 'Paris 75001',
    postedAt: '2024-02-25',
    imageUrl: 'https://picsum.photos/400/300?random=2',
    badges: ['pro', 'verified'],
    seller: {
      name: 'Sissibou',
      rating: 4.8,
      reviewCount: 156,
      avatarUrl: 'https://i.pravatar.cc/150?img=1'
    },
    condition: 'Comme neuf',
    deliveryAvailable: true
  },
  {
    id: '3',
    title: 'iPhone 15 Pro Max - 256GB Titane',
    description: 'iPhone 15 Pro Max titanium, 256GB, débloqué tout opérateur, acheté il y a 2 mois, comme neuf avec tous les accessoires.',
    price: 1299,
    location: 'Paris 75001',
    postedAt: '2024-02-24',
    imageUrl: 'https://picsum.photos/400/300?random=3',
    badges: ['pro'],
    seller: {
      name: 'Sissibou',
      rating: 4.8,
      reviewCount: 156,
      avatarUrl: 'https://i.pravatar.cc/150?img=1'
    },
    condition: 'Comme neuf',
    deliveryAvailable: true
  },
  {
    id: '4',
    title: 'Sony WH-1000XM5 - Casque sans fil',
    description: 'Casque Sony WH-1000XM5 avec réduction de bruit active, Bluetooth multipoint, autonomie 30h, son exceptionnel.',
    price: 299,
    location: 'Paris 75001',
    postedAt: '2024-02-23',
    imageUrl: 'https://picsum.photos/400/300?random=4',
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
  {
    id: '5',
    title: 'iPad Pro 12.9" M2 - 512GB WiFi+5G',
    description: 'iPad Pro 12.9 pouces, puce M2, 512GB, WiFi+5G, avec Apple Pencil 2 et Magic Keyboard inclus. Parfait état.',
    price: 1499,
    location: 'Paris 75001',
    postedAt: '2024-02-22',
    imageUrl: 'https://picsum.photos/400/300?random=5',
    badges: ['pro', 'urgent'],
    seller: {
      name: 'Sissibou',
      rating: 4.8,
      reviewCount: 156,
      avatarUrl: 'https://i.pravatar.cc/150?img=1'
    },
    condition: 'Très bon état',
    deliveryAvailable: true
  },
  {
    id: '6',
    title: 'Console PS5 Edition Digital',
    description: 'PS5 Digital Edition, comme neuve, avec 2 manettes DualSense et 3 jeux en version numérique inclus.',
    price: 399,
    location: 'Paris 75001',
    postedAt: '2024-02-21',
    imageUrl: 'https://picsum.photos/400/300?random=6',
    badges: ['pro'],
    seller: {
      name: 'Sissibou',
      rating: 4.8,
      reviewCount: 156,
      avatarUrl: 'https://i.pravatar.cc/150?img=1'
    },
    condition: 'Comme neuf',
    deliveryAvailable: true
  },
  {
    id: '7',
    title: 'Drone DJI Air 3 Fly More Combo',
    description: 'DJI Air 3 avec combo Fly More, 3 batteries, sac de transport, filtres ND. Utilisé 2 fois, sous garantie.',
    price: 1099,
    location: 'Paris 75001',
    postedAt: '2024-02-20',
    imageUrl: 'https://picsum.photos/400/300?random=7',
    badges: ['pro', 'verified'],
    seller: {
      name: 'Sissibou',
      rating: 4.8,
      reviewCount: 156,
      avatarUrl: 'https://i.pravatar.cc/150?img=1'
    },
    condition: 'Comme neuf',
    deliveryAvailable: true
  },
  {
    id: '8',
    title: 'Samsung Galaxy S24 Ultra - 512GB',
    description: 'Samsung Galaxy S24 Ultra, 512GB, débloqué, avec S Pen, coque originale et protection écran en verre trempé.',
    price: 1199,
    location: 'Paris 75001',
    postedAt: '2024-02-19',
    imageUrl: 'https://picsum.photos/400/300?random=8',
    badges: ['pro'],
    seller: {
      name: 'Sissibou',
      rating: 4.8,
      reviewCount: 156,
      avatarUrl: 'https://i.pravatar.cc/150?img=1'
    },
    condition: 'Neuf',
    deliveryAvailable: true
  }
];

export default function SellerProfilePage() {
  const params = useParams();
  const [seller, setSeller] = useState<Seller | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [activeTab, setActiveTab] = useState<'listings' | 'reviews'>('listings');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('recent');
  const [reviewSortBy, setReviewSortBy] = useState('recent');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ''
  });
  const [showReportModal, setShowReportModal] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  
  const itemsPerPage = 6;
  const totalPages = Math.ceil((activeTab === 'listings' ? listings.length : (seller?.reviews.length || 0)) / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSort = (value: string) => {
    setSortBy(value);
    const sortedListings = [...listings].sort((a, b) => {
      if (value === 'price_asc') return (typeof a.price === 'number' ? a.price : 0) - (typeof b.price === 'number' ? b.price : 0);
      if (value === 'price_desc') return (typeof b.price === 'number' ? b.price : 0) - (typeof a.price === 'number' ? a.price : 0);
      if (value === 'recent') return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
      return new Date(a.postedAt).getTime() - new Date(b.postedAt).getTime();
    });
    setListings(sortedListings);
  };

  const handleContact = () => {
    // Implement contact functionality
    console.log('Contact seller');
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: `${seller?.name} sur davente`,
        text: `Découvrez le profil de ${seller?.name} sur davente`,
        url: window.location.href,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleReport = () => {
    setShowReportModal(true);
  };

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
                <Image
                  src={seller.avatarUrl}
                  alt={seller.name}
                  fill
                  sizes="96px"
                  className="object-cover"
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

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleContact}
                    className="flex-1 bg-[#E00201] text-white px-6 py-3 rounded-lg hover:bg-[#CB0201] transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Contacter
                  </button>
                  <button
                    onClick={handleFollow}
                    className={`px-4 py-3 rounded-lg border transition-colors duration-200 flex items-center justify-center gap-2 ${isFollowing ? 'bg-gray-100 border-gray-300 text-gray-700' : 'border-[#E00201] text-[#E00201] hover:bg-[#E00201] hover:text-white'}`}
                  >
                    <UserPlus className="w-5 h-5" />
                    {isFollowing ? 'Suivi' : 'Suivre'}
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
                    aria-label="Partager"
                  >
                    <Share2 className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={handleReport}
                    className="p-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
                    aria-label="Signaler"
                  >
                    <Flag className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab('listings')}
              className={`px-4 py-2 text-sm font-medium ${activeTab === 'listings' ? 'text-[#E00201] border-b-2 border-[#E00201]' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Annonces ({seller.totalListings})
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-4 py-2 text-sm font-medium ${activeTab === 'reviews' ? 'text-[#E00201] border-b-2 border-[#E00201]' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Avis ({seller.reviewCount})
            </button>
          </div>

          {/* Content */}
          {activeTab === 'listings' ? (
            <div className="mb-6">
              <select
                value={sortBy}
                onChange={(e) => handleSort(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#E00201] focus:border-transparent"
              >
                <option value="recent">Plus récentes</option>
                <option value="oldest">Plus anciennes</option>
                <option value="price_asc">Prix croissant</option>
                <option value="price_desc">Prix décroissant</option>
              </select>
            </div>
          ) : (
            <div className="mb-6 flex justify-between items-center">
              <select
                value={reviewSortBy}
                onChange={(e) => {
                  setReviewSortBy(e.target.value);
                  const sortedReviews = [...seller.reviews].sort((a, b) => {
                    if (e.target.value === 'recent') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                    if (e.target.value === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                    if (e.target.value === 'rating_high') return b.rating - a.rating;
                    return a.rating - b.rating;
                  });
                  setSeller({ ...seller, reviews: sortedReviews });
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#E00201] focus:border-transparent"
              >
                <option value="recent">Plus récents</option>
                <option value="oldest">Plus anciens</option>
                <option value="rating_high">Note - Plus élevée</option>
                <option value="rating_low">Note - Plus basse</option>
              </select>
              <button
                onClick={() => setShowReviewForm(true)}
                className="bg-[#E00201] text-white px-4 py-2 rounded-lg hover:bg-[#CB0201] transition-colors duration-200"
              >
                Écrire un avis
              </button>
            </div>
          )}

          {/* Content */}
          {activeTab === 'listings' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-12">
              {listings
                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                .map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
            </div>
          ) : (
            <div className="space-y-6">
              {seller.reviews
                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                .map((review) => (
                <div key={review.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden">
                      <Image
                        src={review.reviewer.avatarUrl}
                        alt={review.reviewer.name}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 rounded-lg border ${
                    currentPage === page
                      ? 'bg-[#E00201] text-white border-[#E00201]'
                      : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                  } transition-colors duration-200`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Signaler {seller.name}</h3>
            <p className="text-gray-600 mb-4">Pourquoi souhaitez-vous signaler ce vendeur ?</p>
            <div className="space-y-2">
              {['Contenu inapproprié', 'Arnaque potentielle', 'Fausses informations', 'Autre'].map((reason) => (
                <button
                  key={reason}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors duration-200"
                  onClick={() => {
                    console.log('Report reason:', reason);
                    setShowReportModal(false);
                  }}
                >
                  {reason}
                </button>
              ))}
            </div>
            <button
              className="mt-4 w-full px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              onClick={() => setShowReportModal(false)}
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Review Form Modal */}
      {showReviewForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Écrire un avis pour {seller.name}</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Note</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 ${star <= newReview.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Votre avis</label>
              <Textarea // Use Textarea component
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                className="w-full"
                rows={4}
                placeholder="Partagez votre expérience avec ce vendeur..."
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  const newReviewObj = {
                    id: `review${seller.reviews.length + 1}`,
                    rating: newReview.rating,
                    comment: newReview.comment,
                    createdAt: new Date().toISOString().split('T')[0],
                    reviewer: {
                      name: 'Vous',
                      avatarUrl: 'https://i.pravatar.cc/150?img=12'
                    }
                  };
                  setSeller({
                    ...seller,
                    reviews: [newReviewObj, ...seller.reviews],
                    reviewCount: seller.reviewCount + 1,
                    rating: Number(((seller.rating * seller.reviewCount + newReview.rating) / (seller.reviewCount + 1)).toFixed(1))
                  });
                  setShowReviewForm(false);
                  setNewReview({ rating: 5, comment: '' });
                }}
                className="flex-1 bg-[#E00201] text-white px-4 py-2 rounded-lg hover:bg-[#CB0201] transition-colors duration-200"
              >
                Publier
              </button>
              <button
                onClick={() => {
                  setShowReviewForm(false);
                  setNewReview({ rating: 5, comment: '' });
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200 border border-gray-300"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
