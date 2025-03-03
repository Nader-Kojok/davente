// components/ui/ListingImages.tsx
'use client';

import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import Image from 'next/image';

interface ListingImagesProps {
  images: string[];
  title: string;
  onClose: () => void;
}

const ListingImages: React.FC<ListingImagesProps> = ({ images, title, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const handleThumbnailClick = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  useEffect(() => {
    // Focus the dialog when it opens
    const dialogElement = document.querySelector('[role="dialog"]');
    if (dialogElement instanceof HTMLElement) {
      dialogElement.focus();
    }
  }, []);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      switch (event.key) {
        case 'ArrowLeft':
          handlePrevious();
          break;
        case 'ArrowRight':
          handleNext();
          break;
        case 'Escape':
          onClose();
          break;
      }
    },
    [handlePrevious, handleNext, onClose]
  );

  return (
    <div 
      className="fixed inset-0 bg-black/90 z-[9999] flex flex-col"
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      onKeyDown={handleKeyDown}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/50">
        <span className="text-white text-lg">
          {currentIndex + 1} / {images.length}
        </span>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-300 transition-colors p-2"
          aria-label="Close gallery"
        >
          <X size={24} />
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex">
        {/* Main image */}
        <div className="flex-1 relative flex items-center justify-center p-4">
          <div className="relative w-full h-full">
            <Image
              src={images[currentIndex]}
              alt={`${title} - Image ${currentIndex + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 80vw"
              priority
              className="object-contain"
            />
          </div>

          {/* Navigation buttons */}
          <button
            onClick={handlePrevious}
            className="absolute left-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Thumbnails */}
        <div className="w-24 md:w-32 bg-black/50 overflow-y-auto p-2 space-y-2">
          {images.map((image, index) => (
            <button
              key={image}
              onClick={() => handleThumbnailClick(index)}
              className={`w-full aspect-square relative rounded-lg overflow-hidden transition-all ${currentIndex === index ? 'ring-2 ring-[#E00201] opacity-100' : 'opacity-60 hover:opacity-100'}`}
            >
              <div className="relative w-full h-full">
                <Image
                  src={image}
                  alt={`${title} - Thumbnail ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 96px, 128px"
                  className="object-cover"
                />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Buy button */}
      <div className="p-4 bg-black/50 flex justify-center">
        <button className="bg-[#E00201] hover:bg-[#CB0201] text-white px-8 py-3 rounded-lg font-semibold transition-colors">
          Acheter
        </button>
      </div>
    </div>
  );
};

export default ListingImages;
