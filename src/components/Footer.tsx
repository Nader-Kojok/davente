'use client';

import BaseLink from 'next/link';
import Image from 'next/image';

type FooterSection = {
  title: string;
  links: Array<{
    label: string;
    href: string;
  }>;
};

const footerSections: FooterSection[] = [
  {
    title: 'À propos de davente',
    links: [
      { label: 'Qui sommes-nous ?', href: '/about' },
      { label: 'Recrutement', href: '/careers' },
      { label: 'Le saviez-vous ?', href: '/blog' },
      { label: 'Nos applications', href: '/apps' },
    ],
  },
  {
    title: 'Informations légales',
    links: [
      { label: 'Conditions générales', href: '/terms' },
      { label: 'Respect de la vie privée', href: '/privacy' },
      { label: 'Cookies', href: '/cookies' },
      { label: 'Mentions légales', href: '/legal' },
    ],
  },
  {
    title: 'Des questions ?',
    links: [
      { label: 'Centre d\'aide', href: '/help' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Contact', href: '/contact' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8 mb-8">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-white font-semibold text-lg mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <BaseLink // Use BaseLink
                      href={link.href}
                      className="text-sm text-gray-300 hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </BaseLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center">
              <Image
                src="/logo.svg"
                alt="Davente Logo"
                width={80}
                height={30}
                className="h-6 w-auto"
              />
            </div>

            <div className="text-sm text-gray-400">
              © 2025 davente. Tous droits réservés.
            </div>
            
            <div className="flex items-center space-x-4">
              <BaseLink href="/fr" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                Français
              </BaseLink>
              <span className="text-gray-600">|</span>
              <BaseLink href="/en" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                English
              </BaseLink>
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
}
