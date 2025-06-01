// src/app/register/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Phone, 
  ChevronLeft, 
  ChevronRight, 
  User, 
  Building2, 
  Check, 
  Mail, 
  MapPin, 
  Briefcase,
  Globe,
  Calendar,
  Users
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import TextInput from '@/components/ui/TextInput';
import PasswordInput from '@/components/ui/PasswordInput';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import toast from 'react-hot-toast';

interface FormData {
  // Étape 1: Type de compte
  accountType: 'individual' | 'business';
  
  // Étape 2: Informations de base
  name: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
  
  // Étape 3: Informations personnelles/professionnelles
  location: string;
  profession: string;
  company: string;
  website: string;
  bio: string;
  dateOfBirth: string;
  gender: string;
  
  // Étape 4: Préférences
  language: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
}

const SENEGAL_REGIONS = [
  'Dakar', 'Thiès', 'Saint-Louis', 'Diourbel', 'Louga', 'Fatick',
  'Kaolack', 'Kolda', 'Ziguinchor', 'Tambacounda', 'Kaffrine',
  'Kédougou', 'Matam', 'Sédhiou'
];

const LANGUAGES = [
  { value: 'fr', label: 'Français' },
  { value: 'wo', label: 'Wolof' },
  { value: 'en', label: 'English' }
];

const GENDERS = [
  { value: 'homme', label: 'Homme' },
  { value: 'femme', label: 'Femme' },
  { value: 'autre', label: 'Autre' }
];

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    accountType: 'individual',
    name: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    location: '',
    profession: '',
    company: '',
    website: '',
    bio: '',
    dateOfBirth: '',
    gender: '',
    language: 'fr',
    emailNotifications: true,
    smsNotifications: true,
    marketingEmails: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const countryCode = '+221';
  
  const { register } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let processedValue: any = value;

    if (type === 'checkbox') {
      processedValue = (e.target as HTMLInputElement).checked;
    } else if (name === 'phoneNumber') {
      processedValue = value.replace(/\D/g, '');
    }

    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        // Type de compte - toujours valide car valeur par défaut
        break;
        
      case 2:
        if (!formData.name.trim()) {
          newErrors.name = 'Le nom est requis';
        } else if (formData.name.length < 2) {
          newErrors.name = 'Le nom doit contenir au moins 2 caractères';
        }

        if (!formData.phoneNumber) {
          newErrors.phoneNumber = 'Le numéro de téléphone est requis';
        } else if (formData.phoneNumber.length !== 9) {
          newErrors.phoneNumber = 'Le numéro doit contenir 9 chiffres';
        }

        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = 'Format d\'email invalide';
        }

        if (!formData.password) {
          newErrors.password = 'Le mot de passe est requis';
        } else if (formData.password.length < 6) {
          newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
        }

        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
        }
        break;

      case 3:
        if (formData.accountType === 'business') {
          if (!formData.company.trim()) {
            newErrors.company = 'Le nom de l\'entreprise est requis pour un compte business';
          }
        }

        if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
          newErrors.website = 'L\'URL doit commencer par http:// ou https://';
        }
        break;

      case 4:
        // Préférences - pas de validation requise
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsLoading(true);

    try {
      const fullPhoneNumber = `${countryCode}${formData.phoneNumber}`;
      
      // Préparer les données pour l'API
      const registrationData = {
        mobile: fullPhoneNumber,
        password: formData.password,
        name: formData.name,
        picture: '',
        accountType: formData.accountType,
        email: formData.email || null,
        location: formData.location || null,
        profession: formData.profession || null,
        company: formData.company || null,
        website: formData.website || null,
        bio: formData.bio || null,
        dateOfBirth: formData.dateOfBirth || null,
        gender: formData.gender || null,
        language: formData.language,
        emailNotifications: formData.emailNotifications,
        smsNotifications: formData.smsNotifications,
        marketingEmails: formData.marketingEmails
      };

      const result = await register(
        registrationData.mobile,
        registrationData.password,
        registrationData.name,
        registrationData.picture
      );

      if (result.success) {
        // Mettre à jour le profil avec les informations supplémentaires
        const token = localStorage.getItem('auth_token');
        if (token) {
          await fetch('/api/user/profile', {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(registrationData)
          });
        }

        toast.success('Compte créé avec succès ! Bienvenue sur Grabi 🎉');
        router.push('/profil?welcome=true');
      } else {
        toast.error(result.error || 'Erreur lors de la création du compte');
      }
    } catch (error) {
      toast.error('Erreur de connexion au serveur');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step <= currentStep
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-500'
            }`}
          >
            {step < currentStep ? <Check className="w-4 h-4" /> : step}
          </div>
          {step < 4 && (
            <div
              className={`w-12 h-0.5 mx-2 ${
                step < currentStep ? 'bg-primary-600' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Quel type de compte souhaitez-vous créer ?
        </h2>
        <p className="text-gray-600">
          Choisissez le type de compte qui correspond le mieux à vos besoins
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => setFormData(prev => ({ ...prev, accountType: 'individual' }))}
          className={`p-6 border-2 rounded-lg text-left transition-all ${
            formData.accountType === 'individual'
              ? 'border-primary-600 bg-primary-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center mb-4">
            <User className="w-8 h-8 text-primary-600 mr-3" />
            <h3 className="text-lg font-semibold">Particulier</h3>
          </div>
          <p className="text-gray-600 text-sm">
            Pour vendre ou acheter des articles personnels, véhicules, immobilier, etc.
          </p>
          <ul className="mt-3 text-sm text-gray-500 space-y-1">
            <li>• Vente d'articles personnels</li>
            <li>• Interface simplifiée</li>
            <li>• Profil personnel</li>
          </ul>
        </button>

        <button
          type="button"
          onClick={() => setFormData(prev => ({ ...prev, accountType: 'business' }))}
          className={`p-6 border-2 rounded-lg text-left transition-all ${
            formData.accountType === 'business'
              ? 'border-primary-600 bg-primary-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center mb-4">
            <Building2 className="w-8 h-8 text-primary-600 mr-3" />
            <h3 className="text-lg font-semibold">Professionnel</h3>
          </div>
          <p className="text-gray-600 text-sm">
            Pour les entreprises, commerces et professionnels qui vendent régulièrement.
          </p>
          <ul className="mt-3 text-sm text-gray-500 space-y-1">
            <li>• Outils professionnels</li>
            <li>• Statistiques avancées</li>
            <li>• Profil entreprise</li>
          </ul>
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Informations de base
        </h2>
        <p className="text-gray-600">
          Ces informations sont nécessaires pour créer votre compte
        </p>
      </div>

      <div className="space-y-4">
        <TextInput
          label="Nom complet"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder={formData.accountType === 'business' ? 'Nom du responsable' : 'Votre nom complet'}
          error={errors.name}
          disabled={isLoading}
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Numéro de téléphone *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4">
              <Phone className="h-5 w-5 text-gray-400" />
              <span className="ml-4 text-primary-600 font-medium">{countryCode}</span>
            </div>
            <TextInput
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="pl-24"
              placeholder="77 123 45 67"
              maxLength={9}
              error={errors.phoneNumber}
              disabled={isLoading}
            />
          </div>
        </div>

        <TextInput
          label="Email (optionnel)"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="votre@email.com"
          error={errors.email}
          disabled={isLoading}
        />

        <PasswordInput
          label="Mot de passe"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          error={errors.password}
          disabled={isLoading}
        />

        <PasswordInput
          label="Confirmer le mot de passe"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="••••••••"
          error={errors.confirmPassword}
          disabled={isLoading}
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {formData.accountType === 'business' ? 'Informations professionnelles' : 'Informations personnelles'}
        </h2>
        <p className="text-gray-600">
          Ces informations nous aident à personnaliser votre expérience
        </p>
      </div>

      <div className="space-y-4">
        <Select
          label="Région"
          name="location"
          value={formData.location}
          onChange={handleChange}
          options={SENEGAL_REGIONS.map(region => ({ value: region, label: region }))}
          placeholder="Sélectionnez votre région"
          error={errors.location}
        />

        {formData.accountType === 'business' ? (
          <>
            <TextInput
              label="Nom de l'entreprise"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Nom de votre entreprise"
              error={errors.company}
              required
            />

            <TextInput
              label="Secteur d'activité"
              name="profession"
              value={formData.profession}
              onChange={handleChange}
              placeholder="Ex: Commerce, Services, Artisanat..."
              error={errors.profession}
            />

            <TextInput
              label="Site web (optionnel)"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://www.votre-site.com"
              error={errors.website}
            />

            <Textarea
              label="Description de l'entreprise"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Décrivez votre entreprise et vos services..."
              rows={3}
              maxLength={500}
            />
          </>
        ) : (
          <>
            <TextInput
              label="Profession (optionnel)"
              name="profession"
              value={formData.profession}
              onChange={handleChange}
              placeholder="Votre profession"
              error={errors.profession}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput
                label="Date de naissance (optionnel)"
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                error={errors.dateOfBirth}
              />

              <Select
                label="Genre (optionnel)"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                options={GENDERS}
                placeholder="Sélectionnez"
                error={errors.gender}
              />
            </div>

            <Textarea
              label="Bio (optionnel)"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Parlez-nous un peu de vous..."
              rows={3}
              maxLength={300}
            />
          </>
        )}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Préférences
        </h2>
        <p className="text-gray-600">
          Personnalisez votre expérience sur Grabi
        </p>
      </div>

      <div className="space-y-6">
        <Select
          label="Langue préférée"
          name="language"
          value={formData.language}
          onChange={handleChange}
          options={LANGUAGES}
        />

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Notifications</h3>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="emailNotifications"
                checked={formData.emailNotifications}
                onChange={handleChange}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-3 text-sm text-gray-700">
                Recevoir les notifications par email
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="smsNotifications"
                checked={formData.smsNotifications}
                onChange={handleChange}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-3 text-sm text-gray-700">
                Recevoir les notifications par SMS
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="marketingEmails"
                checked={formData.marketingEmails}
                onChange={handleChange}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-3 text-sm text-gray-700">
                Recevoir les offres et promotions par email
              </span>
            </label>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <Users className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
            <div>
              <h4 className="text-sm font-medium text-blue-900">
                Bienvenue dans la communauté Grabi !
              </h4>
              <p className="text-sm text-blue-700 mt-1">
                Vous rejoignez des milliers d'utilisateurs qui achètent et vendent en toute confiance au Sénégal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-2xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Retour
          </Link>

          <Link href="/">
            <Image
              src="/logo.svg"
              alt="Grabi Logo"
              width={120}
              height={40}
              priority
            />
          </Link>

          <div className="w-16" /> {/* Spacer for centering */}
        </div>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Form Container */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={prevStep}
              className={`flex items-center px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors ${
                currentStep === 1 ? 'invisible' : ''
              }`}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Précédent
            </button>

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Suivant
                <ChevronRight className="w-4 h-4 ml-2" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex items-center px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Création...' : 'Créer mon compte'}
                {!isLoading && <Check className="w-4 h-4 ml-2" />}
              </button>
            )}
          </div>
        </div>

        {/* Login Link */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Déjà inscrit ?{' '}
          <Link
            href="/login"
            className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
