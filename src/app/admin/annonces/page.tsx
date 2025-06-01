'use client';

import { useState, useEffect } from 'react';
import { RecentListing } from '@/types/category';
import Image from 'next/image';
import Link from 'next/link';

export default function AdminAnnoncesPage() {
  const [listings, setListings] = useState<RecentListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    async function fetchListings() {
      try {
        setIsLoading(true);
        setError(null);
        
        const params = new URLSearchParams();
        params.append('limit', '20');
        if (selectedCategory) params.append('categoryId', selectedCategory);
        
        const response = await fetch(`/api/annonces/recent?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des annonces');
        }
        
        const data = await response.json();
        setListings(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        console.error('Error fetching listings:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchListings();
  }, [selectedCategory]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Administration - Annonces Récentes</h1>
          <div className="text-center py-8">
            <p className="text-gray-500">Chargement des annonces...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Administration - Annonces Récentes</h1>
          <div className="text-center py-8">
            <p className="text-red-500">Erreur: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  const totalValue = listings.reduce((sum, listing) => sum + listing.price, 0);
  const averagePrice = listings.length > 0 ? totalValue / listings.length : 0;
  const uniqueUsers = new Set(listings.map(listing => listing.user.id)).size;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Administration - Annonces Récentes</h1>
          <p className="text-gray-600">Gestion et statistiques des annonces récemment publiées</p>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filtres</h2>
          <div className="flex gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E00201]"
            >
              <option value="">Toutes les catégories</option>
              <option value="1">Véhicules</option>
              <option value="2">Mode</option>
              <option value="3">Immobilier</option>
              <option value="4">Électronique</option>
              <option value="5">Maison & Jardin</option>
              <option value="6">Services</option>
            </select>
          </div>
        </div>

        {/* Statistiques globales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total annonces</h3>
            <p className="text-3xl font-bold text-[#E00201]">{listings.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Valeur totale</h3>
            <p className="text-3xl font-bold text-[#E00201]">
              {totalValue.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} F
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Prix moyen</h3>
            <p className="text-3xl font-bold text-[#E00201]">
              {averagePrice.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} F
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Vendeurs uniques</h3>
            <p className="text-3xl font-bold text-[#E00201]">{uniqueUsers}</p>
          </div>
        </div>

        {/* Liste des annonces */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Annonces Récentes</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Annonce
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendeur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prix
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Localisation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Catégorie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {listings.map((listing, index) => (
                  <tr key={listing.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-200 mr-4">
                          <Image
                            src={listing.picture || `https://picsum.photos/400?random=${listing.id}`}
                            alt={listing.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                            {listing.title}
                          </div>
                          <div className="text-sm text-gray-500">ID: {listing.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-200 mr-3">
                          <Image
                            src={listing.user.picture || `https://i.pravatar.cc/150?u=${listing.user.name}`}
                            alt={listing.user.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{listing.user.name}</div>
                          <div className="text-sm text-gray-500">ID: {listing.user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-gray-900">
                        {listing.price.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} F
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{listing.location}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {listing.category?.name || 'Non catégorisé'}
                      </div>
                      {listing.subcategory && (
                        <div className="text-xs text-gray-500">{listing.subcategory.name}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {new Date(listing.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                      <div className="text-xs text-gray-500">
                        {new Date(listing.createdAt).toLocaleTimeString('fr-FR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        href={`/annonce/${listing.id}`}
                        className="text-[#E00201] hover:text-[#B00201] transition-colors mr-4"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Voir
                      </Link>
                      <Link
                        href={`/profil/${listing.user.id}`}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Profil
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Répartition par catégorie */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par catégorie</h3>
          <div className="space-y-3">
            {Object.entries(
              listings.reduce((acc, listing) => {
                const categoryName = listing.category?.name || 'Non catégorisé';
                acc[categoryName] = (acc[categoryName] || 0) + 1;
                return acc;
              }, {} as Record<string, number>)
            ).map(([categoryName, count]) => {
              const percentage = listings.length > 0 ? (count / listings.length * 100) : 0;
              
              return (
                <div key={categoryName} className="flex items-center">
                  <div className="w-32 text-sm text-gray-700">
                    {categoryName}
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-[#E00201] h-3 rounded-full transition-all duration-300" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-20 text-sm text-gray-600 text-right">
                    {count} ({percentage.toFixed(1)}%)
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
} 