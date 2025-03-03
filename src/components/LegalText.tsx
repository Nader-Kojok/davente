"use client";

import BaseLink from "@/components/ui/BaseLink";

export default function LegalText() {
  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <p className="p text-sm text-gray-600 leading-relaxed">
          Avec davente, trouvez la bonne affaire sur le site référent de petites annonces de particulier à particulier et de professionnels. Avec des millions de petites annonces, trouvez la bonne occasion dans nos catégories{" "}
          <BaseLink href="/categories/voitures">voitures</BaseLink>,{" "}
          <BaseLink href="/categories/immobilier">immobilier</BaseLink>,{" "}
          <BaseLink href="/categories/emploi">emploi</BaseLink>,{" "}
          <BaseLink href="/categories/vacances">location de vacances</BaseLink>,{" "}
          <BaseLink href="/categories/vetements">vêtements</BaseLink>,{" "}
          <BaseLink href="/categories/meubles">meubles</BaseLink>,{" "}
          <BaseLink href="/categories/bricolage">bricolage</BaseLink>,{" "}
          <BaseLink href="/categories/telephonie">téléphonie</BaseLink>,{" "}
          <BaseLink href="/categories/jeux-video">jeux vidéo</BaseLink>, etc. Déposez une annonce gratuite en toute simplicité pour vendre, rechercher, donner vos biens de seconde main ou promouvoir vos services. Pour cet été, découvrez nos idées de destination avec notre{" "}
          <BaseLink href="/guide-vacances">guide de vacances au Sénégal</BaseLink>. Achetez en toute sécurité avec notre système de paiement en ligne et de livraison pour les annonces éligibles.
        </p>
      </div>
    </section>
  );
}
