export interface TopCategory {
  id: number;
  name: string;
  slug: string;
  icon: string;
  description: string | null;
  annonceCount: number;
  href: string;
}

export interface CategoryWithSubcategories {
  id: number;
  name: string;
  slug: string;
  icon: string;
  description: string | null;
  isActive: boolean;
  sortOrder: number;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  sortOrder: number;
  categoryId: number;
}

export interface RecentListing {
  id: number;
  title: string;
  price: number;
  picture: string;
  location: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
    picture: string;
  };
  category: {
    id: number;
    name: string;
    slug: string;
  } | null;
  subcategory: {
    id: number;
    name: string;
    slug: string;
  } | null;
} 