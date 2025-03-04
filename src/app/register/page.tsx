// src/app/register/page.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Phone, ChevronLeft } from 'lucide-react';
import TextInput from '@/components/ui/TextInput'; // Import TextInput
import PasswordInput from '@/components/ui/PasswordInput'; // Import PasswordInput

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({
    name: false,
    phoneNumber: false,
    password: false,
    confirmPassword: false
  });

  const countryCode = '+221';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let processedValue = value;

    if (name === 'phoneNumber') {
      processedValue = value.replace(/\D/g, '');
    }

    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));

    // Validate fields
    validateField(name, processedValue);
  };

  const validateField = (name: string, value: string) => {
    let isValid = true;

    switch (name) {
      case 'name':
        isValid = value.length >= 2;
        break;
      case 'phoneNumber':
        isValid = value.length === 9;
        break;
      case 'password':
        isValid = value.length >= 6;
        // Also check confirm password
        if (formData.confirmPassword) {
          setErrors(prev => ({
            ...prev,
            confirmPassword: value !== formData.confirmPassword
          }));
        }
        break;
      case 'confirmPassword':
        isValid = value === formData.password;
        break;
    }

    setErrors(prev => ({
      ...prev,
      [name]: !isValid
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const validations = {
      name: formData.name.length >= 2,
      phoneNumber: formData.phoneNumber.length === 9,
      password: formData.password.length >= 6,
      confirmPassword: formData.password === formData.confirmPassword
    };

    setErrors(validations);

    if (Object.values(validations).every(v => !v)) {
      // Handle registration
      console.log('Registration data:', {
        ...formData,
        phoneNumber: `${countryCode}${formData.phoneNumber}`
      });
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

        {/* Register Form */}
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <h1 className="h2 text-center mb-4">
            Inscription
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <TextInput
                label="Nom complet"
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Fallou Doe"
                error={errors.name ? 'Le nom doit contenir au moins 2 caractères' : undefined}
              />
            </div>

            {/* Phone Number Field */}
            <div>
              <label
                htmlFor="phoneNumber"
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
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={`form-input pl-24 ${errors.phoneNumber ? 'border-red-500' : ''}`}
                  placeholder="77 123 45 67"
                  maxLength={9}
                />
              </div>
              {errors.phoneNumber && (
                <p className="mt-2 text-sm text-red-600">
                  Le numéro doit contenir 9 chiffres
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <PasswordInput
                label="Mot de passe"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                error={errors.password ? 'Le mot de passe doit contenir au moins 6 caractères' : undefined}
              />
            </div>

            {/* Confirm Password Field */}
            <div>
              <PasswordInput
                label="Confirmer le mot de passe"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                error={errors.confirmPassword ? 'Les mots de passe ne correspondent pas' : undefined}
              />
            </div>

            <button
              type="submit"
              className={`btn-primary w-full flex justify-center items-center ${Object.values(errors).some(error => error) ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={Object.values(errors).some(error => error)}
            >
              S&apos;inscrire
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

          {/* Login Link */}
          <p className="mt-8 text-center text-sm text-gray-600">
            Déjà inscrit ?{' '}
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
