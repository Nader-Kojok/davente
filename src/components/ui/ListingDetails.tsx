// components/ui/ListingDetails.tsx
import React from 'react';

interface ListingDetailsProps {
  title: string;
  price: number | 'Gratuit';
  originalPrice?: number;
  sellerInfo: React.ReactNode;
  onContactClick?: () => void;
  onFavoriteClick?: () => void;
  onShareClick?: () => void;
  onReportClick?: () => void;
}

const ListingDetails: React.FC<ListingDetailsProps> = ({
  title,
  price,
  originalPrice,
  sellerInfo,
}) => {
  return (
    <div className="space-y-6">
      {/* Title and Price */}
      <div>
        <h1 className="h2">{title}</h1> {/* Use base heading style */}
        <div className="flex items-baseline space-x-3">
          <span className="text-3xl font-bold text-gray-900">
            {price.toLocaleString()} €
          </span>
          {originalPrice && (
            <span className="text-lg text-gray-500 line-through">
              {originalPrice.toLocaleString()} €
            </span>
          )}
        </div>
      </div>

      {/* Seller Info */}
      {sellerInfo}

    </div>
  );
};

export default ListingDetails;
