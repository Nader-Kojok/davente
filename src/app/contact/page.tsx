'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import TextInput from '@/components/ui/TextInput';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({
    name: false,
    email: false,
    subject: false,
    message: false
  });

  const validateField = (name: string, value: string) => {
    let isValid = true;

    switch (name) {
      case 'name':
        isValid = value.length >= 2;
        break;
      case 'email':
        isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        break;
      case 'subject':
        isValid = value.length >= 3;
        break;
      case 'message':
        isValid = value.length >= 10;
        break;
    }

    setErrors(prev => ({
      ...prev,
      [name]: !isValid
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    validateField(name, value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const validations = {
      name: formData.name.length >= 2,
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email),
      subject: formData.subject.length >= 3,
      message: formData.message.length >= 10
    };

    setErrors({
      name: !validations.name,
      email: !validations.email,
      subject: !validations.subject,
      message: !validations.message
    });

    if (Object.values(validations).every(v => v)) {
      // Handle form submission
      console.log('Contact form data:', formData);
      // TODO: Implement actual form submission
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gray-50 py-8">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Retour
          </Link>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <h1 className="h2 text-center mb-4">
              Contactez-nous
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
                  placeholder="Votre nom"
                  error={errors.name ? 'Le nom doit contenir au moins 2 caractères' : undefined}
                />
              </div>

              {/* Email Field */}
              <div>
                <TextInput
                  label="Email"
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="votre@email.com"
                  error={errors.email ? 'Veuillez entrer une adresse email valide' : undefined}
                />
              </div>

              {/* Subject Field */}
              <div>
                <TextInput
                  label="Sujet"
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Sujet de votre message"
                  error={errors.subject ? 'Le sujet doit contenir au moins 3 caractères' : undefined}
                />
              </div>

              {/* Message Field */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#E00201] focus:border-transparent ${errors.message ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Votre message..."
                />
                {errors.message && (
                  <p className="mt-2 text-sm text-red-600">
                    Le message doit contenir au moins 10 caractères
                  </p>
                )}
              </div>

              <button
                type="submit"
                className={`btn-primary w-full flex justify-center items-center ${Object.values(errors).some(error => error) ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={Object.values(errors).some(error => error)}
              >
                Envoyer
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}