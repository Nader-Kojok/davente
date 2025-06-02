'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Phone, 
  Edit3, 
  Save, 
  X, 
  Mail, 
  MapPin, 
  Calendar,
  User,
  Briefcase,
  Globe,
  Shield,
  Eye,
  EyeOff,
  PartyPopper,
  Gift,
  Star
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AccountLayout from '@/components/AccountLayout';
import TextInput from '@/components/ui/TextInput';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import Checkbox from '@/components/ui/Checkbox';
import ImageUpload from '@/components/ui/ImageUpload';
import AccountTypeBadge from '@/components/ui/AccountTypeBadge';
import toast from 'react-hot-toast';

// Options pour les listes déroulantes
const genderOptions = [
  { value: 'homme', label: 'Homme' },
  { value: 'femme', label: 'Femme' },
  { value: 'autre', label: 'Autre' },
];

const locationOptions = [
  { value: 'Dakar', label: 'Dakar' },
  { value: 'Thiès', label: 'Thiès' },
  { value: 'Saint-Louis', label: 'Saint-Louis' },
  { value: 'Kaolack', label: 'Kaolack' },
  { value: 'Ziguinchor', label: 'Ziguinchor' },
  { value: 'Diourbel', label: 'Diourbel' },
  { value: 'Tambacounda', label: 'Tambacounda' },
  { value: 'Fatick', label: 'Fatick' },
  { value: 'Kolda', label: 'Kolda' },
  { value: 'Matam', label: 'Matam' },
  { value: 'Kaffrine', label: 'Kaffrine' },
  { value: 'Kédougou', label: 'Kédougou' },
  { value: 'Louga', label: 'Louga' },
  { value: 'Sédhiou', label: 'Sédhiou' },
];

const languageOptions = [
  { value: 'fr', label: 'Français' },
  { value: 'wo', label: 'Wolof' },
  { value: 'en', label: 'English' },
];

function ProfilContent() {
  const { user, isAuthenticated, refreshUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isWelcome = searchParams.get('welcome') === 'true';
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'personal' | 'contact' | 'preferences' | 'privacy'>('personal');
  const [showWelcome, setShowWelcome] = useState(isWelcome);
  
  const [formData, setFormData] = useState({
    // Informations personnelles
    name: '',
    email: '',
    mobile: '',
    picture: '',
    bio: '',
    location: '',
    address: '',
    dateOfBirth: '',
    gender: '',
    profession: '',
    company: '',
    website: '',
    
    // Préférences de contact
    showPhone: true,
    showEmail: false,
    allowSms: true,
    allowCalls: true,
    
    // Préférences de notification
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    
    // Métadonnées
    language: 'fr',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        mobile: user.mobile || '',
        picture: user.picture || '',
        bio: user.bio || '',
        location: user.location || '',
        address: user.address || '',
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
        gender: user.gender || '',
        profession: user.profession || '',
        company: user.company || '',
        website: user.website || '',
        showPhone: user.showPhone ?? true,
        showEmail: user.showEmail ?? false,
        allowSms: user.allowSms ?? true,
        allowCalls: user.allowCalls ?? true,
        emailNotifications: user.emailNotifications ?? true,
        smsNotifications: user.smsNotifications ?? true,
        pushNotifications: user.pushNotifications ?? true,
        marketingEmails: user.marketingEmails ?? false,
        language: user.language || 'fr',
      });
    }

    // Auto-hide welcome message after 5 seconds
    if (isWelcome) {
      const timer = setTimeout(() => {
        setShowWelcome(false);
        // Remove welcome parameter from URL
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, user, router, isWelcome]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleImageChange = (imageUrl: string) => {
    setFormData(prev => ({
      ...prev,
      picture: imageUrl
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const dataToSend = { ...formData };
      
      // Convertir la date de naissance en format ISO si elle existe
      if (dataToSend.dateOfBirth) {
        dataToSend.dateOfBirth = new Date(dataToSend.dateOfBirth).toISOString();
      }

      console.log('Sending data:', dataToSend);
      console.log('Picture URL being sent:', dataToSend.picture);
      console.log('Token:', localStorage.getItem('auth_token'));

      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(dataToSend)
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (response.ok) {
        const responseData = await response.json();
        console.log('Success response:', responseData);
        console.log('Updated user picture:', responseData.user.picture);
        toast.success('Profil mis à jour avec succès');
        setIsEditing(false);
        await refreshUser();
      } else {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        toast.error(errorData.error || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      toast.error(`Erreur de connexion au serveur: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        mobile: user.mobile || '',
        picture: user.picture || '',
        bio: user.bio || '',
        location: user.location || '',
        address: user.address || '',
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
        gender: user.gender || '',
        profession: user.profession || '',
        company: user.company || '',
        website: user.website || '',
        showPhone: user.showPhone ?? true,
        showEmail: user.showEmail ?? false,
        allowSms: user.allowSms ?? true,
        allowCalls: user.allowCalls ?? true,
        emailNotifications: user.emailNotifications ?? true,
        smsNotifications: user.smsNotifications ?? true,
        pushNotifications: user.pushNotifications ?? true,
        marketingEmails: user.marketingEmails ?? false,
        language: user.language || 'fr',
      });
    }
    setIsEditing(false);
  };



  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'personal', label: 'Informations personnelles', icon: User },
    { id: 'contact', label: 'Contact & Localisation', icon: MapPin },
    { id: 'preferences', label: 'Préférences', icon: Globe },
    { id: 'privacy', label: 'Confidentialité', icon: Shield },
  ];

  const renderWelcomeModal = () => {
    if (!showWelcome) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 text-center relative max-h-[90vh] overflow-y-auto">
          <button
            onClick={() => setShowWelcome(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <PartyPopper className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Bienvenue sur Grabi ! 🎉
            </h2>
            <p className="text-gray-600">
              Votre compte {user?.accountType === 'business' ? 'professionnel' : 'particulier'} a été créé avec succès
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center p-3 bg-green-50 rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <Star className="w-4 h-4 text-green-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-green-900">Profil créé</p>
                <p className="text-xs text-green-700">Votre profil est maintenant actif</p>
              </div>
            </div>

            <div className="flex items-center p-3 bg-blue-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <Gift className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-blue-900">Prêt à vendre</p>
                <p className="text-xs text-blue-700">Vous pouvez maintenant publier vos annonces</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Link
              href="/publier"
              className="block w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors"
              onClick={() => setShowWelcome(false)}
            >
              Publier ma première annonce
            </Link>
            <button
              onClick={() => setShowWelcome(false)}
              className="block w-full text-gray-600 py-2 px-4 rounded-lg font-medium hover:text-gray-800 transition-colors"
            >
              Explorer mon profil
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <AccountLayout 
      title="Mon profil" 
      description="Gérez vos informations personnelles et préférences"
    >
      {/* Actions en haut à droite */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mb-6 sm:mb-8 gap-4">
        <div></div> {/* Spacer */}
        <div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Modifier
            </button>
          ) : (
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleCancel}
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                disabled={isLoading}
              >
                <X className="w-4 h-4 mr-2" />
                Annuler
              </button>
              <button
                onClick={handleSave}
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                disabled={isLoading}
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 px-4 sm:px-6 py-6 sm:py-8 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="relative flex-shrink-0">
              {isEditing ? (
                <ImageUpload
                  currentImage={formData.picture}
                  onImageChange={handleImageChange}
                  size="lg"
                  shape="circle"
                  disabled={isLoading}
                />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-full flex items-center justify-center overflow-hidden mx-auto sm:mx-0 shadow-md border-3 border-white ring-2 ring-indigo-100">
                  {formData.picture ? (
                    <Image
                      src={formData.picture}
                      alt="Photo de profil"
                      width={96}
                      height={96}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover"
                    />
                  ) : (
                    <Image
                      src="/default-avatar.svg"
                      alt="Avatar par défaut"
                      width={60}
                      height={60}
                      className="opacity-50"
                    />
                  )}
                </div>
              )}
            </div>
            <div className="text-gray-800 flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-3 mb-2">
                <h2 className="text-2xl sm:text-3xl font-bold truncate text-slate-800">{formData.name}</h2>
                {user?.accountType && (
                  <AccountTypeBadge 
                    accountType={user.accountType} 
                    size="md"
                  />
                )}
              </div>
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-1 sm:space-y-0 sm:space-x-4 mt-2">
                {formData.location && (
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1 flex-shrink-0 text-indigo-500" />
                    <span className="text-slate-600 truncate">{formData.location}</span>
                  </div>
                )}
                {formData.profession && (
                  <div className="flex items-center">
                    <Briefcase className="w-4 h-4 mr-1 flex-shrink-0 text-indigo-500" />
                    <span className="text-slate-600 truncate">{formData.profession}</span>
                  </div>
                )}
              </div>
              {formData.bio && (
                <p className="text-slate-600 mt-2 text-sm sm:text-base leading-relaxed">{formData.bio}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto px-4 sm:px-6 scrollbar-hide">
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`
                    flex items-center py-4 px-2 sm:px-4 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap flex-shrink-0
                    ${activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                    ${index > 0 ? 'ml-4 sm:ml-8' : ''}
                  `}
                >
                  <Icon className="w-4 h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">
                    {tab.label.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 sm:p-6">
          {/* Onglet Informations personnelles */}
          {activeTab === 'personal' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Informations personnelles
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Nom complet */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom complet *
                  </label>
                  {isEditing ? (
                    <TextInput
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Votre nom complet"
                      disabled={isLoading}
                      required
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                      {formData.name}
                    </div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse email
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <TextInput
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10"
                        placeholder="votre@email.com"
                        disabled={isLoading}
                      />
                    </div>
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg flex items-center">
                      <Mail className="h-5 w-5 text-gray-400 mr-2" />
                      {formData.email || 'Non renseigné'}
                    </div>
                  )}
                </div>

                {/* Date de naissance */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de naissance
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <TextInput
                        name="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        className="pl-10"
                        disabled={isLoading}
                      />
                    </div>
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg flex items-center">
                      <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                      {formData.dateOfBirth 
                        ? new Date(formData.dateOfBirth).toLocaleDateString('fr-FR')
                        : 'Non renseigné'
                      }
                    </div>
                  )}
                </div>

                {/* Genre */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Genre
                  </label>
                  {isEditing ? (
                    <Select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      options={genderOptions}
                      placeholder="Sélectionner votre genre"
                      disabled={isLoading}
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                      {genderOptions.find(g => g.value === formData.gender)?.label || 'Non renseigné'}
                    </div>
                  )}
                </div>

                {/* Profession */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profession
                  </label>
                  {isEditing ? (
                    <TextInput
                      name="profession"
                      value={formData.profession}
                      onChange={handleInputChange}
                      placeholder="Votre profession"
                      disabled={isLoading}
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                      {formData.profession || 'Non renseigné'}
                    </div>
                  )}
                </div>

                {/* Entreprise */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Entreprise/Organisation
                  </label>
                  {isEditing ? (
                    <TextInput
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="Nom de votre entreprise"
                      disabled={isLoading}
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                      {formData.company || 'Non renseigné'}
                    </div>
                  )}
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Biographie
                </label>
                {isEditing ? (
                  <Textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Parlez-nous de vous..."
                    rows={4}
                    maxLength={500}
                    disabled={isLoading}
                  />
                ) : (
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg min-h-[100px]">
                    {formData.bio || 'Aucune biographie renseignée'}
                  </div>
                )}
              </div>

              {/* Site web */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Site web
                </label>
                {isEditing ? (
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <Globe className="h-5 w-5 text-gray-400" />
                    </div>
                    <TextInput
                      name="website"
                      type="url"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="pl-10"
                      placeholder="https://votre-site.com"
                      disabled={isLoading}
                    />
                  </div>
                ) : (
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg flex items-center">
                    <Globe className="h-5 w-5 text-gray-400 mr-2" />
                    {formData.website ? (
                      <a 
                        href={formData.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700"
                      >
                        {formData.website}
                      </a>
                    ) : (
                      'Non renseigné'
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Onglet Contact & Localisation */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Contact & Localisation
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Téléphone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Numéro de téléphone *
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <TextInput
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleInputChange}
                        className="pl-10"
                        placeholder="+221 77 123 45 67"
                        disabled={isLoading}
                        required
                      />
                    </div>
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg flex items-center">
                      <Phone className="h-5 w-5 text-gray-400 mr-2" />
                      {formData.mobile}
                    </div>
                  )}
                </div>

                {/* Ville/Région */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ville/Région
                  </label>
                  {isEditing ? (
                    <Select
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      options={locationOptions}
                      placeholder="Sélectionner votre ville"
                      disabled={isLoading}
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                      {formData.location || 'Non renseigné'}
                    </div>
                  )}
                </div>
              </div>

              {/* Adresse complète */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse complète (optionnelle)
                </label>
                {isEditing ? (
                  <Textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Votre adresse complète..."
                    rows={3}
                    disabled={isLoading}
                  />
                ) : (
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg min-h-[80px]">
                    {formData.address || 'Non renseigné'}
                  </div>
                )}
              </div>

              {/* Préférences de contact */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">
                  Préférences de contact
                </h4>
                <div className="space-y-4">
                  <Checkbox
                    name="allowCalls"
                    checked={formData.allowCalls}
                    onChange={(e) => handleCheckboxChange('allowCalls', e.target.checked)}
                    label="Accepter les appels téléphoniques"
                    description="Les acheteurs pourront vous appeler directement"
                    disabled={!isEditing || isLoading}
                  />
                  <Checkbox
                    name="allowSms"
                    checked={formData.allowSms}
                    onChange={(e) => handleCheckboxChange('allowSms', e.target.checked)}
                    label="Accepter les SMS"
                    description="Recevoir des messages par SMS"
                    disabled={!isEditing || isLoading}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Onglet Préférences */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Préférences
              </h3>

              {/* Langue */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Langue préférée
                </label>
                {isEditing ? (
                  <Select
                    name="language"
                    value={formData.language}
                    onChange={handleInputChange}
                    options={languageOptions}
                    disabled={isLoading}
                  />
                ) : (
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                    {languageOptions.find(l => l.value === formData.language)?.label || 'Français'}
                  </div>
                )}
              </div>

              {/* Notifications */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">
                  Notifications
                </h4>
                <div className="space-y-4">
                  <Checkbox
                    name="emailNotifications"
                    checked={formData.emailNotifications}
                    onChange={(e) => handleCheckboxChange('emailNotifications', e.target.checked)}
                    label="Notifications par email"
                    description="Recevoir des notifications importantes par email"
                    disabled={!isEditing || isLoading}
                  />
                  <Checkbox
                    name="smsNotifications"
                    checked={formData.smsNotifications}
                    onChange={(e) => handleCheckboxChange('smsNotifications', e.target.checked)}
                    label="Notifications par SMS"
                    description="Recevoir des notifications par SMS"
                    disabled={!isEditing || isLoading}
                  />
                  <Checkbox
                    name="pushNotifications"
                    checked={formData.pushNotifications}
                    onChange={(e) => handleCheckboxChange('pushNotifications', e.target.checked)}
                    label="Notifications push"
                    description="Recevoir des notifications sur votre appareil"
                    disabled={!isEditing || isLoading}
                  />
                  <Checkbox
                    name="marketingEmails"
                    checked={formData.marketingEmails}
                    onChange={(e) => handleCheckboxChange('marketingEmails', e.target.checked)}
                    label="Emails marketing"
                    description="Recevoir des offres et promotions par email"
                    disabled={!isEditing || isLoading}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Onglet Confidentialité */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Confidentialité
              </h3>

              <div className="space-y-6">
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">
                    Visibilité des informations
                  </h4>
                  <div className="space-y-4">
                    <Checkbox
                      name="showPhone"
                      checked={formData.showPhone}
                      onChange={(e) => handleCheckboxChange('showPhone', e.target.checked)}
                      label="Afficher mon numéro de téléphone"
                      description="Votre numéro sera visible sur vos annonces"
                      disabled={!isEditing || isLoading}
                    />
                    <Checkbox
                      name="showEmail"
                      checked={formData.showEmail}
                      onChange={(e) => handleCheckboxChange('showEmail', e.target.checked)}
                      label="Afficher mon adresse email"
                      description="Votre email sera visible sur votre profil public"
                      disabled={!isEditing || isLoading}
                    />
                  </div>
                </div>

                {/* Informations de vérification */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">
                    Statut de vérification
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <Phone className="w-5 h-5 text-gray-400 mr-3" />
                        <span className="text-sm font-medium">Téléphone vérifié</span>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.isPhoneVerified 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {user.isPhoneVerified ? 'Vérifié' : 'En attente'}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <Mail className="w-5 h-5 text-gray-400 mr-3" />
                        <span className="text-sm font-medium">Email vérifié</span>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.isEmailVerified 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {user.isEmailVerified ? 'Vérifié' : 'En attente'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Membre depuis */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-2">
                    Informations du compte
                  </h4>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Membre depuis</span>
                      <span className="text-sm text-gray-600">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : 'Non disponible'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/mes-annonces"
          className="bg-white p-6 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900 group-hover:text-primary-700">
                Mes annonces
              </h3>
              <p className="text-sm text-gray-500">
                Gérer vos annonces publiées
              </p>
            </div>
            <div className="text-primary-600 group-hover:text-primary-700">
              →
            </div>
          </div>
        </Link>

        <Link
          href="/parametres"
          className="bg-white p-6 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900 group-hover:text-primary-700">
                Paramètres
              </h3>
              <p className="text-sm text-gray-500">
                Configurer votre compte
              </p>
            </div>
            <div className="text-primary-600 group-hover:text-primary-700">
              →
            </div>
          </div>
        </Link>
      </div>

      {renderWelcomeModal()}
    </AccountLayout>
  );
}

function ProfilPageFallback() {
  return (
    <AccountLayout title="Profil">
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    </AccountLayout>
  );
}

export default function ProfilPage() {
  return (
    <Suspense fallback={<ProfilPageFallback />}>
      <ProfilContent />
    </Suspense>
  );
} 