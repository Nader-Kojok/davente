// src/app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Phone, ChevronLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import TextInput from '@/components/ui/TextInput';
import PasswordInput from '@/components/ui/PasswordInput';
import Checkbox from '@/components/ui/Checkbox';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const countryCode = '+221';
  
  const { login } = useAuth();
  const router = useRouter();

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setPhoneNumber(value);
    setIsValid(value.length === 9);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (phoneNumber.length !== 9) {
      toast.error('Le numéro doit contenir 9 chiffres');
      return;
    }
    
    if (!password) {
      toast.error('Le mot de passe est requis');
      return;
    }

    setIsLoading(true);
    
    try {
      const fullPhoneNumber = `${countryCode}${phoneNumber}`;
      const result = await login(fullPhoneNumber, password);
      
      if (result.success) {
        toast.success('Connexion réussie !');
        router.push('/'); // Redirect to homepage
      } else {
        toast.error(result.error || 'Erreur de connexion');
      }
    } catch (_error) {
      setIsLoading(false);
      toast.error('Erreur de connexion au serveur');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md md:max-w-lg lg:max-w-xl mx-auto p-6">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Retour
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

        {/* Login Form */}
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <h1 className="h2 text-center mb-4">
            Connexion
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Numéro de téléphone
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <span className="ml-4 text-[#E00201] font-medium">{countryCode}</span>
                </div>
                <TextInput
                  type="tel"
                  id="phone"
                  name="phone"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  className={`form-input pl-24 ${isValid ? '' : 'border-red-500'}`}
                  placeholder="77 123 45 67"
                  maxLength={9}
                  disabled={isLoading}
                />
              </div>
              {!isValid && phoneNumber.length > 0 && (
                <p className="mt-2 text-sm text-red-600">
                  Le numéro doit contenir 9 chiffres
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Mot de passe
              </label>
              <PasswordInput
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Entrez votre mot de passe"
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center justify-between">
              <Checkbox
                id="remember-me"
                label="Se souvenir de moi"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
              />
              <Link href="/forgot-password" className="text-sm text-primary-500 hover:text-primary-600">
                Mot de passe oublié ?
              </Link>
            </div>

            <button
              type="submit"
              className={`btn-primary w-full flex justify-center items-center ${(!isValid || !password || isLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!isValid || !password || isLoading}
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">
                ou continuer avec
              </span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3">
            <button
              type="button"
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

          {/* Register Link */}
          <p className="mt-8 text-center text-sm text-gray-600">
            Pas encore de compte ?{' '}
            <Link
              href="/register"
              className="text-primary-500 hover:text-primary-600 transition-colors"
            >
              S'inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
