'use client';

import { useState } from 'react';
import Image from 'next/image'; // Import Image from next/image
import { ChevronRight, Edit2 } from 'lucide-react';

type ReviewFormProps = {
  adData: {
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
    contact: {
      phoneNumber: string;
      whatsapp: boolean;
      email: string;
      preferredContact: string;
      availability: string[];
    };
    options: {
      featured: boolean;
      highlighted: boolean;
      autoRenew: boolean;
      duration: number;
      pushToTop: boolean;
    };
  };
  onEdit: (step: string) => void;
  onSubmit: () => void;
};

export default function ReviewForm({ adData, onEdit, onSubmit }: ReviewFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // TODO: Implement actual ad submission
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
    onSubmit();
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString() + ' FCFA';
  };

  const formatAvailability = (availability: string[]) => {
    const labels: Record<string, string> = {
      morning: 'Matin (8h-12h)',
      afternoon: 'Après-midi (12h-17h)',
      evening: 'Soir (17h-20h)',
      anytime: 'À tout moment'
    };
    return availability.map(a => labels[a]).join(', ');
  };

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Vérifiez votre annonce</h2>

      {/* Category Section */}
      <div className="border rounded-lg p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Catégorie</h3>
          <button
            onClick={() => onEdit('category')}
            className="text-[#E00201] hover:text-[#CB0201] flex items-center text-sm font-medium"
          >
            <Edit2 className="w-4 h-4 mr-1" />
            Modifier
          </button>
        </div>
        <div className="flex items-center text-gray-600">
          <span>{adData.category}</span>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span>{adData.subcategory}</span>
        </div>
      </div>

      {/* Details Section */}
      <div className="border rounded-lg p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Détails de l&apos;annonce</h3>
          <button
            onClick={() => onEdit('details')}
            className="text-[#E00201] hover:text-[#CB0201] flex items-center text-sm font-medium"
          >
            <Edit2 className="w-4 h-4 mr-1" />
            Modifier
          </button>
        </div>
        <div className="space-y-3">
          <h4 className="text-xl font-medium text-gray-900">{adData.title}</h4>
          <p className="text-gray-600">{adData.description}</p>
          <div className="flex items-center space-x-4">
            <span className="text-lg font-semibold text-[#E00201]">
              {formatPrice(adData.price)}
            </span>
            <span className="text-gray-600">État: {adData.condition}</span>
          </div>
          <div className="text-gray-600">
            Localisation: {adData.city}, {adData.region}
          </div>
          {Object.entries(adData.additionalFields).map(([key, value]) => (
            <div key={key} className="text-gray-600">
              {key}: {value}
            </div>
          ))}
        </div>
      </div>

      {/* Media Section */}
      <div className="border rounded-lg p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Photos</h3>
          <button
            onClick={() => onEdit('media')}
            className="text-[#E00201] hover:text-[#CB0201] flex items-center text-sm font-medium"
          >
            <Edit2 className="w-4 h-4 mr-1" />
            Modifier
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {adData.images.map((image, index) => (
            <div key={index} className="relative aspect-w-1 aspect-h-1">
              <Image
                src={image}
                alt={`Image ${index + 1}`}
                className="object-cover rounded-lg"
                fill
                style={{ objectFit: 'cover' }} // Add objectFit style
              />
            </div>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div className="border rounded-lg p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Informations de contact</h3>
          <button
            onClick={() => onEdit('contact')}
            className="text-[#E00201] hover:text-[#CB0201] flex items-center text-sm font-medium"
          >
            <Edit2 className="w-4 h-4 mr-1" />
            Modifier
          </button>
        </div>
        <div className="space-y-2 text-gray-600">
          <p>Téléphone: {adData.contact.phoneNumber}</p>
          {adData.contact.whatsapp && (
            <p>Disponible sur WhatsApp</p>
          )}
          {adData.contact.email && (
            <p>Email: {adData.contact.email}</p>
          )}
          <p>Mode de contact préféré: {adData.contact.preferredContact}</p>
          <p>Disponibilité: {formatAvailability(adData.contact.availability)}</p>
        </div>
      </div>

      {/* Options Section */}
      <div className="border rounded-lg p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Options de publication</h3>
          <button
            onClick={() => onEdit('options')}
            className="text-[#E00201] hover:text-[#CB0201] flex items-center text-sm font-medium"
          >
            <Edit2 className="w-4 h-4 mr-1" />
            Modifier
          </button>
        </div>
        <div className="space-y-2 text-gray-600">
          <p>Durée de publication: {adData.options.duration} jours</p>
          {adData.options.featured && (
            <p>✓ Annonce en vedette</p>
          )}
          {adData.options.highlighted && (
            <p>✓ Annonce surlignée</p>
          )}
          {adData.options.pushToTop && (
            <p>✓ Remonter l&apos;annonce</p>
          )}
          {adData.options.autoRenew && (
            <p>✓ Renouvellement automatique</p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-6">
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`w-full py-3 px-4 rounded-lg text-white font-medium ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#E00201] hover:bg-[#CB0201]'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E00201] transition-colors`}
        >
          {isSubmitting ? 'Publication en cours...' : 'Publier l\'annonce'}
        </button>
      </div>
    </div>
  );
}
