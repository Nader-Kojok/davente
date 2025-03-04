"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ReactNode } from "react";
import React from "react";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  date: string;
  author: {
    name: string;
    avatarUrl: string;
    bio: string;
  };
  category: string;
  readTime: string;
  tags: string[];
}

interface ParsedListItem {
  type: "ul";
  items: ReactNode[];
}

type ParsedContent = string | number | ReactNode | ParsedListItem;

const parseContent = (content: string): ReactNode[] => {
  const lines = content.split("\n");
  const result: ParsedContent[] = [];
  let currentList: ParsedListItem | null = null;

  for (const line of lines) {
    if (line.trim() === "") {
      if (currentList) {
        result.push(currentList);
        currentList = null;
      }
      result.push(<div key={result.length} className="my-6" />);
      continue;
    }

    if (
      line.startsWith("1. ") ||
      line.startsWith("2. ") ||
      line.startsWith("3. ") ||
      line.startsWith("4. ") ||
      line.startsWith("5. ") ||
      line.startsWith("6. ")
    ) {
      if (currentList) {
        result.push(currentList);
        currentList = null;
      }
      const text = line.substring(line.indexOf(". ") + 2).trim();
      const number = line.substring(0, line.indexOf(".")).trim();
      result.push(
        <div key={result.length} className="mb-6">
          <h3 className="text-2xl font-semibold text-gray-900 mb-3 flex items-baseline gap-3">
            <span className="text-[#E00201] text-xl font-bold">{number}.</span>
            {text}
          </h3>
        </div>
      );
    } else if (line.startsWith("- ")) {
      const text = line.substring(2).trim();
      if (!currentList) {
        currentList = { type: "ul", items: [] };
      }
      currentList.items.push(
        <li key={currentList.items.length} className="text-gray-700 mb-2">
          {text}
        </li>
      );
    } else if (line.toLowerCase().startsWith("conclusion")) {
      if (currentList) {
        result.push(currentList);
        currentList = null;
      }
      result.push(
        <div key={result.length} className="mt-8 mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-4">{line}</h3>
        </div>
      );
    } else {
      if (currentList) {
        result.push(currentList);
        currentList = null;
      }
      result.push(
        <p key={result.length} className="text-gray-700 leading-relaxed mb-4">
          {line}
        </p>
      );
    }
  }

  if (currentList) {
    result.push(currentList);
  }

  return result.map((item, index) => {
    if (
      typeof item === "string" ||
      typeof item === "number" ||
      React.isValidElement(item)
    ) {
      return item;
    } else if (item && (item as ParsedListItem).type === "ul") {
      return (
        <ul
          key={index}
          className="list-disc list-inside space-y-2 mb-6 ml-6 text-gray-700"
        >
          {(item as ParsedListItem).items}
        </ul>
      );
    }
    return null;
  });
};

export default function BlogArticlePage() {
  const params = useParams();

  // Mock data for the blog post
  const blogPost: BlogPost = {
    id: params.id as string,
    title: "Comment bien photographier vos articles pour une meilleure vente",
    content: `La qualité des photos de vos produits peut faire toute la différence dans votre succès de vente sur davente. Voici un guide complet pour vous aider à réaliser des photos professionnelles qui mettront en valeur vos articles.

1. L'importance de la lumière La lumière naturelle est votre meilleure alliée. Photographiez vos produits près d'une fenêtre ou en extérieur par temps nuageux pour obtenir un éclairage doux et uniforme. Évitez la lumière directe du soleil qui peut créer des ombres trop marquées.

2. Choisir le bon fond Un fond neutre et simple mettra en valeur votre produit. Optez pour un fond blanc, gris clair ou une texture subtile qui ne détournera pas l'attention de l'article. Vous pouvez utiliser un carton, un drap ou un papier pour créer un fond propre.

3. Multiplier les angles Prenez plusieurs photos sous différents angles pour donner une vue complète de votre produit. Les acheteurs apprécient de pouvoir examiner l'article sous toutes ses coutures :
- Vue de face
- Vue de dos
- Vues latérales
- Gros plans sur les détails

4. Soigner la mise au point Assurez-vous que vos photos sont nettes et bien focalisées. Utilisez un trépied si nécessaire pour éviter les flous de bougé. Pour les petits objets, n'hésitez pas à utiliser le mode macro de votre appareil.

5. Montrer l'échelle Incluez des éléments de référence pour donner une idée de la taille de votre produit. Vous pouvez utiliser une règle, une pièce de monnaie ou tout autre objet courant qui aide à comprendre les dimensions.

6. Post-traitement minimal Si vous retouchez vos photos, restez subtil. Ajustez légèrement la luminosité, le contraste et la balance des blancs si nécessaire, mais gardez un rendu naturel qui correspond à la réalité du produit.

Conclusion Des photos de qualité augmenteront significativement vos chances de vente. Prenez le temps de créer un environnement propice et d'expérimenter différentes techniques pour trouver ce qui met le mieux en valeur vos produits.`,
    imageUrl: "https://picsum.photos/1200/600?random=1",
    date: "15 Mars 2025",
    author: {
      name: "Fatou Diop",
      avatarUrl: "https://i.pravatar.cc/150?img=5",
      bio:
        "Experte en marketing digital et photographie de produits. Passionnée par l'e-commerce et le partage de connaissances.",
    },
    category: "Conseils Vendeurs",
    readTime: "5 min de lecture",
    tags: ["Photographie", "E-commerce", "Vente", "Conseils", "Marketing"],
  };

  const parsedContent = parseContent(blogPost.content);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50 py-16 md:py-20">
        <article className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            href="/blog"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-16 transition-colors duration-200"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Retour au blog
          </Link>

          {/* Article Header */}
          <header className="mb-16">
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <div className="flex items-center">
                <div className="relative w-14 h-14 rounded-full overflow-hidden mr-4 ring-2 ring-white shadow-md">
                  <Image
                    src={blogPost.author.avatarUrl}
                    alt={blogPost.author.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    {blogPost.author.name}
                  </p>
                  <p className="text-base text-gray-600">{blogPost.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-base">
                <span className="text-gray-400">•</span>
                <span className="text-[#E00201] font-medium">
                  {blogPost.category}
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">{blogPost.readTime}</span>
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-10 leading-tight tracking-tight">
              {blogPost.title}
            </h1>

            {/* Tags */}
            <div className="flex flex-wrap gap-3 mb-12">
              {blogPost.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-5 py-2 bg-gray-100 text-gray-700 text-base font-medium rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Hero Image */}
            <div className="relative aspect-[2/1] rounded-2xl overflow-hidden mb-16 shadow-lg">
              <Image
                src={blogPost.imageUrl}
                alt={blogPost.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </header>

          {/* Article Content */}
          <div className="prose prose-lg md:prose-xl max-w-none mb-20">
            {parsedContent}
          </div>

          {/* Author Bio */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-10 mb-16">
            <div className="flex flex-col md:flex-row md:items-start gap-8">
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 ring-4 ring-gray-50">
                <Image
                  src={blogPost.author.avatarUrl}
                  alt={blogPost.author.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  À propos de l&apos;auteur
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {blogPost.author.bio}
                </p>
              </div>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-12 border-t border-gray-200">
            <button className="w-full sm:w-auto px-8 py-4 bg-[#1DA1F2] text-white rounded-xl hover:bg-[#1a91da] transition-all duration-200 font-semibold shadow-sm hover:shadow-md flex items-center justify-center gap-2">
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
              Partager sur Twitter
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-[#4267B2] text-white rounded-xl hover:bg-[#365899] transition-all duration-200 font-semibold shadow-sm hover:shadow-md flex items-center justify-center gap-2">
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Partager sur Facebook
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-[#0077B5] text-white rounded-xl hover:bg-[#006399] transition-all duration-200 font-semibold shadow-sm hover:shadow-md flex items-center justify-center gap-2">
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              Partager sur LinkedIn
            </button>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
