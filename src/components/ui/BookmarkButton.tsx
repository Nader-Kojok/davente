'use client';

import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface BookmarkButtonProps {
  annonceId: number;
  annonceData?: any; // Données de l'annonce pour la mise à jour optimiste
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  showText?: boolean;
}

export default function BookmarkButton({
  annonceId,
  annonceData,
  className,
  size = 'md',
  variant = 'default',
  showText = false
}: BookmarkButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { addBookmark, removeBookmark, isBookmarked: checkIsBookmarked } = useBookmarks();
  const { isAuthenticated } = useAuth();

  // Utiliser directement le state du hook useBookmarks pour une réactivité immédiate
  const isBookmarked = checkIsBookmarked(annonceId);

  const handleToggleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      return;
    }

    setIsLoading(true);

    try {
      if (isBookmarked) {
        await removeBookmark(annonceId);
      } else {
        await addBookmark(annonceId, annonceData);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg'
  };

  const variantClasses = {
    default: isBookmarked 
      ? 'bg-red-500 text-white hover:bg-red-600' 
      : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
    outline: isBookmarked
      ? 'border-red-500 text-red-500 bg-red-50 hover:bg-red-100'
      : 'border-gray-300 text-gray-600 hover:border-gray-400',
    ghost: isBookmarked
      ? 'text-red-500 hover:bg-red-50'
      : 'text-gray-600 hover:bg-gray-100'
  };

  const iconSize = {
    sm: 16,
    md: 20,
    lg: 24
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <button
      onClick={handleToggleBookmark}
      disabled={isLoading}
      className={cn(
        'inline-flex items-center justify-center rounded-full transition-colors duration-200',
        'focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        sizeClasses[size],
        variantClasses[variant],
        variant === 'outline' && 'border',
        showText && 'px-4 rounded-lg',
        className
      )}
      title={isBookmarked ? 'Supprimer des favoris' : 'Ajouter aux favoris'}
    >
      <Heart
        size={iconSize[size]}
        className={cn(
          'transition-all duration-200',
          isBookmarked ? 'fill-current' : 'fill-none',
          showText && 'mr-2'
        )}
      />
      {showText && (
        <span className="text-sm font-medium">
          {isBookmarked ? 'Favori' : 'Ajouter'}
        </span>
      )}
    </button>
  );
} 