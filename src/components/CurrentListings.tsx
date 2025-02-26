'use client';

import Image from 'next/image';
import Link from 'next/link';

type Listing = {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  title: string;
  price: number;
  image: string;
  location: string;
  postalCode: string;
  features: string[];
};

const currentListings: Listing[] = [
  {
    id: '1',
    user: {
      name: 'Dimi',
      avatar: 'https://i.pravatar.cc/150?u=dimi'
    },
    title: 'Samsung galaxy s23 lavande',
    price: 280,
    image: 'https://picsum.photos/400?random=1',
    location: 'Dakar',
    postalCode: '12000',
    features: ['Livraison possible']
  },
  {
    id: '2',
    user: {
      name: 'TechPro',
      avatar: 'https://i.pravatar.cc/150?u=techpro'
    },
    title: 'iPhone 14 Pro Max',
    price: 899,
    image: 'https://picsum.photos/400?random=2',
    location: 'Thiès',
    postalCode: '21000',
    features: ['Pro', 'Livraison possible']
  },
  {
    id: '3',
    user: {
      name: 'MobileShop',
      avatar: 'https://i.pravatar.cc/150?u=mobileshop'
    },
    title: 'AirPods Pro 2ème gen',
    price: 199,
    image: 'https://picsum.photos/400?random=3',
    location: 'Saint-Louis',
    postalCode: '32000',
    features: ['Pro']
  },
  {
    id: '4',
    user: {
      name: 'SmartGear',
      avatar: 'https://i.pravatar.cc/150?u=smartgear'
    },
    title: 'Apple Watch Series 8',
    price: 450,
    image: 'https://picsum.photos/400?random=4',
    location: 'Dakar',
    postalCode: '12100',
    features: ['Livraison possible']
  }
];

export default function CurrentListings() {
  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-semibold">En ce moment sur davente</h2>
            <p className="text-gray-600 mt-1">Téléphones & Objets connectés</p>
          </div>
          <Link
            href="/categories/electronique"
            className="text-[#EC5A12] hover:text-[#d94e0a] font-medium transition-colors duration-200"
          >
            Voir plus d&apos;annonces
          </Link>
        </div>

        {/* Listings Grid */}
        <div className="relative">
          <div
            className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide"
            style={{
              scrollBehavior: 'smooth',
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
            }}
          >
            {currentListings.map((listing) => (
              <div
                key={listing.id}
                className="flex-none w-72 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                {/* User Info */}
                <div className="p-3 flex items-center space-x-2 border-b border-gray-100">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                    <Image
                      src={listing.user.avatar}
                      alt={listing.user.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="font-medium text-sm text-gray-900">
                    {listing.user.name}
                  </span>
                </div>

                {/* Product Image */}
                <div className="relative aspect-square">
                  <Image
                    src={listing.image}
                    alt={listing.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Product Info */}
                <div className="p-3">
                  <h3 className="font-medium text-gray-900 mb-1">{listing.title}</h3>
                  <p className="text-lg font-semibold text-gray-900 mb-2">
                    {listing.price.toLocaleString()} F
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>
                      {listing.location} {listing.postalCode}
                    </span>
                    <div className="flex gap-2">
                      {listing.features.map((feature, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 rounded-full text-xs"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}