import { Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnnonceDetailContent from './components/AnnonceDetailContent';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AnnonceDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <Suspense fallback={<AnnonceDetailSkeleton />}>
          <AnnonceDetailContent annonceId={id} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

function AnnonceDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb Skeleton */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 text-sm">
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
          <span>›</span>
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
          <span>›</span>
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Skeleton */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery Skeleton */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="aspect-[4/3] bg-gray-200 animate-pulse"></div>
          </div>

          {/* Product Info Skeleton */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse mb-4"></div>
            <div className="h-10 w-1/3 bg-gray-200 rounded animate-pulse mb-6"></div>
            <div className="space-y-3">
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-4/6 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Sidebar Skeleton */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse mr-4"></div>
              <div className="flex-1">
                <div className="h-5 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-12 w-full bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-12 w-full bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}