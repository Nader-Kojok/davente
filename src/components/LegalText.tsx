"use client";

import Link from "next/link";

export default function LegalText() {
  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <p className="text-sm text-gray-600 leading-relaxed">
          Avec davente, trouvez la bonne affaire sur le site référent de petites annonces de particulier à particulier et de professionnels. Avec des millions de petites annonces, trouvez la bonne occasion dans nos catégories{" "}
          <Link href="/categories/voitures" className="text-[#EC5A12] hover:text-[#d94e0a] transition-colors duration-200">voitures</Link>,{" "}
          <Link href="/categories/immobilier" className="text-[#EC5A12] hover:text-[#d94e0a] transition-colors duration-200">immobilier</Link>,{" "}
          <Link href="/categories/emploi" className="text-[#EC5A12] hover:text-[#d94e0a] transition-colors duration-200">emploi</Link>,{" "}
          <Link href="/categories/vacances" className="text-[#EC5A12] hover:text-[#d94e0a] transition-colors duration-200">location de vacances</Link>,{" "}
          <Link href="/categories/vetements" className="text-[#EC5A12] hover:text-[#d94e0a] transition-colors duration-200">vêtements</Link>,{" "}
          <Link href="/categories/meubles" className="text-[#EC5A12] hover:text-[#d94e0a] transition-colors duration-200">meubles</Link>,{" "}
          <Link href="/categories/bricolage" className="text-[#EC5A12] hover:text-[#d94e0a] transition-colors duration-200">bricolage</Link>,{" "}
          <Link href="/categories/telephonie" className="text-[#EC5A12] hover:text-[#d94e0a] transition-colors duration-200">téléphonie</Link>,{" "}
          <Link href="/categories/jeux-video" className="text-[#EC5A12] hover:text-[#d94e0a] transition-colors duration-200">jeux vidéo</Link>, etc. Déposez une annonce gratuite en toute simplicité pour vendre, rechercher, donner vos biens de seconde main ou promouvoir vos services. Pour cet été, découvrez nos idées de destination avec notre{" "}
          <Link href="/guide-vacances" className="text-[#EC5A12] hover:text-[#d94e0a] transition-colors duration-200">guide de vacances au Sénégal</Link>. Achetez en toute sécurité avec notre système de paiement en ligne et de livraison pour les annonces éligibles.
        </p>
      </div>
    </section>
  );
}