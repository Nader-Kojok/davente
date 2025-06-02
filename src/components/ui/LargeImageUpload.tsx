import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Camera, X, Loader2, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { upload } from '@vercel/blob/client';

interface LargeImageUploadProps {
  currentImage?: string;
  onImageChange: (imageUrl: string) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  shape?: 'circle' | 'square';
  disabled?: boolean;
  maxSizeMB?: number;
}

const LargeImageUpload: React.FC<LargeImageUploadProps> = ({
  currentImage,
  onImageChange,
  className = '',
  size = 'md',
  shape = 'circle',
  disabled = false,
  maxSizeMB = 50
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
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

    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      toast.error(`L'image ne doit pas dépasser ${maxSizeMB}MB`);
      return;
    }

    // Créer un aperçu local
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Télécharger l'image via client upload
    uploadImageClient(file);
  };

  const uploadImageClient = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Get auth token
      const authToken = localStorage.getItem('auth_token');
      if (!authToken) {
        throw new Error('Token d\'authentification requis');
      }

      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const extension = file.name.split('.').pop() || 'jpg';
      const fileName = `avatar_${timestamp}_${randomString}.${extension}`;

      // Use client upload for larger files
      const blob = await upload(fileName, file, {
        access: 'public',
        handleUploadUrl: '/api/upload/presigned',
        clientPayload: authToken,
        onUploadProgress: (progress) => {
          setUploadProgress(Math.round(progress.percentage));
        },
      });

      onImageChange(blob.url);
      toast.success('Image téléchargée avec succès');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Erreur lors du téléchargement de l\'image');
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
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
          <div className="text-center">
            <Loader2 className="w-6 h-6 text-gray-400 animate-spin mx-auto mb-1" />
            <div className="text-xs text-gray-500">{uploadProgress}%</div>
          </div>
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
            <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
            <div className="text-xs text-gray-500">Jusqu'à {maxSizeMB}MB</div>
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

      {/* Barre de progression */}
      {isUploading && uploadProgress > 0 && (
        <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gray-200 rounded-full">
          <div 
            className="h-1 bg-primary-600 rounded-full transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
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

export default LargeImageUpload; 