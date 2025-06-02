'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Save, Upload, X, RotateCw, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { getAllCategories, getCategoryById, type Category } from '@/lib/categories';

interface Annonce {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  picture: string;
  gallery: string[];
  category: string;
  subcategory: string;
  condition: string;
  status: string;
  additionalFields: Record<string, string>;
  createdAt: string;
  user: {
    id: number;
  };
}

type UploadedImage = {
  url: string;
  preview: string;
  rotation: number;
  isUploading?: boolean;
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

export default function ModifierAnnoncePage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [annonce, setAnnonce] = useState<Annonce | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showCategorySelect, setShowCategorySelect] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  
  // Form data
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    condition: '',
    city: '',
    region: '',
    category: '',
    subcategory: '',
    additionalFields: {} as Record<string, string>
  });

  const annonceId = params.id as string;
  const categories = getAllCategories();

  const fetchAnnonce = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/annonces/${annonceId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        
        // Vérifier que l'annonce appartient à l'utilisateur connecté
        if (data.user.id !== user?.id) {
          toast.error('Vous n\'êtes pas autorisé à modifier cette annonce');
          router.push('/mes-annonces');
          return;
        }
        
        setAnnonce(data);
        
        // Parse location to extract city and region
        const locationParts = data.location.split(', ');
        const city = locationParts[0] || '';
        const region = locationParts[1] || '';
        
        setFormData({
          title: data.title,
          description: data.description,
          price: data.price.toString(),
          condition: data.condition || '',
          city: city,
          region: region,
          category: data.category,
          subcategory: data.subcategory,
          additionalFields: data.additionalFields || {}
        });

        // Set selected category
        const category = getCategoryById(data.category);
        setSelectedCategory(category || null);

        // Initialize images
        const images: UploadedImage[] = [];
        if (data.picture && data.picture !== '/images/placeholder.svg') {
          images.push({
            url: data.picture,
            preview: data.picture,
            rotation: 0
          });
        }
        if (data.gallery && data.gallery.length > 0) {
          data.gallery.forEach((imageUrl: string) => {
            if (imageUrl !== data.picture && imageUrl !== '/images/placeholder.svg') {
              images.push({
                url: imageUrl,
                preview: imageUrl,
                rotation: 0
              });
            }
          });
        }
        setUploadedImages(images);
      } else if (response.status === 404) {
        toast.error('Annonce non trouvée');
        router.push('/mes-annonces');
      } else {
        toast.error('Erreur lors du chargement de l\'annonce');
      }
    } catch (_error) {
      console.error('Erreur:', _error);
      toast.error('Erreur de connexion au serveur');
    } finally {
      setIsLoading(false);
    }
  }, [annonceId, user?.id, router]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    fetchAnnonce();
  }, [isAuthenticated, fetchAnnonce]);

  const uploadFiles = async (files: File[]) => {
    setIsUploading(true);

    try {
      const formDataUpload = new FormData();
      files.forEach(file => {
        formDataUpload.append('files', file);
      });

      console.log('📤 [Edit] Uploading files:', files.map(f => ({ name: f.name, size: f.size, type: f.type })));

      const token = localStorage.getItem('auth_token');
      console.log('🔑 [Edit] Auth token present:', !!token);

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataUpload
      });

      console.log('📡 [Edit] Upload response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('❌ [Edit] Upload failed:', errorData);
        throw new Error(errorData.error || 'Upload failed');
      }

      const result = await response.json();
      console.log('✅ [Edit] Upload successful:', result);
      return result.files;
    } catch (error) {
      console.error('💥 [Edit] Upload error:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const onDrop = async (acceptedFiles: File[]) => {
    if (uploadedImages.length + acceptedFiles.length > 10) {
      toast.error('Vous ne pouvez pas télécharger plus de 10 images');
      return;
    }

    // Add temporary images with loading state
    const tempImages = acceptedFiles.map((file) => ({
      url: '',
      preview: URL.createObjectURL(file),
      rotation: 0,
      isUploading: true,
    }));

    setUploadedImages((prev) => [...prev, ...tempImages]);

    try {
      const uploadedUrls = await uploadFiles(acceptedFiles);
      
      // Update images with actual URLs
      setUploadedImages((prev) => {
        const newImages = [...prev];
        const startIndex = newImages.length - acceptedFiles.length;
        
        uploadedUrls.forEach((url: string, index: number) => {
          if (newImages[startIndex + index]) {
            newImages[startIndex + index] = {
              ...newImages[startIndex + index],
              url,
              isUploading: false,
            };
          }
        });
        
        return newImages;
      });

      toast.success(`${acceptedFiles.length} image(s) téléchargée(s) avec succès`);
    } catch (error) {
      setUploadedImages((prev) => 
        prev.filter(img => !img.isUploading)
      );
      toast.error('Erreur lors du téléchargement');
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    maxSize: 5 * 1024 * 1024,
    disabled: isUploading,
  });

  const removeImage = (index: number) => {
    setUploadedImages((prev) => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const rotateImage = (index: number) => {
    setUploadedImages((prev) => {
      const newImages = [...prev];
      newImages[index] = {
        ...newImages[index],
        rotation: (newImages[index].rotation + 90) % 360,
      };
      return newImages;
    });
  };

  const moveImage = (index: number, direction: 'left' | 'right') => {
    setUploadedImages((prev) => {
      const newImages = [...prev];
      const newIndex = direction === 'left' ? index - 1 : index + 1;
      [newImages[index], newImages[newIndex]] = [
        newImages[newIndex],
        newImages[index],
      ];
      return newImages;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (!formData.category || !formData.subcategory) {
      toast.error('Veuillez sélectionner une catégorie et sous-catégorie');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const imageUrls = uploadedImages.filter(img => !img.isUploading).map(img => img.url);
      
      const updateData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: parseInt(formData.price) || 0,
        location: `${formData.city.trim()}, ${formData.region}`,
        picture: imageUrls[0] || '/images/placeholder.svg',
        gallery: imageUrls,
        category: formData.category,
        subcategory: formData.subcategory,
        condition: formData.condition,
        additionalFields: formData.additionalFields
      };

      const response = await fetch(`/api/annonces/${annonceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        toast.success('Annonce modifiée avec succès !');
        router.push('/mes-annonces');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Erreur lors de la modification');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur de connexion au serveur');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAdditionalFieldChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      additionalFields: {
        ...prev.additionalFields,
        [field]: value,
      },
    }));
  };

  const handleCategorySelect = (category: string, subcategory: string) => {
    const categoryData = getCategoryById(category);
    setSelectedCategory(categoryData || null);
    setFormData(prev => ({
      ...prev,
      category,
      subcategory,
      additionalFields: {} // Reset additional fields when category changes
    }));
    setShowCategorySelect(false);
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de l'annonce...</p>
        </div>
      </div>
    );
  }

  if (!annonce) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Annonce non trouvée</h1>
          <Link
            href="/mes-annonces"
            className="text-primary-600 hover:text-primary-700"
          >
            Retour à mes annonces
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/mes-annonces"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            Retour
          </Link>
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Modifier l'annonce</h1>
            <p className="text-gray-600 mt-1">Modifiez les informations de votre annonce</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie *
              </label>
              {showCategorySelect ? (
                <div className="border border-gray-300 rounded-lg p-4">
                  {selectedCategory ? (
                    <div>
                      <button
                        type="button"
                        onClick={() => setSelectedCategory(null)}
                        className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
                      >
                        <ChevronLeft className="w-5 h-5 mr-1" />
                        Retour aux catégories
                      </button>

                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {selectedCategory.name}
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {selectedCategory.subcategories.map((subcategory) => (
                          <button
                            key={subcategory.id}
                            type="button"
                            onClick={() => handleCategorySelect(selectedCategory.id, subcategory.id)}
                            className="p-3 text-left border rounded-lg hover:border-primary-500 hover:shadow-sm transition-all duration-200"
                          >
                            <span className="text-sm font-medium text-gray-900">
                              {subcategory.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Choisissez une catégorie
                      </h3>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {categories.map((category) => (
                          <button
                            key={category.id}
                            type="button"
                            onClick={() => setSelectedCategory(category)}
                            className="p-4 text-center border rounded-lg hover:border-primary-500 hover:shadow-sm transition-all duration-200"
                          >
                            <span className="text-2xl mb-2 block">{category.icon}</span>
                            <span className="text-sm font-medium text-gray-900">
                              {category.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setShowCategorySelect(false)}
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {selectedCategory && (
                      <>
                        <span className="text-2xl">{selectedCategory.icon}</span>
                        <div>
                          <p className="font-medium text-gray-900">{selectedCategory.name}</p>
                          <p className="text-sm text-gray-600">
                            {selectedCategory.subcategories.find(sub => sub.id === formData.subcategory)?.name}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowCategorySelect(true)}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Modifier
                  </button>
                </div>
              )}
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Titre de l'annonce *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Ex: iPhone 12 Pro Max 256GB"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={6}
                maxLength={2000}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Décrivez votre article en détail..."
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                {2000 - formData.description.length} caractères restants
              </p>
            </div>

            {/* Price and Condition */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  Prix (FCFA) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="500"
                  step="500"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Ex: 50000"
                  required
                />
              </div>

              <div>
                <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-2">
                  État *
                </label>
                <select
                  id="condition"
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                >
                  <option value="">Sélectionnez l'état</option>
                  {conditions.map((condition) => (
                    <option key={condition.value} value={condition.value}>
                      {condition.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                  Ville *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Ex: Dakar"
                  required
                />
              </div>

              <div>
                <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-2">
                  Région *
                </label>
                <select
                  id="region"
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                >
                  <option value="">Sélectionnez une région</option>
                  {regions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Additional Fields */}
            {formData.category && categoryFields[formData.category]?.map((field) => (
              <div key={field.id}>
                <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-2">
                  {field.label}
                </label>
                {field.type === 'select' ? (
                  <select
                    id={field.id}
                    value={formData.additionalFields[field.id] || ''}
                    onChange={(e) => handleAdditionalFieldChange(field.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Sélectionnez une option</option>
                    {field.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    id={field.id}
                    value={formData.additionalFields[field.id] || ''}
                    onChange={(e) => handleAdditionalFieldChange(field.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                )}
              </div>
            ))}

            {/* Images Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Images ({uploadedImages.length}/10)
              </label>
              
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors duration-200 ${
                  isDragActive
                    ? 'border-primary-500 bg-primary-50'
                    : isUploading
                    ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                    : 'border-gray-300 hover:border-primary-500'
                }`}
              >
                <input {...getInputProps()} />
                <div className="space-y-2">
                  <div className="flex justify-center">
                    {isUploading ? (
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                    ) : (
                      <Upload className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <div className="text-gray-600">
                    {isUploading ? (
                      <p className="font-medium">Téléchargement en cours...</p>
                    ) : (
                      <>
                        <p className="font-medium">Glissez-déposez vos images ici</p>
                        <p className="text-sm">ou cliquez pour sélectionner des fichiers</p>
                      </>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    <p>Format acceptés: JPG, PNG, WebP • Taille max: 5 MB • Maximum: 10 images</p>
                  </div>
                </div>
              </div>

              {uploadedImages.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {uploadedImages.map((image, index) => (
                    <div key={image.preview} className="relative group">
                      <div className="aspect-square relative overflow-hidden rounded-lg border border-gray-200">
                        <Image
                          src={image.preview}
                          alt={`Image ${index + 1}`}
                          fill
                          className="object-cover"
                          style={{
                            transform: `rotate(${image.rotation}deg)`,
                          }}
                        />
                        {image.isUploading && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                          </div>
                        )}
                      </div>
                      
                      {!image.isUploading && (
                        <div className="absolute top-2 right-2 flex space-x-1">
                          <button
                            type="button"
                            onClick={() => rotateImage(index)}
                            className="p-1 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-opacity"
                          >
                            <RotateCw className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="p-1 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                      
                      {!image.isUploading && (
                        <div className="absolute bottom-2 left-2 flex space-x-1">
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => moveImage(index, 'left')}
                              className="p-1 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-opacity"
                            >
                              <ChevronLeft className="w-3 h-3" />
                            </button>
                          )}
                          {index < uploadedImages.length - 1 && (
                            <button
                              type="button"
                              onClick={() => moveImage(index, 'right')}
                              className="p-1 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-opacity"
                            >
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      )}
                      
                      {index === 0 && (
                        <div className="absolute top-2 left-2">
                          <span className="px-2 py-1 bg-primary-500 text-white text-xs rounded-full">
                            Principal
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <Link
                href="/mes-annonces"
                className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </Link>
              
              <button
                type="submit"
                disabled={isSubmitting || isUploading}
                className="flex items-center px-6 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Modification...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Enregistrer les modifications
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 