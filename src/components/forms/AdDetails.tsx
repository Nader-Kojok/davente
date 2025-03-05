'use client';

import { useState } from 'react';
import TextInput from '@/components/ui/TextInput';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import PriceInput from '@/components/ui/PriceInput';

type AdDetailsProps = {
  category: string;
  subcategory: string;
  onSubmit: (data: AdDetailsData) => void;
};

type AdDetailsData = {
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

const conditions = [
  { value: 'new', label: 'Neuf' },
  { value: 'like-new', label: 'Utilisé - Comme neuf' },
  { value: 'good', label: 'Utilisé - Bon état' },
  { value: 'fair', label: 'Utilisé - État moyen' },
];

const regions = [
  'Dakar',
  'Thiès',
  'Saint-Louis',
  'Diourbel',
  'Fatick',
  'Kaolack',
  'Kolda',
  'Louga',
  'Matam',
  'Sédhiou',
  'Tambacounda',
  'Kaffrine',
  'Kédougou',
  'Ziguinchor',
];

const categoryFields: Record<
  string,
  Array<{
    id: string;
    label: string;
    type: string;
    options?: { value: string; label: string }[];
  }>
> = {
  vehicles: [
    { id: 'year', label: 'Année', type: 'number' },
    { id: 'mileage', label: 'Kilométrage', type: 'number' },
    {
      id: 'fuel',
      label: 'Carburant',
      type: 'select',
      options: [
        { value: 'essence', label: 'Essence' },
        { value: 'diesel', label: 'Diesel' },
        { value: 'hybrid', label: 'Hybride' },
        { value: 'electric', label: 'Électrique' },
      ],
    },
    {
      id: 'transmission',
      label: 'Transmission',
      type: 'select',
      options: [
        { value: 'automatic', label: 'Automatique' },
        { value: 'manual', label: 'Manuelle' },
      ],
    },
  ],
  'real-estate': [
    {
      id: 'propertyType',
      label: 'Type de bien',
      type: 'select',
      options: [
        { value: 'apartment', label: 'Appartement' },
        { value: 'house', label: 'Maison' },
        { value: 'land', label: 'Terrain' },
      ],
    },
    { id: 'rooms', label: 'Nombre de pièces', type: 'number' },
    { id: 'area', label: 'Surface (m²)', type: 'number' },
  ],
  electronics: [
    { id: 'brand', label: 'Marque', type: 'text' },
    { id: 'model', label: 'Modèle', type: 'text' },
    { id: 'storage', label: 'Capacité de stockage', type: 'text' },
  ],
};

export default function AdDetails({
  category,
  subcategory,
  onSubmit,
}: AdDetailsProps) {
  const [formData, setFormData] = useState<AdDetailsData>({
    title: '',
    description: '',
    price: 500,
    condition: '',
    city: '',
    region: '',
    category,
    subcategory,
    additionalFields: {},
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAdditionalFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      additionalFields: {
        ...prev.additionalFields,
        [field]: value,
      },
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <TextInput
          id="title"
          label="Titre de l'annonce *"
          type="text"
          required
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#E00201] focus:ring-[#E00201]"
        />
      </div>

      {/* Description */}
      <div>
        <Textarea
          id="description"
          label="Description *"
          required
          rows={5}
          maxLength={2000}
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#E00201] focus:ring-[#E00201]"
        />
        <p className="mt-2 text-sm text-gray-500">
          {2000 - formData.description.length} caractères restants
        </p>
      </div>

      {/* Price using PriceInput */}
      <PriceInput
        label="Prix"
        value={formData.price}
        onChange={(value: number) => handleChange('price', value)}
        required
        min={500}
        step={500}
        currency="FCFA"
      />

      {/* Condition */}
      <div>
        <Select
          id="condition"
          label="État *"
          required
          value={formData.condition}
          onChange={(e) => handleChange('condition', e.target.value)}
          className="mt-1 block w-full"
          options={[
            { value: '', label: "Sélectionnez l'état" },
            ...conditions.map((condition) => ({
              value: condition.value,
              label: condition.label,
            })),
          ]}
        />
      </div>

      {/* Location */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="city"
            className="block text-sm font-medium text-gray-700"
          >
            Ville *
          </label>
          <TextInput
            id="city"
            type="text"
            required
            value={formData.city}
            onChange={(e) => handleChange('city', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#E00201] focus:ring-[#E00201]"
          />
        </div>
        <div>
          <label
            htmlFor="region"
            className="block text-sm font-medium text-gray-700"
          >
            Région *
          </label>
          <Select
            id="region"
            required
            value={formData.region}
            onChange={(e) => handleChange('region', e.target.value)}
            className="mt-1 block w-full"
            options={[
              { value: '', label: 'Sélectionnez une région' },
              ...regions.map((region) => ({
                value: region,
                label: region,
              })),
            ]}
          />
        </div>
      </div>

      {/* Dynamic Fields */}
      {categoryFields[category]?.map((field) => (
        <div key={field.id}>
          <label
            htmlFor={field.id}
            className="block text-sm font-medium text-gray-700"
          >
            {field.label}
          </label>
          {field.type === 'select' ? (
            <Select
              id={field.id}
              value={formData.additionalFields[field.id] || ''}
              onChange={(e) =>
                handleAdditionalFieldChange(field.id, e.target.value)
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#E00201] focus:ring-[#E00201]"
              options={[
                { value: '', label: 'Sélectionnez une option' },
                ...(field.options?.map((option) => ({
                  value: option.value,
                  label: option.label,
                })) || []),
              ]}
            />
          ) : (
            <TextInput
              type={field.type}
              id={field.id}
              value={formData.additionalFields[field.id] || ''}
              onChange={(e) =>
                handleAdditionalFieldChange(field.id, e.target.value)
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#E00201] focus:ring-[#E00201]"
            />
          )}
        </div>
      ))}

      <div className="pt-5">
        <div className="flex justify-end">
          <button
            type="submit"
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#E00201] hover:bg-[#CB0201] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E00201]"
          >
            Continuer
          </button>
        </div>
      </div>
    </form>
  );
}
