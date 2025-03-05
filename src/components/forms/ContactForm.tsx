'use client';

import { useState } from 'react';
import TextInput from '@/components/ui/TextInput';
import Select from '@/components/ui/Select';
import { PatternFormat } from 'react-number-format';

type ContactFormProps = {
  onSubmit: (data: ContactFormData) => void;
};

export type ContactFormData = { // Add export keyword here
  phoneNumber: string;
  whatsapp: boolean;
  email: string;
  preferredContact: string;
  availability: string[];
};

const availabilityOptions = [
  { value: 'morning', label: 'Matin (8h-12h)' },
  { value: 'afternoon', label: 'Après-midi (12h-17h)' },
  { value: 'evening', label: 'Soir (17h-20h)' },
  { value: 'anytime', label: 'À tout moment' },
];

const contactMethods = [
  { value: 'phone', label: 'Téléphone' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'email', label: 'Email' },
];

export default function ContactForm({ onSubmit }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    phoneNumber: '',
    whatsapp: false,
    email: '',
    preferredContact: '',
    availability: [],
  });

  const [errors, setErrors] = useState({
    phoneNumber: '',
    email: '',
    preferredContact: '',
    availability: '',
  });

  const validateForm = () => {
    const newErrors = {
      phoneNumber: '',
      email: '',
      preferredContact: '',
      availability: '',
    };

    let isValid = true;

    // Phone number validation (Senegal format)
    const phoneNumberRegex = /^(\+221|221)?[76][05-8][0-9]{7}$/;
    const formattedPhoneNumber = formData.phoneNumber.replace(/\s/g, ''); // Remove spaces
    if (!phoneNumberRegex.test(formattedPhoneNumber)) {
      newErrors.phoneNumber = 'Numéro de téléphone invalide';
      isValid = false;
    }

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Adresse email invalide';
      isValid = false;
    }

    // Preferred contact method validation
    if (!formData.preferredContact) {
      newErrors.preferredContact =
        'Veuillez sélectionner un mode de contact préféré';
      isValid = false;
    }

    // Availability validation
    if (formData.availability.length === 0) {
      newErrors.availability =
        'Veuillez sélectionner au moins une plage horaire';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleAvailabilityChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      availability: prev.availability.includes(value)
        ? prev.availability.filter((item) => item !== value)
        : [...prev.availability, value],
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="phoneNumber"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Numéro de téléphone *
        </label>
        <PatternFormat
          format="+221 7# ### ## ##"
          allowEmptyFormatting
          value={formData.phoneNumber}
          onChange={(e) =>
            setFormData({ ...formData, phoneNumber: e.target.value })
          }
          className={`form-input block w-full rounded-md border-gray-300 shadow-sm focus:border-[#E00201] focus:ring-[#E00201] ${
            errors.phoneNumber ? 'border-red-500' : ''
          }`}
          id="phoneNumber"
          type="tel"
          placeholder="+221 77 XXX XX XX"
          required
        />
        {errors.phoneNumber && (
          <p className="mt-1 text-sm text-red-500">{errors.phoneNumber}</p>
        )}
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="whatsapp"
          checked={formData.whatsapp}
          onChange={(e) =>
            setFormData({ ...formData, whatsapp: e.target.checked })
          }
          className="h-4 w-4 text-[#E00201] focus:ring-[#E00201] border-gray-300 rounded"
        />
        <label htmlFor="whatsapp" className="ml-2 block text-sm text-gray-700">
          Ce numéro est disponible sur WhatsApp
        </label>
      </div>

      <div>
        <TextInput
          label="Email (optionnel)"
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
          placeholder="votre@email.com"
        />
      </div>

      <div>
        <Select
          label="Mode de contact préféré *"
          id="preferredContact"
          value={formData.preferredContact}
          onChange={(e) =>
            setFormData({ ...formData, preferredContact: e.target.value })
          }
          error={errors.preferredContact}
          options={[
            { value: '', label: 'Sélectionnez un mode de contact' },
            ...contactMethods,
          ]}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Disponibilité *
        </label>
        <div className="space-y-2">
          {availabilityOptions.map((option) => (
            <div key={option.value} className="flex items-center">
              <input
                type="checkbox"
                id={option.value}
                value={option.value}
                checked={formData.availability.includes(option.value)}
                onChange={handleAvailabilityChange}
                className="h-4 w-4 text-[#E00201] focus:ring-[#E00201] border-gray-300 rounded"
              />
              <label
                htmlFor={option.value}
                className="ml-2 block text-sm text-gray-700"
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>
        {errors.availability && (
          <p className="mt-2 text-sm text-red-600">{errors.availability}</p>
        )}
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
