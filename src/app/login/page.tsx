'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Phone, ChevronLeft } from 'lucide-react';

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isValid, setIsValid] = useState(true);
  const countryCode = '+221';

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setPhoneNumber(value);
    setIsValid(value.length === 9);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length === 9) {
      // Handle phone number submission with country code
      console.log('Phone number submitted:', `${countryCode}${phoneNumber}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto p-6">
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
              alt="Davente Logo"
              width={120}
              height={40}
              className="mx-auto"
              priority
            />
          </Link>
        </div>

        {/* Login Form */}
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
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
                  <span className="ml-4 text-orange-500 font-medium">{countryCode}</span>
                </div>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  className={`block w-full pl-24 pr-4 py-3 border ${isValid ? 'border-gray-300' : 'border-red-500'} rounded-lg focus:ring-2 focus:ring-[#EC5A12] focus:ring-opacity-50 focus:border-[#EC5A12] transition-colors`}
                  placeholder="77 123 45 67"
                  maxLength={9}
                />
              </div>
              {!isValid && phoneNumber.length > 0 && (
                <p className="mt-2 text-sm text-red-600">
                  Le numéro doit contenir 9 chiffres
                </p>
              )}
            </div>

            <button
              type="submit"
              className={`w-full bg-[#EC5A12] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#d94e0a] transition-colors ${!isValid ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!isValid}
            >
              Continuer
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
              className="font-medium text-[#EC5A12] hover:text-[#d94e0a] transition-colors"
            >
              S&apos;inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}