// ListingDetailPage.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { ChevronRight, ChevronLeft, Maximize2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ListingImages from '@/components/ui/ListingImages';
import SellerInfo from '@/components/ui/SellerInfo';
import ListingDetails from '@/components/ui/ListingDetails';
import ProductDetails from '@/components/ui/ProductDetails';
import RelatedListings from '@/components/ui/RelatedListings';
import SafetyDisclaimer from '@/components/ui/SafetyDisclaimer';
import { ListingBadge } from '@/components/ui/Badge';

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
  badges: ListingBadge[];
  paymentMethods: string[];
  acceptsReturns: boolean;
  deliveryAvailable: boolean;
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
    description:
      'Projecteur LCD haute performance avec une résolution native Full HD (1920x1080). Luminosité de 3500 lumens et un contraste de 15000:1. Parfait pour home cinéma et présentations professionnelles.Projecteur LCD haute performance avec une résolution native Full HD (1920x1080). Luminosité de 3500 lumens et un contraste de 15000:1. Parfait pour home cinéma et présentations professionnelles.Projecteur LCD haute performance avec une résolution native Full HD (1920x1080). Luminosité de 3500 lumens et un contraste de 15000:1. Parfait pour home cinéma et présentations professionnelles.Projecteur LCD haute performance avec une résolution native Full HD (1920x1080). Luminosité de 3500 lumens et un contraste de 15000:1. Parfait pour home cinéma et présentations professionnelles.Projecteur LCD haute performance avec une résolution native Full HD (1920x1080). Luminosité de 3500 lumens et un contraste de 15000:1. Parfait pour home cinéma et présentations professionnelles.Projecteur LCD haute performance avec une résolution native Full HD (1920x1080). Luminosité de 3500 lumens et un contraste de 15000:1. Parfait pour home cinéma et présentations professionnelles.',
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
      'https://picsum.photos/800/600?random=5',
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
      badges: ['pro', 'boost'],
      paymentMethods: ['Wave', 'Orange Money', 'Cash', 'Bank Transfer'],
      acceptsReturns: true,
      deliveryAvailable: true,
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
  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement !== null);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [params.id, router]);

  const handleContactClick = useCallback(() => {
    // Implement contact logic (e.g., open a modal, redirect to contact form)
    alert('Contact button clicked!');
  }, []);

  const handleFavoriteClick = useCallback(() => {
    // Implement favorite logic (e.g., add to favorites, update state)
    alert('Favorite button clicked!');
  }, []);

  const handleShareClick = useCallback(() => {
    // Implement share logic (e.g., open share dialog, copy link to clipboard)
    alert('Share button clicked!');
  }, []);

  const handleReportClick = useCallback(() => {
    // Implement report logic (e.g., open report form, send report to server)
    alert('Report button clicked!');
  }, []);

  const handleCloseGallery = useCallback(() => {
    setIsFullscreen(false);
  }, []);

  const handleThumbnailClick = useCallback((index: number) => {
    setCurrentImageIndex(index);
  }, []);

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
                      <div
                        key={i}
                        className="w-20 h-20 bg-gray-200 rounded-lg"
                      ></div>
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
      {!isFullscreen && <Header />}

      <main className="flex-1 bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-gray-900">
              Accueil
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link href="/annonces" className="hover:text-gray-900">
              Annonces
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-gray-900">Projecteur</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Images */}
            <div className="space-y-4">
              {/* Main Image with Gallery */}
              <div className="relative">
                <div
                  className="relative aspect-4/3 rounded-lg overflow-hidden h-[400px] group"
                >
                  {listing.images.map((image, index) => (
                    <div
                      key={image}
                      className={`absolute inset-0 transition-opacity duration-300 ${
                        index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                      }`}
                      onClick={() => setIsFullscreen(true)}
                    >
                      <Image
                        src={image}
                        alt={`${listing.title} - Image ${index + 1}`}
                        fill
                        priority={index === 0}
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error(
                            `Image ${index + 1} failed to load:`,
                            e,
                          );
                        }}
                      />
                    </div>
                  ))}

                  {/* Navigation Arrows */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex((prev) =>
                        prev === 0 ? listing.images.length - 1 : prev - 1,
                      );
                    }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full
                             bg-black/50 text-white opacity-0 group-hover:opacity-100
                             transition-opacity duration-200 hover:bg-black/70"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex((prev) =>
                        prev === listing.images.length - 1 ? 0 : prev + 1,
                      );
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full
                             bg-black/50 text-white opacity-0 group-hover:opacity-100
                             transition-opacity duration-200 hover:bg-black/70"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>

                  {/* Fullscreen Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsFullscreen(true);
                    }}
                    className="absolute top-2 right-2 p-2 rounded-full
                             bg-black/50 text-white opacity-0 group-hover:opacity-100
                             transition-opacity duration-200 hover:bg-black/70"
                    aria-label="Toggle fullscreen"
                  >
                    <Maximize2 className="w-6 h-6" />
                  </button>
                </div>

                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black/50 text-white
                            px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {listing.images.length}
                </div>
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-5 gap-2">
                {listing.images.map((image, index) => (
                  <button
                    key={image}
                    onClick={() => handleThumbnailClick(index)}
                    className="relative aspect-square rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
                  >
                    <Image
                      src={image}
                      alt={`${listing.title} - Image ${index + 1}`}
                      fill
                      sizes="(max-width: 640px) 20vw, 10vw"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
            {isFullscreen && (
              <ListingImages
                images={listing.images}
                title={listing.title}
                onClose={handleCloseGallery}
              />
            )}

            {/* Right Column - Details */}
            <ListingDetails
              title={listing.title}
              price={listing.price}
              originalPrice={listing.originalPrice}
              sellerInfo={<SellerInfo seller={listing.seller} />}
              onContactClick={handleContactClick}
              onFavoriteClick={handleFavoriteClick}
              onShareClick={handleShareClick}
              onReportClick={handleReportClick}
            />
          </div>

          {/* Description and Specifications */}
          <ProductDetails
            description={listing.description}
            specifications={listing.specifications}
            location={listing.location}
            deliveryOptions={listing.deliveryOptions}
            shippingCost={listing.shippingCost}
          />

          {/* Safety Disclaimer */}
          <SafetyDisclaimer />

          {/* Related Listings */}
          <RelatedListings
            listings={[
              {
                id: '2',
                title: 'Projecteur LED Full HD 4K',
                price: 450,
                originalPrice: 599,
                imageUrl: 'https://picsum.photos/800/600?random=6',
                condition: 'Neuf',
                seller: {
                  name: 'TechPro',
                  avatarUrl: 'https://i.pravatar.cc/150?img=2',
                },
              },
              {
                id: '3',
                title: 'Mini Projecteur Portable',
                price: 299,
                imageUrl: 'https://picsum.photos/800/600?random=7',
                condition: 'Très bon état',
                seller: {
                  name: 'MediaShop',
                  avatarUrl: 'https://i.pravatar.cc/150?img=3',
                },
              },
              {
                id: '4',
                title: 'Projecteur Home Cinéma 4K',
                price: 899,
                originalPrice: 1299,
                imageUrl: 'https://picsum.photos/800/600?random=8',
                condition: 'Neuf',
                seller: {
                  name: 'CinemaPlus',
                  avatarUrl: 'https://i.pravatar.cc/150?img=4',
                },
              },
              {
                id: '5',
                title: 'Projecteur Laser Ultra-Courte Focale',
                price: 1499,
                originalPrice: 1899,
                imageUrl: 'https://picsum.photos/800/600?random=9',
                condition: 'Neuf',
                seller: {
                  name: 'HomeTheater',
                  avatarUrl: 'https://i.pravatar.cc/150?img=5',
                },
              },
              {
                id: '6',
                title: 'Mini Projecteur LED WiFi',
                price: 199,
                originalPrice: 249,
                imageUrl: 'https://picsum.photos/800/600?random=10',
                condition: 'Neuf',
                seller: {
                  name: 'SmartGear',
                  avatarUrl: 'https://i.pravatar.cc/150?img=6',
                },
              },
              {
                id: '7',
                title: 'Projecteur Gaming 240Hz',
                price: 799,
                imageUrl: 'https://picsum.photos/800/600?random=11',
                condition: 'Comme neuf',
                seller: {
                  name: 'GameTech',
                  avatarUrl: 'https://i.pravatar.cc/150?img=7',
                },
              },
            ]}
            currentListingId={listing.id}
          />
        </div>
      </main>

      {!isFullscreen && <Footer />}
    </div>
  );
}
