"use client";

import { Check, Facebook, Twitter, MessageSquare, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from '@/contexts/AuthContext';

type SuccessModalProps = {
  show: boolean;
  title: string;
  message: string;
  id: string;
  onShare: (platform: string) => void;
  onClose?: () => void;
};

export default function SuccessModal({
  show,
  title,
  message,
  id,
  onShare,
  onClose,
}: SuccessModalProps) {
  const { isAuthenticated } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Handle modal visibility with animation
  useEffect(() => {
    if (show) {
      setIsAnimating(true);
      // Small delay to ensure animation triggers
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
      // Wait for exit animation to complete
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [show]);

  // Handle escape key and body scroll lock
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && onClose) {
        onClose();
      }
    };

    if (show) {
      document.addEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "";
    };
  }, [show, onClose]);

  if (!isAnimating) return null;

  const shareOptions = [
    { name: "Facebook", icon: <Facebook className="w-5 h-5" />, color: "bg-blue-600 hover:bg-blue-700", hoverEffect: "hover:shadow-blue-200", onClick: () => onShare("facebook") },
    { name: "Twitter", icon: <Twitter className="w-5 h-5" />, color: "bg-sky-500 hover:bg-sky-600", hoverEffect: "hover:shadow-sky-200", onClick: () => onShare("twitter") },
    { name: "WhatsApp", icon: <MessageSquare className="w-5 h-5" />, color: "bg-green-500 hover:bg-green-600", hoverEffect: "hover:shadow-green-200", onClick: () => onShare("whatsapp") }
  ];

  return (
    <div 
      className={`fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) {
          onClose();
        }
      }}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className={`bg-white rounded-2xl p-6 md:p-8 max-w-md w-full mx-auto shadow-xl ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} transition-all duration-300 ease-out`}
        onClick={(e) => e.stopPropagation()}
      >
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
              <Check className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 mb-6">{message}</p>

          <div className="space-y-4">
            <p className="text-sm font-medium text-gray-700 uppercase tracking-wide">
              Partagez votre annonce
            </p>
            <div className="grid grid-cols-3 gap-3">
              {shareOptions.map((option) => (
                <button
                  key={option.name}
                  onClick={option.onClick}
                  className={`flex flex-col items-center justify-center gap-2 py-3 ${option.color} text-white rounded-lg transition-all duration-200 shadow-sm ${option.hoverEffect} hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50`}
                  aria-label={`Partager sur ${option.name}`}
                >
                  {option.icon}
                  <span className="text-xs font-medium">{option.name}</span>
                </button>
              ))}
            </div>
          </div>
          
          <button 
            onClick={() => window.location.href = `/annonces/${id}`}
            className="mt-6 w-full py-3 px-4 bg-[#E00201] text-white rounded-lg hover:bg-[#CB0201] transition-colors focus:outline-none focus:ring-2 focus:ring-[#E00201] focus:ring-offset-2"
          >
            Voir l&apos;annonce
          </button>

          <button 
            onClick={() => window.location.href = isAuthenticated ? '/publier' : '/login'}
            className="mt-3 w-full py-3 px-4 bg-[#E00201] text-white rounded-lg hover:bg-[#CB0201] transition-colors focus:outline-none focus:ring-2 focus:ring-[#E00201] focus:ring-offset-2"
          >
            Créer une nouvelle annonce
          </button>
          
          <button 
            onClick={() => {
              if (onClose) onClose();
              window.location.href = '/';
            }}
            className="mt-3 w-full py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Non merci
          </button>
        </div>
      </div>
    </div>
  );
}