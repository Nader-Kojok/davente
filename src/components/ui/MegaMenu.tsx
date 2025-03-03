'use client';

import Link from "next/link";
import { ChevronRight } from "lucide-react";

type SubCategory = {
  name: string;
  href: string;
  description?: string;
};

type CategorySection = {
  name: string;
  href: string;
  subcategories: SubCategory[];
};

type MegaMenuProps = {
  category: {
    name: string;
    href: string;
  };
  isOpen: boolean;
};

// Helper function to normalize category names (remove accents, etc.)
function normalizeCategoryName(name: string) {
  return name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

const categoryData: Record<string, CategorySection[]> = {
  vehicules: [
    {
      name: "Voitures",
      href: "/categories/vehicules/voitures",
      subcategories: [
        {
          name: "Audi",
          href: "/categories/vehicules/voitures/audi",
          description: "Voitures de luxe allemandes",
        },
        {
          name: "BMW",
          href: "/categories/vehicules/voitures/bmw",
          description: "Berlines et SUV premium",
        },
        {
          name: "Mercedes",
          href: "/categories/vehicules/voitures/mercedes",
          description: "Véhicules haut de gamme",
        },
        {
          name: "Peugeot",
          href: "/categories/vehicules/voitures/peugeot",
          description: "Voitures françaises populaires",
        },
      ],
    },
    {
      name: "Motos",
      href: "/categories/vehicules/motos",
      subcategories: [
        {
          name: "Honda",
          href: "/categories/vehicules/motos/honda",
          description: "Motos japonaises fiables",
        },
        {
          name: "Yamaha",
          href: "/categories/vehicules/motos/yamaha",
          description: "Motos sportives et routières",
        },
        {
          name: "Kawasaki",
          href: "/categories/vehicules/motos/kawasaki",
          description: "Motos performantes",
        },
        {
          name: "BMW",
          href: "/categories/vehicules/motos/bmw",
          description: "Motos touring haut de gamme",
        },
      ],
    },
  ],
  immobilier: [
    {
      name: "Location",
      href: "/categories/immobilier/location",
      subcategories: [
        {
          name: "Appartements",
          href: "/categories/immobilier/location/appartements",
          description: "Studios aux penthouses",
        },
        {
          name: "Maisons",
          href: "/categories/immobilier/location/maisons",
          description: "Villas et résidences",
        },
        {
          name: "Bureaux",
          href: "/categories/immobilier/location/bureaux",
          description: "Espaces professionnels",
        },
      ],
    },
    {
      name: "Vente",
      href: "/categories/immobilier/vente",
      subcategories: [
        {
          name: "Appartements",
          href: "/categories/immobilier/vente/appartements",
          description: "Du studio au duplex",
        },
        {
          name: "Maisons",
          href: "/categories/immobilier/vente/maisons",
          description: "Propriétés résidentielles",
        },
        {
          name: "Terrains",
          href: "/categories/immobilier/vente/terrains",
          description: "Parcelles constructibles",
        },
      ],
    },
  ],
};

export default function MegaMenu({ category, isOpen }: MegaMenuProps) {
  // Use the normalization helper to get the key
  const normalizedKey = normalizeCategoryName(category.name);
  const sections = categoryData[normalizedKey] || [];

  if (!isOpen || sections.length === 0) return null;

  return (
    <div
      className="absolute left-0 w-full bg-white shadow-lg border-t border-gray-200 transition-all duration-200 ease-in-out transform z-50"
      style={{ top: "100%" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10">
          {sections.map((section) => (
            <div key={section.name} className="col-span-1">
              <div className="flex items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  <Link
                    href={section.href}
                    className="hover:text-[#E00201] transition-colors duration-200"
                  >
                    {section.name}
                  </Link>
                </h3>
                <ChevronRight className="ml-2 h-5 w-5 text-gray-400" />
              </div>
              <ul className="space-y-4">
                {section.subcategories.map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className="group flex flex-col">
                      <span className="text-base font-medium text-gray-900 group-hover:text-[#E00201] transition-colors duration-200">
                        {item.name}
                      </span>
                      {item.description && (
                        <span className="mt-1 text-sm text-gray-500 group-hover:text-gray-700 transition-colors duration-200">
                          {item.description}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
