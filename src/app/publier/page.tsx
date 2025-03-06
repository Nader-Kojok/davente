'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategorySelect from '@/components/forms/CategorySelect';
import AdDetails from '@/components/forms/AdDetails';
import MediaUpload from '@/components/forms/MediaUpload';
import ContactForm, { ContactFormData } from '@/components/forms/ContactForm';
import OptionsForm from '@/components/forms/OptionsForm';
import ReviewForm from '@/components/forms/ReviewForm';
import Stepper from '@/components/ui/Stepper';
import SuccessModal from '@/components/ui/SuccessModal'; // Import SuccessModal

type FormStep = 'categorie' | 'details' | 'media' | 'contact' | 'options' | 'verification';

type AdDetailsFormData = {
  title: string;
  description: string;
  price: number;
  condition: string;
  city: string;
  region: string;
  category: string;
  subcategory: string;
  additionalFields: Record<string, string>;
};

type AdData = {
  category: string;
  subcategory: string;
  title: string;
  description: string;
  price: number;
  condition: string;
  city: string;
  region: string;
  additionalFields: Record<string, string>;
  images: string[];
  contact: ContactFormData;
  options: {
    featured: boolean;
    highlighted: boolean;
    autoRenew: boolean;
    duration: number;
    pushToTop: boolean;
  };
};

export default function AdPostingPage() {
  const [currentStep, setCurrentStep] = useState<FormStep>('categorie');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [adData, setAdData] = useState<AdData>({
    category: '',
    subcategory: '',
    title: '',
    description: '',
    price: 0,
    condition: '',
    city: '',
    region: '',
    additionalFields: {},
    images: [],
    contact: {
      phoneNumber: '',
      whatsapp: false,
      email: '',
      preferredContact: '',
      availability: [],
    },
    options: {
      featured: false,
      highlighted: false,
      autoRenew: false,
      duration: 7,
      pushToTop: false,
    },
  });

  const [showSuccess, setShowSuccess] = useState(false); // Add showSuccess state

  const handleCategorySelect = (category: string, subcategory: string) => {
    setSelectedCategory(category);
    setSelectedSubcategory(subcategory);
    setAdData(prev => ({
      ...prev,
      category,
      subcategory
    }));
    setCurrentStep('details');
  };

  const handleDetailsSubmit = (data: AdDetailsFormData) => {
    setAdData(prev => ({
      ...prev,
      ...data
    }));
    setCurrentStep('media');
  };

  const handleStepClick = (step: string) => {
    setCurrentStep(step as FormStep);
  };

  const handleSubmit = () => {
    // TODO: Implement final submission logic here
    console.log('Final submission:', adData);
    setShowSuccess(true); // Show the success modal after submission
  };

  const handleEdit = (step: string) => {
    setCurrentStep(step as FormStep);
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Check out my ad: ${adData.title}`;

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
        break;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Déposer une annonce</h1>
            <p className="mt-2 text-lg text-gray-600">
              Remplissez le formulaire ci-dessous pour publier votre annonce
            </p>
          </div>

          <Stepper
            steps={['categorie', 'details', 'media', 'contact', 'options', 'verification']}
            currentStep={currentStep}
            onStepClick={handleStepClick} // Pass the handleStepClick function
          />

          {/* Form Container */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            {currentStep === 'categorie' && (
              <CategorySelect onSelect={handleCategorySelect} />
            )}
            {currentStep === 'details' && (
              <AdDetails
                category={selectedCategory}
                subcategory={selectedSubcategory}
                onSubmit={handleDetailsSubmit}
              />
            )}
            {currentStep === 'media' && (
              <MediaUpload
                onSubmit={(files: File[]) => {
                  setAdData(prev => ({
                    ...prev,
                    images: files.map(file => URL.createObjectURL(file))
                  }));
                  setCurrentStep('contact');
                }}
              />
            )}
            {currentStep === 'contact' && (
              <ContactForm
                onSubmit={(data: ContactFormData) => {
                  setAdData(prev => ({
                    ...prev,
                    contact: data
                  }));
                  setCurrentStep('options');
                }}
              />
            )}
            {currentStep === 'options' && (
              <OptionsForm
                onSubmit={(data) => {
                  setAdData(prev => ({
                    ...prev,
                    options: data
                  }));
                  setCurrentStep('verification');
                }}
              />
            )}
            {currentStep === 'verification' && (
              <ReviewForm
                adData={adData}
                onEdit={handleEdit}
                onSubmit={handleSubmit} // Call handleSubmit directly
              />
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Success Modal */}
      <SuccessModal
        show={showSuccess}
        title="Annonce publiée avec succès!"
        message="Votre annonce est maintenant en ligne et visible par tous les utilisateurs."
        onShare={handleShare}
        id={adData.title} // Add the required id prop
      />
    </div>
  );
}
