import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Camera, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface ImageUploadProps {
  currentImage?: string;
  onImageChange: (imageUrl: string) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  shape?: 'circle' | 'square';
  disabled?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  currentImage,
  onImageChange,
  className = '',
  size = 'md',
  shape = 'circle',
  disabled = false
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-20 h-20',
    lg: 'w-32 h-32'
  };

  const shapeClasses = {
    circle: 'rounded-full',
    square: 'rounded-lg'
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validation du fichier
    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner un fichier image');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB max
      toast.error('L\'image ne doit pas dépasser 5MB');
      return;
    }

    // Créer un aperçu local
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Télécharger l'image
    uploadImage(file);
  };

  const uploadImage = async (file: File) => {
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('type', 'avatar');

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Erreur lors du téléchargement');
      }

      const data = await response.json();
      onImageChange(data.url);
      toast.success('Image téléchargée avec succès');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Erreur lors du téléchargement de l\'image');
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    onImageChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const displayImage = previewUrl || currentImage;

  return (
    <div className={`relative ${className}`}>
      <div
        className={`
          ${sizeClasses[size]} 
          ${shapeClasses[shape]} 
          bg-gray-100 
          border-2 
          border-dashed 
          border-gray-300 
          flex 
          items-center 
          justify-center 
          overflow-hidden 
          cursor-pointer 
          hover:border-primary-400 
          transition-colors
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onClick={triggerFileInput}
      >
        {isUploading ? (
          <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
        ) : displayImage ? (
          <Image
            src={displayImage}
            alt="Avatar"
            fill
            className="object-cover"
            sizes={size === 'lg' ? '128px' : size === 'md' ? '80px' : '64px'}
          />
        ) : (
          <div className="text-center">
            <Image
              src="/default-avatar.svg"
              alt="Avatar par défaut"
              width={size === 'lg' ? 64 : size === 'md' ? 48 : 32}
              height={size === 'lg' ? 64 : size === 'md' ? 48 : 32}
              className="opacity-50"
            />
          </div>
        )}
      </div>

      {/* Bouton de modification */}
      {!disabled && (
        <button
          type="button"
          onClick={triggerFileInput}
          className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white hover:bg-primary-700 transition-colors shadow-lg"
          disabled={isUploading}
        >
          {isUploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Camera className="w-4 h-4" />
          )}
        </button>
      )}

      {/* Bouton de suppression */}
      {displayImage && !disabled && !isUploading && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleRemoveImage();
          }}
          className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors shadow-lg"
        >
          <X className="w-3 h-3" />
        </button>
      )}

      {/* Input file caché */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />
    </div>
  );
};

export default ImageUpload; 