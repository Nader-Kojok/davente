'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { X, RotateCw, ChevronLeft, ChevronRight, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

type MediaUploadProps = {
  onSubmit: (imageUrls: string[]) => void;
};

type UploadedImage = {
  url: string;
  preview: string;
  rotation: number;
  isUploading?: boolean;
};

export default function MediaUpload({ onSubmit }: MediaUploadProps) {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const uploadFiles = async (files: File[]) => {
    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });

      console.log('📤 Uploading files:', files.map(f => ({ name: f.name, size: f.size, type: f.type })));

      const token = localStorage.getItem('auth_token');
      console.log('🔑 Auth token present:', !!token);

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      console.log('📡 Upload response status:', response.status);
      console.log('📡 Upload response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('❌ Upload failed:', errorData);
        throw new Error(errorData.error || 'Upload failed');
      }

      const result = await response.json();
      console.log('✅ Upload successful:', result);
      return result.files; // Array of uploaded file URLs
    } catch (error) {
      console.error('💥 Upload error:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setUploadError(null);

      if (uploadedImages.length + acceptedFiles.length > 10) {
        setUploadError('Vous ne pouvez pas télécharger plus de 10 images');
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
        // Upload files to server
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
        // Remove failed uploads
        setUploadedImages((prev) => 
          prev.filter(img => !img.isUploading)
        );
        setUploadError('Erreur lors du téléchargement des images');
        toast.error('Erreur lors du téléchargement');
      }
    },
    [uploadedImages.length]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
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

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200 ${
          isDragActive
            ? 'border-[#E00201] bg-red-50'
            : isUploading
            ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
            : 'border-gray-300 hover:border-[#E00201]'
        }`}
      >
        <input {...getInputProps()} />
        <div className="space-y-4">
          <div className="flex justify-center">
            {isUploading ? (
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E00201]"></div>
            ) : (
              <Upload className="w-12 h-12 text-gray-400" />
            )}
          </div>
          <div className="text-gray-600">
            {isUploading ? (
              <p className="text-lg font-medium">Téléchargement en cours...</p>
            ) : (
              <>
                <p className="text-lg font-medium">Glissez-déposez vos images ici</p>
                <p className="text-sm">ou cliquez pour sélectionner des fichiers</p>
              </>
            )}
          </div>
          <div className="text-xs text-gray-500">
            <p>Format acceptés: JPG, PNG, WebP</p>
            <p>Taille maximale: 5 MB par image</p>
            <p>Maximum: 10 images</p>
          </div>
        </div>
      </div>

      {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}

      {uploadedImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {uploadedImages.map((image, index) => (
            <div key={image.preview} className="relative group">
              <div className="aspect-square relative overflow-hidden rounded-lg border border-gray-200">
                <Image
                  src={image.preview}
                  alt={`Image ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-200 group-hover:scale-105"
                  style={{ transform: `rotate(${image.rotation}deg)` }}
                />
                
                {/* Loading overlay */}
                {image.isUploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  </div>
                )}
              </div>

              {/* Image Controls */}
              {!image.isUploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="flex space-x-2">
                    {index > 0 && (
                      <button
                        onClick={() => moveImage(index, 'left')}
                        className="p-1.5 bg-white rounded-full text-gray-700 hover:text-[#E00201] transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => rotateImage(index)}
                      className="p-1.5 bg-white rounded-full text-gray-700 hover:text-[#E00201] transition-colors"
                    >
                      <RotateCw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeImage(index)}
                      className="p-1.5 bg-white rounded-full text-gray-700 hover:text-[#E00201] transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {index < uploadedImages.length - 1 && (
                      <button
                        onClick={() => moveImage(index, 'right')}
                        className="p-1.5 bg-white rounded-full text-gray-700 hover:text-[#E00201] transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Image Number Badge */}
              <div className="absolute top-2 left-2 bg-white bg-opacity-75 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium text-gray-700">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-end mt-6">
        <button
          onClick={() => {
            const completedImages = uploadedImages.filter(img => !img.isUploading);
            if (completedImages.length === 0) {
              setUploadError('Veuillez télécharger au moins une image');
              return;
            }
            onSubmit(completedImages.map((img) => img.url));
          }}
          disabled={isUploading || uploadedImages.some(img => img.isUploading)}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#E00201] hover:bg-[#CB0201] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E00201] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading || uploadedImages.some(img => img.isUploading) ? 'Téléchargement...' : 'Continuer'}
        </button>
      </div>
    </div>
  );
}
