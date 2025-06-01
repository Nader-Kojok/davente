import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getCategoryBySlug, getSubcategoryBySlug } from '@/lib/categories';
import { searchListings } from '@/lib/search';
import CategoryListingsContent from './CategoryListingsContent';
import { Listing } from '@/types/listing';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    subcategory?: string;
    q?: string;
    location?: string;
    minPrice?: string;
    maxPrice?: string;
    condition?: string;
    userType?: string;
    sortBy?: string;
    page?: string;
  }>;
}

// Transform database annonce to Listing type
function transformAnnonceToListing(annonce: any): Listing {
  return {
    id: annonce.id.toString(),
    title: annonce.title,
    description: annonce.description,
    price: annonce.price,
    location: annonce.location,
    imageUrl: annonce.picture || '/images/placeholder.jpg',
    postedAt: annonce.createdAt.toISOString(),
    badges: [],
    condition: annonce.condition || 'good',
    deliveryAvailable: false,
    seller: {
      name: annonce.user?.name || 'Utilisateur',
      rating: 4.5,
      reviewCount: 0,
      avatarUrl: annonce.user?.picture || '/images/default-avatar.png'
    }
  };
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  const categorySlug = resolvedParams.slug;
  const subcategorySlug = resolvedSearchParams.subcategory;

  // Find the category
  const category = getCategoryBySlug(categorySlug);
  if (!category) {
    notFound();
  }

  // Find subcategory if specified
  let subcategory = null;
  let subcategoryName: string | undefined = undefined;
  if (subcategorySlug) {
    subcategory = getSubcategoryBySlug(categorySlug, subcategorySlug);
    if (!subcategory) {
      notFound();
    }
    // Utiliser le nom complet de la sous-catégorie pour la recherche
    subcategoryName = subcategory.name;
  }

  // Search for listings in this category/subcategory
  const searchResults = await searchListings({
    category: category.name,
    subcategory: subcategoryName,
    query: resolvedSearchParams.q,
    location: resolvedSearchParams.location,
    minPrice: resolvedSearchParams.minPrice ? parseFloat(resolvedSearchParams.minPrice) : undefined,
    maxPrice: resolvedSearchParams.maxPrice ? parseFloat(resolvedSearchParams.maxPrice) : undefined,
    condition: resolvedSearchParams.condition,
    userType: resolvedSearchParams.userType as 'individual' | 'business',
    sortBy: resolvedSearchParams.sortBy as any,
    page: resolvedSearchParams.page ? parseInt(resolvedSearchParams.page) : 1,
    limit: 20
  });

  const listings = searchResults.listings.map(transformAnnonceToListing);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Suspense fallback={<div>Chargement...</div>}>
        <CategoryListingsContent
          category={category}
          subcategory={subcategory}
          listings={listings}
          searchParams={resolvedSearchParams}
          total={searchResults.total}
        />
      </Suspense>
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  const categorySlug = resolvedParams.slug;
  const subcategorySlug = resolvedSearchParams.subcategory;

  const category = getCategoryBySlug(categorySlug);
  if (!category) {
    return {
      title: 'Catégorie non trouvée',
    };
  }

  const subcategory = subcategorySlug ? getSubcategoryBySlug(categorySlug, subcategorySlug) : null;

  const title = subcategory 
    ? `${subcategory.name} - ${category.name} | Davente`
    : `${category.name} | Davente`;

  const description = subcategory
    ? `Découvrez toutes les annonces de ${subcategory.name} dans la catégorie ${category.name} sur Davente.`
    : `Découvrez toutes les annonces de ${category.name} sur Davente. ${category.description || ''}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
  };
} 