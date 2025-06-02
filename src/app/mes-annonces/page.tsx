'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  MoreVertical, 
  Search, 
  MapPin,
  Calendar,
  TrendingUp,
  Power,
  PowerOff,
  ExternalLink,
  Filter
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AccountLayout from '@/components/AccountLayout';
import TextInput from '@/components/ui/TextInput';
import toast from 'react-hot-toast';

interface Annonce {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  picture: string;
  gallery?: string[];
  createdAt: string;
  status: 'active' | 'inactive' | 'sold';
  userId: number;
  user?: {
    id: number;
    name: string;
    picture: string;
    mobile: string;
  };
}

export default function MesAnnoncesPage() {
  const { user, isAuthenticated, token, logout, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [annonces, setAnnonces] = useState<Annonce[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showDropdown, setShowDropdown] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('Auth state:', { 
      authLoading, 
      isAuthenticated, 
      user: user?.id, 
      token: token ? 'Present' : 'Missing' 
    });
    
    // Attendre que l'auth soit chargé avant de faire quoi que ce soit
    if (authLoading) {
      console.log('Auth still loading, waiting...');
      return;
    }
    
    if (!isAuthenticated || !token) {
      console.log('Not authenticated, redirecting to login');
      router.push('/login');
      return;
    }

    console.log('Authenticated, fetching annonces');
    fetchUserAnnonces();
  }, [authLoading, isAuthenticated, token, router]);

  // Fermer le dropdown quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchUserAnnonces = async () => {
    if (!token) {
      toast.error('Token d\'authentification manquant');
      router.push('/login');
      return;
    }

    try {
      setIsLoading(true);
      console.log('Fetching user annonces with token:', token ? 'Present' : 'Missing');
      
      const response = await fetch('/api/annonces/user', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response status:', response.status);
      
      if (response.status === 401) {
        toast.error('Session expirée, veuillez vous reconnecter');
        logout();
        router.push('/login');
        return;
      }
      
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched annonces:', data);
        setAnnonces(data || []);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', errorData);
        toast.error(errorData.error || 'Erreur lors du chargement des annonces');
      }
    } catch (error) {
      console.error('Network error:', error);
      toast.error('Erreur de connexion au serveur');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAnnonce = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) {
      return;
    }

    if (!token) {
      toast.error('Token d\'authentification manquant');
      logout();
      router.push('/login');
      return;
    }

    try {
      const response = await fetch(`/api/annonces/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        toast.error('Session expirée, veuillez vous reconnecter');
        logout();
        router.push('/login');
        return;
      }

      if (response.ok) {
        setAnnonces(prev => prev.filter(annonce => annonce.id !== id));
        toast.success('Annonce supprimée avec succès');
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.error || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Erreur de connexion au serveur');
    }
    setShowDropdown(null);
  };

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    if (!token) {
      toast.error('Token d\'authentification manquant');
      logout();
      router.push('/login');
      return;
    }
    
    try {
      const response = await fetch(`/api/annonces/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.status === 401) {
        toast.error('Session expirée, veuillez vous reconnecter');
        logout();
        router.push('/login');
        return;
      }

      if (response.ok) {
        setAnnonces(prev => prev.map(annonce => 
          annonce.id === id ? { ...annonce, status: newStatus as 'active' | 'inactive' } : annonce
        ));
        toast.success(`Annonce ${newStatus === 'active' ? 'activée' : 'désactivée'}`);
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.error || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Toggle status error:', error);
      toast.error('Erreur de connexion au serveur');
    }
    setShowDropdown(null);
  };

  const filteredAnnonces = annonces.filter(annonce => {
    const matchesSearch = annonce.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         annonce.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || annonce.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return {
          badge: <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5"></div>
            Actif
          </span>,
          icon: <Power className="w-4 h-4 text-green-600" />,
          color: 'green'
        };
      case 'inactive':
        return {
          badge: <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-1.5"></div>
            Inactif
          </span>,
          icon: <PowerOff className="w-4 h-4 text-gray-600" />,
          color: 'gray'
        };
      case 'sold':
        return {
          badge: <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-1.5"></div>
            Vendu
          </span>,
          icon: <TrendingUp className="w-4 h-4 text-blue-600" />,
          color: 'blue'
        };
      default:
        return {
          badge: null,
          icon: null,
          color: 'gray'
        };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Aujourd\'hui';
    if (diffDays === 2) return 'Hier';
    if (diffDays <= 7) return `Il y a ${diffDays} jours`;
    return date.toLocaleDateString('fr-FR');
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {authLoading ? 'Vérification de l\'authentification...' : 'Chargement de vos annonces...'}
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Redirection vers la page de connexion...</p>
        </div>
      </div>
    );
  }

  return (
    <AccountLayout 
      title="Mes annonces" 
      description="Gérez toutes vos annonces publiées"
    >
      {/* Header avec actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Mes annonces</h1>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 w-fit">
            {annonces.length} annonce{annonces.length > 1 ? 's' : ''}
          </span>
        </div>
        
        <div>
          <Link
            href="/publier"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle annonce
          </Link>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900">{annonces.length}</div>
              <div className="text-xs sm:text-sm text-gray-500">Total</div>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xl sm:text-2xl font-bold text-green-600">
                {annonces.filter(a => a.status === 'active').length}
              </div>
              <div className="text-xs sm:text-sm text-gray-500">Actives</div>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Power className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xl sm:text-2xl font-bold text-gray-600">
                {annonces.filter(a => a.status === 'inactive').length}
              </div>
              <div className="text-xs sm:text-sm text-gray-500">Inactives</div>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <PowerOff className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xl sm:text-2xl font-bold text-blue-600">
                {annonces.filter(a => a.status === 'sold').length}
              </div>
              <div className="text-xs sm:text-sm text-gray-500">Vendues</div>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 mb-6 sm:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <TextInput
                placeholder="Rechercher dans mes annonces..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
              >
                <option value="all">Tous les statuts</option>
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
                <option value="sold">Vendu</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de vos annonces...</p>
        </div>
      ) : (
        <>
          {/* Liste des annonces */}
          {filteredAnnonces.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Plus className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm || selectedStatus !== 'all' ? 'Aucune annonce trouvée' : 'Aucune annonce publiée'}
              </h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                {searchTerm || selectedStatus !== 'all' 
                  ? 'Essayez de modifier vos critères de recherche pour trouver ce que vous cherchez'
                  : 'Commencez par publier votre première annonce pour commencer à vendre'
                }
              </p>
              {(!searchTerm && selectedStatus === 'all') && (
                <Link
                  href="/publier"
                  className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Publier ma première annonce
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredAnnonces.map((annonce) => {
                const statusConfig = getStatusConfig(annonce.status);
                
                return (
                  <div 
                    key={annonce.id} 
                    className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-visible group"
                  >
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Image */}
                        <div className="flex-shrink-0">
                          <Link href={`/annonce/${annonce.id}`}>
                            <div className="relative w-full md:w-40 h-48 md:h-32 rounded-xl overflow-hidden bg-gray-100 cursor-pointer">
                              <Image
                                src={annonce.picture || '/images/placeholder.svg'}
                                alt={annonce.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = '/images/placeholder.svg';
                                }}
                              />
                              {/* Overlay au hover */}
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                            </div>
                          </Link>
                        </div>
                        
                        {/* Contenu principal */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-4">
                            {/* Titre et statut */}
                            <div className="flex-1 pr-4">
                              <div className="flex items-start justify-between mb-2">
                                <Link 
                                  href={`/annonce/${annonce.id}`}
                                  className="block flex-1"
                                >
                                  <h3 className="text-xl font-semibold text-gray-900 hover:text-primary-600 transition-colors duration-200 line-clamp-2 cursor-pointer">
                                    {annonce.title}
                                  </h3>
                                </Link>
                                {statusConfig.badge}
                              </div>
                              
                              <div className="text-3xl font-bold text-primary-600 mb-3">
                                {annonce.price.toLocaleString('fr-FR')} FCFA
                              </div>
                            </div>
                            
                            {/* Menu d'actions - Positionné en dehors du overflow */}
                            <div className="relative flex-shrink-0 ml-4">
                              <button
                                onClick={() => setShowDropdown(showDropdown === annonce.id ? null : annonce.id)}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                              >
                                <MoreVertical className="w-5 h-5" />
                              </button>
                              
                              {showDropdown === annonce.id && (
                                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 z-[100] py-2 animate-in slide-in-from-top-2 duration-200">
                                  <Link
                                    href={`/annonce/${annonce.id}`}
                                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                    onClick={() => setShowDropdown(null)}
                                  >
                                    <ExternalLink className="w-4 h-4 mr-3 text-gray-400" />
                                    <div>
                                      <div className="font-medium">Voir l'annonce</div>
                                      <div className="text-xs text-gray-500">Affichage public</div>
                                    </div>
                                  </Link>
                                  
                                  <Link
                                    href={`/publier/modifier/${annonce.id}`}
                                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                    onClick={() => setShowDropdown(null)}
                                  >
                                    <Edit3 className="w-4 h-4 mr-3 text-gray-400" />
                                    <div>
                                      <div className="font-medium">Modifier</div>
                                      <div className="text-xs text-gray-500">Éditer les détails</div>
                                    </div>
                                  </Link>
                                  
                                  <button
                                    onClick={() => handleToggleStatus(annonce.id, annonce.status)}
                                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                  >
                                    {statusConfig.icon && <div className="mr-3">{statusConfig.icon}</div>}
                                    <div className="text-left">
                                      <div className="font-medium">
                                        {annonce.status === 'active' ? 'Désactiver' : 'Activer'}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {annonce.status === 'active' ? 'Masquer de la recherche' : 'Rendre visible'}
                                      </div>
                                    </div>
                                  </button>
                                  
                                  <div className="border-t border-gray-100 my-2"></div>
                                  
                                  <button
                                    onClick={() => handleDeleteAnnonce(annonce.id)}
                                    className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4 mr-3" />
                                    <div className="text-left">
                                      <div className="font-medium">Supprimer</div>
                                      <div className="text-xs text-red-400">Action irréversible</div>
                                    </div>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Description */}
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                            {annonce.description}
                          </p>
                          
                          {/* Métadonnées */}
                          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                              <span className="font-medium">{annonce.location}</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                              <span>Publié {formatDate(annonce.createdAt)}</span>
                            </div>
                          </div>
                          
                          {/* Actions rapides - Masquées sur mobile */}
                          <div className="hidden md:flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                            <div className="flex items-center space-x-4">
                              <Link
                                href={`/annonce/${annonce.id}`}
                                className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
                              >
                                <ExternalLink className="w-4 h-4 mr-1.5" />
                                Voir l'annonce
                              </Link>
                              <Link
                                href={`/publier/modifier/${annonce.id}`}
                                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-700 font-medium transition-colors"
                              >
                                <Edit3 className="w-4 h-4 mr-1.5" />
                                Modifier
                              </Link>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleToggleStatus(annonce.id, annonce.status)}
                                className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                  annonce.status === 'active'
                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                              >
                                {statusConfig.icon && <div className="mr-1.5">{statusConfig.icon}</div>}
                                {annonce.status === 'active' ? 'Désactiver' : 'Activer'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </AccountLayout>
  );
} 