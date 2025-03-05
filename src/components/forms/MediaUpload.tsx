'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { X, RotateCw, ChevronLeft, ChevronRight } from 'lucide-react';

type MediaUploadProps = {
  onSubmit: (images: File[]) => void;
};

type UploadedImage = {
  file: File;
  preview: string;
  rotation: number;
};

export default function MediaUpload({ onSubmit }: MediaUploadProps) {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setUploadError(null);

      if (uploadedImages.length + acceptedFiles.length > 10) {
        setUploadError('Vous ne pouvez pas télécharger plus de 10 images');
        return;
      }

      const newImages = acceptedFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        rotation: 0,
      }));

      setUploadedImages((prev) => [...prev, ...newImages]);
      // Don't call onSubmit here, wait for the user to click the continue button
    },
    [uploadedImages.length]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
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
            : 'border-gray-300 hover:border-[#E00201]'
        }`}
      >
        <input {...getInputProps()} />
        <div className="space-y-4">
          <div className="flex justify-center">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 48 48"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              />
            </svg>
          </div>
          <div className="text-gray-600">
            <p className="text-lg font-medium">Glissez-déposez vos images ici</p>
            <p className="text-sm">ou cliquez pour sélectionner des fichiers</p>
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
              </div>

              {/* Image Controls */}
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
            if (uploadedImages.length === 0) {
              setUploadError('Please upload at least one image');
              return;
            }
            onSubmit(uploadedImages.map((img) => img.file));
          }}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#E00201] hover:bg-[#CB0201] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E00201]"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
