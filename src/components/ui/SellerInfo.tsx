// components/SellerInfo.tsx
import Image from 'next/image';
import { Star, Heart, Share2, Flag, Truck, RotateCcw, Wallet } from 'lucide-react';
import Badge, { ListingBadge } from './Badge';
import BaseLink from '@/components/ui/BaseLink'; // Import BaseLink

interface SellerInfoProps {
  seller: {
    id: string;
    name: string;
    rating: number;
    reviewCount: number;
    memberSince: string;
    responseRate: string;
    responseTime: string;
    avatarUrl: string;
    badges: ListingBadge[];
    paymentMethods?: string[];
    acceptsReturns?: boolean;
    deliveryAvailable?: boolean;
  };
  onContactClick?: () => void;
  onFavoriteClick?: () => void;
  onShareClick?: () => void;
  onReportClick?: () => void;
}

const SellerInfo: React.FC<SellerInfoProps> = ({
  seller,
  onContactClick,
  onFavoriteClick,
  onShareClick,
  onReportClick
}) => {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      {/* User Profile Header */}
      <BaseLink href={`/vendeurs/${seller.id}`} className="group block mb-6"> {/* Use BaseLink */}
        <div className="flex items-center space-x-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src={seller.avatarUrl}
              alt={seller.name}
              fill
              className="object-cover"
              onError={(e) => {
                console.error('Avatar failed to load', e);
                // Handle error: display fallback image or message
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-lg text-gray-900 group-hover:text-[#E00201] transition-colors"> {/* h3 style */}
              {seller.name}
            </h3>
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
              <span>{seller.rating}</span>
              <span className="mx-1">•</span>
              <span>{seller.reviewCount} avis</span>
            </div>
          </div>
        </div>
      </BaseLink>

      {/* Seller Details */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-600 mb-6">
        <div className="flex items-center space-x-1">
          <span className="text-gray-500">Membre depuis:</span>
          <span>{seller.memberSince}</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="text-gray-500">Réponse:</span>
          <span>{seller.responseRate}</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="text-gray-500">Délai:</span>
          <span>{seller.responseTime}</span>
        </div>
        {seller.badges.length > 0 && (
          <div className="flex items-center gap-1">
            {seller.badges.map((badge) => (
              <Badge key={badge} type={badge} />
            ))}
          </div>
        )}
      </div>

      {/* Additional Seller Information */}
      <div className="space-y-3 text-sm mb-6">
        {/* Payment Methods */}
        {seller.paymentMethods && seller.paymentMethods.length > 0 && (
          <div className="flex items-center space-x-2">
            <Wallet className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">
              Paiement accepté: {seller.paymentMethods.join(', ')}
            </span>
          </div>
        )}

        {/* Returns Policy */}
        <div className="flex items-center space-x-2">
          <RotateCcw className="w-4 h-4 text-gray-500" />
          <span className="text-gray-600">
            {seller.acceptsReturns ? 'Retours acceptés' : 'Retours non acceptés'}
          </span>
        </div>

        {/* Delivery */}
        <div className="flex items-center space-x-2">
          <Truck className="w-4 h-4 text-gray-500" />
          <span className="text-gray-600">
            {seller.deliveryAvailable ? 'Livraison disponible' : 'Pas de livraison'}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <button
          onClick={onContactClick}
          className="flex-1 bg-[#E00201] text-white px-4 py-2 rounded-lg hover:bg-[#CB0201] transition-colors duration-200"
        >
          Contacter
        </button>
        <button
          onClick={onFavoriteClick}
          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
        >
          <Heart className="w-5 h-5 text-gray-600" />
        </button>
        <button
          onClick={onShareClick}
          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
        >
          <Share2 className="w-5 h-5 text-gray-600" />
        </button>
        <button
          onClick={onReportClick}
          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
        >
          <Flag className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default SellerInfo;
