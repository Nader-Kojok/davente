'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  date: string;
  author: {
    name: string;
    avatarUrl: string;
  };
  category: string;
  readTime: string;
}

export default function BlogPage() {
  const blogPosts: BlogPost[] = [
    {
      id: '1',
      title: 'Comment bien photographier vos articles pour une meilleure vente',
      excerpt: 'Découvrez nos conseils pour réaliser des photos attrayantes de vos produits et augmenter vos chances de vente sur Grabi.',
      imageUrl: 'https://picsum.photos/800/400?random=1',
      date: '15 Mars 2025',
      author: {
        name: 'Fatou Diop',
        avatarUrl: 'https://i.pravatar.cc/150?img=5'
      },
      category: 'Conseils Vendeurs',
      readTime: '5 min de lecture'
    },
    {
      id: '2',
      title: 'Les tendances e-commerce au Sénégal en 2025',
      excerpt: 'Analyse des dernières tendances du commerce en ligne au Sénégal et des opportunités à saisir pour les entrepreneurs.',
      imageUrl: 'https://picsum.photos/800/400?random=2',
      date: '10 Mars 2025',
      author: {
        name: 'Moussa Diop',
        avatarUrl: 'https://i.pravatar.cc/150?img=1'
      },
      category: 'Tendances',
      readTime: '8 min de lecture'
    },
    {
      id: '3',
      title: 'Guide de sécurité pour les transactions en ligne',
      excerpt: 'Les meilleures pratiques pour sécuriser vos transactions et éviter les arnaques lors de vos achats en ligne.',
      imageUrl: 'https://picsum.photos/800/400?random=3',
      date: '5 Mars 2025',
      author: {
        name: 'Amadou Fall',
        avatarUrl: 'https://i.pravatar.cc/150?img=3'
      },
      category: 'Sécurité',
      readTime: '6 min de lecture'
    },
    {
      id: '4',
      title: 'Optimiser votre boutique en ligne pour plus de ventes',
      excerpt: 'Les stratégies essentielles pour améliorer la visibilité de votre boutique et augmenter vos conversions sur Grabi.',
      imageUrl: 'https://picsum.photos/800/400?random=4',
      date: '1 Mars 2025',
      author: {
        name: 'Aïssatou Ndiaye',
        avatarUrl: 'https://i.pravatar.cc/150?img=4'
      },
      category: 'Marketing Digital',
      readTime: '7 min de lecture'
    },
    {
      id: '5',
      title: 'Le mobile money au Sénégal : Guide complet pour les vendeurs',
      excerpt: 'Comment intégrer et optimiser les paiements mobiles dans votre stratégie de vente pour toucher plus de clients.',
      imageUrl: 'https://picsum.photos/800/400?random=5',
      date: '28 Février 2025',
      author: {
        name: 'Omar Sall',
        avatarUrl: 'https://i.pravatar.cc/150?img=6'
      },
      category: 'Paiements',
      readTime: '10 min de lecture'
    },
    {
      id: '6',
      title: 'Service client : Les meilleures pratiques pour fidéliser vos acheteurs',
      excerpt: 'Découvrez comment offrir une expérience client exceptionnelle et construire une base d\'acheteurs fidèles.',
      imageUrl: 'https://picsum.photos/800/400?random=6',
      date: '25 Février 2025',
      author: {
        name: 'Marième Faye',
        avatarUrl: 'https://i.pravatar.cc/150?img=7'
      },
      category: 'Service Client',
      readTime: '6 min de lecture'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Retour
          </Link>

          {/* Hero Section */}
          <div className="text-center mb-16">
            <Image
              src="/logo.svg"
              alt="Grabi Logo"
              width={160}
              height={60}
              className="mx-auto mb-8"
              priority
            />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Le Blog Grabi
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez nos articles, conseils et actualités sur le commerce en ligne au Sénégal.
            </p>
          </div>

          {/* Blog Posts */}
          <div className="space-y-12">
            {blogPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="relative aspect-[2/1]">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div className="p-8">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
                        <Image
                          src={post.author.avatarUrl}
                          alt={post.author.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{post.author.name}</p>
                        <p className="text-sm text-gray-500">{post.date}</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-[#E00201] font-medium">{post.category}</span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500">{post.readTime}</span>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{post.title}</h2>
                  <p className="text-gray-600 mb-6">{post.excerpt}</p>

                  <Link
                    href={`/blog/${post.id}`}
                    className="inline-flex items-center text-[#E00201] hover:text-red-700 font-medium"
                  >
                    Lire la suite
                    <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}