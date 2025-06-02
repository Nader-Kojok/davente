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
  // Étape 1: Méthode d'inscription
  signupMethod: 'email' | 'phone';
  
  // Étape 2: Informations de base
  name: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
  
  // Étape 3: Informations supplémentaires (optionnel)
  location: string;
  profession: string;
  bio: string;
  
  // Préférences
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

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    signupMethod: 'email',
    name: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    location: '',
    profession: '',
    bio: '',
    language: 'fr',
    emailNotifications: true,
    smsNotifications: true,
    marketingEmails: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const countryCode = '+221';
  
  const { signUpWithEmail, signUpWithPhone, signInWithGoogle, signInWithFacebook, updateProfile } = useAuth();
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
        // Méthode d'inscription - toujours valide car valeur par défaut
        break;
        
      case 2:
        if (!formData.name.trim()) {
          newErrors.name = 'Le nom est requis';
        } else if (formData.name.length < 2) {
          newErrors.name = 'Le nom doit contenir au moins 2 caractères';
        }

        if (formData.signupMethod === 'phone') {
          if (!formData.phoneNumber) {
            newErrors.phoneNumber = 'Le numéro de téléphone est requis';
          } else if (formData.phoneNumber.length !== 9) {
            newErrors.phoneNumber = 'Le numéro doit contenir 9 chiffres';
          }
        } else if (formData.signupMethod === 'email') {
          if (!formData.email) {
            newErrors.email = 'L\'email est requis';
          } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Format d\'email invalide';
          }
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
        // Informations supplémentaires - toutes optionnelles
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsLoading(true);

    try {
      let result;
      
      if (formData.signupMethod === 'phone') {
        const fullPhoneNumber = `${countryCode}${formData.phoneNumber}`;
        result = await signUpWithPhone(fullPhoneNumber, formData.password, formData.name);
      } else {
        result = await signUpWithEmail(formData.email, formData.password, formData.name);
      }

      if (result.success) {
        // Si l'inscription réussit, mettre à jour le profil avec les informations supplémentaires
        if (formData.location || formData.profession || formData.bio) {
          const profileUpdate = {
            ...(formData.location && { location: formData.location }),
            ...(formData.profession && { profession: formData.profession }),
            ...(formData.bio && { bio: formData.bio }),
            // Ajouter les préférences si nécessaire
            language: formData.language
          };

          await updateProfile(profileUpdate);
        }

        if (result.error) {
          // Cas où l'utilisateur doit vérifier son email/téléphone
          toast.success(result.error);
          router.push('/login?message=check-email');
        } else {
          toast.success('Compte créé avec succès ! Bienvenue sur Grabi 🎉');
          router.push('/');
        }
      } else {
        toast.error(result.error || 'Erreur lors de la création du compte');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Erreur de connexion au serveur');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithGoogle();
      if (!result.success && result.error) {
        toast.error(result.error);
      }
      // Pour OAuth, la redirection se fait automatiquement
    } catch (error) {
      toast.error('Erreur de connexion avec Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookSignUp = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithFacebook();
      if (!result.success && result.error) {
        toast.error(result.error);
      }
      // Pour OAuth, la redirection se fait automatiquement
    } catch (error) {
      toast.error('Erreur de connexion avec Facebook');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
              step <= currentStep
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {step < currentStep ? <Check className="w-5 h-5" /> : step}
          </div>
          {step < 3 && (
            <div
              className={`w-16 h-1 mx-2 ${
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
          Comment souhaitez-vous vous inscrire ?
        </h2>
        <p className="text-gray-600">
          Choisissez votre méthode d'inscription préférée
        </p>
      </div>

      {/* Signup Method Toggle */}
      <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
        <button
          type="button"
          onClick={() => setFormData(prev => ({ ...prev, signupMethod: 'email' }))}
          className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center ${
            formData.signupMethod === 'email'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Mail className="w-4 h-4 mr-2" />
          Email
        </button>
        <button
          type="button"
          onClick={() => setFormData(prev => ({ ...prev, signupMethod: 'phone' }))}
          className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center ${
            formData.signupMethod === 'phone'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Phone className="w-4 h-4 mr-2" />
          Téléphone
        </button>
      </div>

      {/* Social Signup Options */}
      <div className="space-y-3">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">
              ou continuer avec
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignUp}
          className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          disabled={isLoading}
        >
          <Image
            src="/google.svg"
            alt="Google"
            width={20}
            height={20}
            className="mr-3"
          />
          Continuer avec Google
        </button>

        <button
          type="button"
          onClick={handleFacebookSignUp}
          className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          disabled={isLoading}
        >
          <Image
            src="/facebook.svg"
            alt="Facebook"
            width={20}
            height={20}
            className="mr-3"
          />
          Continuer avec Facebook
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
          placeholder="Votre nom complet"
          error={errors.name}
          disabled={isLoading}
          required
        />

        {formData.signupMethod === 'phone' ? (
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
        ) : (
          <TextInput
            label="Adresse email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="votre@email.com"
            error={errors.email}
            disabled={isLoading}
            required
          />
        )}

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
          Informations supplémentaires
        </h2>
        <p className="text-gray-600">
          Ces informations nous aident à personnaliser votre expérience (optionnel)
        </p>
      </div>

      <div className="space-y-4">
        <Select
          label="Région (optionnel)"
          name="location"
          value={formData.location}
          onChange={handleChange}
          options={SENEGAL_REGIONS.map(region => ({ value: region, label: region }))}
          placeholder="Sélectionnez votre région"
          error={errors.location}
        />

        <TextInput
          label="Profession (optionnel)"
          name="profession"
          value={formData.profession}
          onChange={handleChange}
          placeholder="Votre profession"
          error={errors.profession}
        />

        <Textarea
          label="Bio (optionnel)"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Parlez-nous un peu de vous..."
          rows={3}
          maxLength={300}
        />

        <Select
          label="Langue préférée"
          name="language"
          value={formData.language}
          onChange={handleChange}
          options={LANGUAGES}
        />

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Préférences de notification</h3>
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
                Recevoir les offres et promotions
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md md:max-w-lg lg:max-w-xl mx-auto p-6">
        {/* Back Button */}
        <Link
          href="/login"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Retour à la connexion
        </Link>

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <Image
              src="/logo.svg"
              alt="Grabi Logo"
              width={120}
              height={40}
              className="mx-auto"
              priority
            />
          </Link>
        </div>

        {/* Form Container */}
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <h1 className="h2 text-center mb-8">
            Créer un compte
          </h1>

          {/* Step Indicator */}
          {renderStepIndicator()}

          {/* Step Content */}
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                disabled={isLoading}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Précédent
              </button>
            )}

            <div className="ml-auto">
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="btn-primary flex items-center"
                  disabled={isLoading}
                >
                  Suivant
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className={`btn-primary flex items-center ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? 'Création...' : 'Créer mon compte'}
                </button>
              )}
            </div>
          </div>

          {/* Login Link */}
          <p className="mt-8 text-center text-sm text-gray-600">
            Déjà un compte ?{' '}
            <Link
              href="/login"
              className="text-primary-500 hover:text-primary-600 transition-colors"
            >
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
