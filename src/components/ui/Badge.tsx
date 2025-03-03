'use client';

import dynamic from 'next/dynamic';

// Types for badge data
export type ListingBadge = 'urgent' | 'pro' | 'boost' | 'delivery';

// Badge component
// Dynamically import the Badge component with SSR disabled
const Badge = dynamic(() => Promise.resolve(({ type }: { type: ListingBadge }) => {
  const getBadgeStyles = (type: ListingBadge) => {
    switch (type) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'pro':
        return 'bg-blue-100 text-blue-800';
      case 'boost':
        return 'bg-purple-100 text-purple-800';
      case 'delivery':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getBadgeLabel = (type: ListingBadge) => {
    switch (type) {
      case 'urgent':
        return 'Urgent';
      case 'pro':
        return 'Pro';
      case 'boost':
        return 'Boost';
      case 'delivery':
        return 'Livraison possible';
      default:
        return type;
    }
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeStyles(type)}`}>
      {getBadgeLabel(type)}
    </span>
  );
}), { ssr: false });

export default Badge;
