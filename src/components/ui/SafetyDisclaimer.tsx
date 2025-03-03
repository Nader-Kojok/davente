'use client';

import { AlertTriangle } from 'lucide-react';

const SafetyDisclaimer = () => {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mt-8">
      <div className="flex items-start space-x-3">
        <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
        <div>
          <h3 className="text-lg font-semibold text-amber-800 mb-3">
            Conseils de sécurité
          </h3>
          <ul className="space-y-2 text-amber-700">
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-400 mt-2 mr-2" />
              <span>Évitez de payer des frais cachés ou des frais d&apos;inspection.</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-400 mt-2 mr-2" />
              <span>Si possible, inspectez l&apos;objet ou le service en compagnie d&apos;une personne de confiance.</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-400 mt-2 mr-2" />
              <span>Vérifiez minutieusement ce que vous achetez ou louez pour vous assurer que cela correspond à vos besoins.</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-400 mt-2 mr-2" />
              <span>Ne payez pas d&apos;avance si vous ne pouvez pas utiliser ou recevoir le produit/service immédiatement.</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-400 mt-2 mr-2" />
              <span>Renseignez-vous sur le vendeur ou le prestataire de services pour éviter les arnaques.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SafetyDisclaimer;