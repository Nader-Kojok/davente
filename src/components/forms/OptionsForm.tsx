'use client';

import { useState } from 'react';
import { Info } from 'lucide-react';

type OptionsFormProps = {
  onSubmit: (data: OptionsFormData) => void;
};

type OptionsFormData = {
  featured: boolean;
  highlighted: boolean;
  autoRenew: boolean;
  duration: number;
  pushToTop: boolean;
};

const premiumOptions = [
  {
    id: 'featured',
    title: 'Annonce en vedette',
    description: 'Votre annonce apparaîtra sur la page d&apos;accueil',
    price: 5000,
    duration: '7 jours',
  },
  {
    id: 'highlighted',
    title: 'Annonce surlignée',
    description: 'Votre annonce sera mise en évidence dans les résultats de recherche',
    price: 2500,
    duration: '7 jours',
  },
  {
    id: 'pushToTop',
    title: 'Remonter l&apos;annonce',
    description: 'Votre annonce sera remontée en haut des résultats toutes les 24h',
    price: 1500,
    duration: 'par remontée',
  },
];

const durationOptions = [
  { value: 7, label: '7 jours', price: 0 },
  { value: 14, label: '14 jours', price: 1000 },
  { value: 30, label: '30 jours', price: 2000 },
  { value: 60, label: '60 jours', price: 3500 },
];

export default function OptionsForm({ onSubmit }: OptionsFormProps) {
  const [formData, setFormData] = useState<OptionsFormData>({
    featured: false,
    highlighted: false,
    autoRenew: false,
    duration: 7,
    pushToTop: false,
  });

  const calculateTotal = () => {
    let total = 0;

    // Add premium options costs
    if (formData.featured) total += 5000;
    if (formData.highlighted) total += 2500;
    if (formData.pushToTop) total += 1500;

    // Add duration cost
    const durationCost = durationOptions.find(option => option.value === formData.duration)?.price || 0;
    total += durationCost;

    return total;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Options premium</h2>
        <p className="text-sm text-gray-600">
          Augmentez la visibilité de votre annonce avec nos options premium
        </p>

        <div className="space-y-4">
          {premiumOptions.map((option) => (
            <div
              key={option.id}
              className={`p-4 border rounded-lg transition-colors ${formData[option.id as keyof OptionsFormData] ? 'border-[#E00201] bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}
            >
              <label className="flex items-start cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData[option.id as keyof OptionsFormData] as boolean}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      [option.id]: e.target.checked,
                    }))
                  }
                  className="mt-1 h-4 w-4 text-[#E00201] focus:ring-[#E00201] border-gray-300 rounded"
                />
                <div className="ml-3">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900">
                      {option.title}
                    </span>
                    <span className="ml-2 text-sm font-semibold text-[#E00201]">
                      {option.price.toLocaleString()} FCFA
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{option.description}</p>
                  <p className="text-xs text-gray-400 mt-1">{option.duration}</p>
                </div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Durée de l&apos;annonce</h2>
        <div className="grid grid-cols-2 gap-4">
          {durationOptions.map((option) => (
            <div
              key={option.value}
              className={`p-4 border rounded-lg transition-colors cursor-pointer ${formData.duration === option.value ? 'border-[#E00201] bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}
              onClick={() =>
                setFormData((prev) => ({ ...prev, duration: option.value }))
              }
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">
                  {option.label}
                </span>
                {option.price > 0 && (
                  <span className="text-sm font-semibold text-[#E00201]">
                    +{option.price.toLocaleString()} FCFA
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-start space-x-2 p-4 bg-gray-50 rounded-lg">
        <Info className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.autoRenew}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, autoRenew: e.target.checked }))
              }
              className="h-4 w-4 text-[#E00201] focus:ring-[#E00201] border-gray-300 rounded mr-2"
            />
            <span className="text-sm font-medium text-gray-900">
              Renouvellement automatique
            </span>
          </label>
          <p className="text-sm text-gray-500 mt-1">
            Votre annonce sera automatiquement renouvelée à la fin de sa durée
          </p>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4 mt-6">
        <div className="flex items-center justify-between">
          <span className="text-base font-medium text-gray-900">Total</span>
          <span className="text-lg font-semibold text-[#E00201]">
            {calculateTotal().toLocaleString()} FCFA
          </span>
        </div>
      </div>

      <div className="pt-5">
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#E00201] hover:bg-[#CB0201] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E00201]"
          >
            Continuer
          </button>
        </div>
      </div>
    </form>
  );
}