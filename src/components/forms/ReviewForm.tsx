'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronRight, Edit2, ChevronLeft, Phone, Mail, MessageSquare, Clock, MapPin, X, Check, Facebook, Twitter } from 'lucide-react';

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
  const [selectedPayment, setSelectedPayment] = useState<'wave' | 'om' | null>(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handlePaymentSelect = (method: 'wave' | 'om') => {
    setSelectedPayment(method);
    setShowQRCode(true);
  };

  const handleCloseQRCode = () => {
    setShowQRCode(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // TODO: Implement actual ad submission
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
    setShowSuccess(true);
    setIsSubmitting(false);
    onSubmit();
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

  const [currentImage, setCurrentImage] = useState(0);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % adData.images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + adData.images.length) % adData.images.length);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Aperçu de l&apos;annonce</h2>

      {/* Preview Section */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Image Gallery */}
        <div className="relative aspect-video bg-gray-100">
          {adData.images.length > 0 && (
            <>
              <Image
                src={adData.images[currentImage]}
                alt={adData.title}
                fill
                className="object-contain"
                priority
              />
              {adData.images.length > 1 && (
                <div className="absolute inset-0 flex items-center justify-between p-4">
                  <button
                    onClick={prevImage}
                    className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              )}
              <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {currentImage + 1} / {adData.images.length}
              </div>
            </>
          )}
        </div>

        {/* Thumbnails */}
        <div className="flex gap-2 p-4 overflow-x-auto">
          {adData.images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden ${currentImage === index ? 'ring-2 ring-[#E00201]' : 'opacity-70 hover:opacity-100'}`}
            >
              <Image
                src={image}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <h1 className="text-2xl font-semibold text-gray-900">{adData.title}</h1>
            <div className="flex items-baseline space-x-4">
              <span className="text-3xl font-bold text-[#E00201]">{formatPrice(adData.price)}</span>
              <span className="text-gray-600">État: {adData.condition}</span>
            </div>
          </div>

          <div className="prose prose-gray max-w-none">
            <p>{adData.description}</p>
          </div>

          <div className="flex items-center text-gray-600 space-x-2">
            <MapPin className="w-4 h-4" />
            <span>{adData.city}, {adData.region}</span>
          </div>

          {/* Additional Fields */}
          {Object.entries(adData.additionalFields).length > 0 && (
            <div className="border-t pt-4 grid grid-cols-2 gap-4">
              {Object.entries(adData.additionalFields).map(([key, value]) => (
                <div key={key} className="text-sm">
                  <span className="text-gray-500">{key}:</span>
                  <span className="ml-2 text-gray-900">{value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Contact Card */}
          <div className="bg-gray-50 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <span>{adData.contact.phoneNumber}</span>
              </div>
              {adData.contact.whatsapp && (
                <div className="flex items-center space-x-3 text-green-600">
                  <MessageSquare className="w-5 h-5" />
                  <span>Disponible sur WhatsApp</span>
                </div>
              )}
              {adData.contact.email && (
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span>{adData.contact.email}</span>
                </div>
              )}
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <span>{formatAvailability(adData.contact.availability)}</span>
              </div>
            </div>
          </div>

          {/* Publication Options */}
          <div className="border-t pt-4 space-y-2 text-sm text-gray-600">
            <p>Durée de publication: {adData.options.duration} jours</p>
            {adData.options.featured && <p>✓ Annonce en vedette</p>}
            {adData.options.highlighted && <p>✓ Annonce surlignée</p>}
            {adData.options.pushToTop && <p>✓ Remonter l&apos;annonce</p>}
            {adData.options.autoRenew && <p>✓ Renouvellement automatique</p>}
          </div>
        </div>
      </div>

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

      {/* Payment Options */}
      <div className="border rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Options de paiement</h3>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handlePaymentSelect('wave')}
            className={`p-4 border rounded-lg flex items-center justify-center space-x-2 transition-colors ${selectedPayment === 'wave' ? 'border-[#E00201] bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}
          >
            <Image
              src="/wave.png"
              alt="Wave"
              width={32}
              height={32}
              className="object-contain"
            />
            <span className="font-medium">Wave</span>
          </button>
          <button
            onClick={() => handlePaymentSelect('om')}
            className={`p-4 border rounded-lg flex items-center justify-center space-x-2 transition-colors ${selectedPayment === 'om' ? 'border-[#E00201] bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}
          >
            <Image
              src="/om.png"
              alt="Orange Money"
              width={32}
              height={32}
              className="object-contain"
            />
            <span className="font-medium">Orange Money</span>
          </button>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQRCode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Scanner le code QR {selectedPayment === 'wave' ? 'Wave' : 'Orange Money'}
              </h3>
              <button
                onClick={handleCloseQRCode}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="aspect-square w-full bg-gray-100 rounded-lg flex items-center justify-center">
              {/* Placeholder for QR Code - Replace with actual QR code implementation */}
              <div className="text-gray-400 text-center">
                <p>Code QR {selectedPayment === 'wave' ? 'Wave' : 'Orange Money'}</p>
                <p className="text-sm mt-2">Scannez pour effectuer le paiement</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative overflow-hidden">
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center animate-scale-check">
                  <Check className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Annonce publiée avec succès!</h3>
              <p className="text-gray-600 mb-6">Votre annonce est maintenant en ligne et visible par tous les utilisateurs.</p>
              
              <div className="space-y-4">
                <p className="text-sm font-medium text-gray-700">Partagez votre annonce</p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => handleShare('facebook')}
                    className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                  >
                    <Facebook className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="p-2 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-colors"
                  >
                    <Twitter className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleShare('whatsapp')}
                    className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                  >
                    <MessageSquare className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
