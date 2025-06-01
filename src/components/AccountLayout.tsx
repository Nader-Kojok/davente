'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  User, 
  Settings, 
  FileText, 
  ChevronLeft,
  Home,
  Heart
} from 'lucide-react';

interface AccountLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

export default function AccountLayout({ children, title, description }: AccountLayoutProps) {
  const pathname = usePathname();

  const navigationItems = [
    {
      href: '/profil',
      label: 'Mon profil',
      icon: User,
      description: 'Informations personnelles'
    },
    {
      href: '/favoris',
      label: 'Mes favoris',
      icon: Heart,
      description: 'Annonces sauvegardées'
    },
    {
      href: '/mes-annonces',
      label: 'Mes annonces',
      icon: FileText,
      description: 'Gérer mes annonces'
    },
    {
      href: '/parametres',
      label: 'Paramètres',
      icon: Settings,
      description: 'Configuration du compte'
    }
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header de navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Breadcrumb */}
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="inline-flex items-center text-gray-500 hover:text-gray-700 transition-colors"
              >
                <Home className="w-4 h-4 mr-1" />
                Accueil
              </Link>
              <ChevronLeft className="w-4 h-4 text-gray-300 rotate-180" />
              <span className="text-gray-900 font-medium">Mon compte</span>
            </div>

            {/* Navigation principale */}
            <nav className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors
                      ${isActive(item.href)
                        ? 'bg-primary-50 text-primary-700 border border-primary-200'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Navigation mobile */}
      <div className="md:hidden bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex space-x-1 py-3 overflow-x-auto">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors
                    ${isActive(item.href)
                      ? 'bg-primary-50 text-primary-700 border border-primary-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* En-tête de page */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          {description && (
            <p className="text-gray-600 mt-2">{description}</p>
          )}
        </div>

        {/* Contenu */}
        {children}
      </div>
    </div>
  );
} 