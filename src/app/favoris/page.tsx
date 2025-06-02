'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, MapPin, Calendar, Eye, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useBookmarks } from '@/hooks/useBookmarks';
import { formatPrice } from '@/lib/utils/formatPrice';
import { getRelativeTime } from '@/lib/utils/formatDate';
import BookmarkButton from '@/components/ui/BookmarkButton';
import AccountLayout from '@/components/AccountLayout';

export default function FavorisPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { bookmarks, isLoading, error, total, refreshBookmarks } = useBookmarks();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading || isLoading) {
    return (
      <AccountLayout 
        title="Mes Favoris" 
        description="Gérez vos annonces favorites"
      >
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-4">
                <div className="h-48 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </AccountLayout>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AccountLayout 
      title="Mes Favoris" 
      description={total > 0 ? `${total} annonce${total > 1 ? 's' : ''} sauvegardée${total > 1 ? 's' : ''}` : 'Aucune annonce sauvegardée'}
    >
      {/* Actions en haut à droite */}
      {total > 0 && (
        <div className="flex justify-end mb-6 sm:mb-8">
          <button
            onClick={refreshBookmarks}
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </button>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {total === 0 && !error && (
        <div className="text-center py-16">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <Heart className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Aucun favori pour le moment
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Parcourez les annonces et cliquez sur le cœur pour les ajouter à vos favoris.
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Eye className="mr-2" size={20} />
            Parcourir les annonces
          </Link>
        </div>
      )}

      {/* Bookmarks Grid */}
      {total > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {bookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden"
            >
              {/* Image */}
              <div className="relative h-48 bg-gray-200">
                <Image
                  src={bookmark.annonce.picture}
                  alt={bookmark.annonce.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                
                {/* Bookmark Button */}
                <div className="absolute top-3 right-3">
                  <BookmarkButton
                    annonceId={bookmark.annonce.id}
                    size="sm"
                    variant="default"
                  />
                </div>

                {/* Status Badge */}
                {bookmark.annonce.status !== 'active' && (
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 bg-gray-900 text-white text-xs rounded-full">
                      {bookmark.annonce.status === 'sold' ? 'Vendu' : 'Inactif'}
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Title */}
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {bookmark.annonce.title}
                </h3>

                {/* Price */}
                <p className="text-xl font-bold text-primary-600 mb-2">
                  {formatPrice(bookmark.annonce.price)}
                </p>

                {/* Location */}
                <div className="flex items-center text-gray-600 text-sm mb-2">
                  <MapPin size={14} className="mr-1" />
                  {bookmark.annonce.location}
                </div>

                {/* Category */}
                {bookmark.annonce.Category && (
                  <div className="flex items-center text-gray-600 text-sm mb-2">
                    <span className="text-lg mr-1">{bookmark.annonce.Category.icon}</span>
                    {bookmark.annonce.Category.name}
                    {bookmark.annonce.Subcategory && (
                      <span className="text-gray-400"> • {bookmark.annonce.Subcategory.name}</span>
                    )}
                  </div>
                )}

                {/* Date Added to Favorites */}
                <div className="flex items-center text-gray-500 text-xs mb-4">
                  <Calendar size={12} className="mr-1" />
                  Ajouté {getRelativeTime(bookmark.createdAt)}
                </div>

                {/* Seller Info */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center">
                    <Image
                      src={bookmark.annonce.user.picture}
                      alt={bookmark.annonce.user.name}
                      width={24}
                      height={24}
                      className="rounded-full mr-2"
                    />
                    <span className="text-sm text-gray-600">
                      {bookmark.annonce.user.name}
                    </span>
                    {bookmark.annonce.user.isVerified && (
                      <span className="ml-1 text-primary-500">✓</span>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <Link
                  href={`/annonce/${bookmark.annonce.id}`}
                  className="block w-full mt-4 px-4 py-2 bg-primary-600 text-white text-center rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Voir l'annonce
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </AccountLayout>
  );
} 