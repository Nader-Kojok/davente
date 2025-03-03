// components/ui/ProductDetails.tsx
import { MapPin } from 'lucide-react';
import { useState } from 'react';

interface Specification {
  label: string;
  value: string;
}

interface ProductDetailsProps {
  description: string;
  specifications: Specification[];
  location: string;
  deliveryOptions: string[];
  shippingCost: number;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({
  description,
  specifications,
  location,
  deliveryOptions,
  shippingCost,
}) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content - Description and Specifications */}
      <div className="lg:col-span-2 space-y-8">
        {/* Description */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Description
          </h2>
          <div className="relative">
            <div
              className={`text-gray-600 whitespace-pre-line leading-relaxed overflow-hidden transition-[max-height] duration-300 ease-in-out ${expanded ? 'max-h-[2000px]' : 'max-h-[200px]'}`}
            >
              {description}
            </div>
            {!expanded && (
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
            )}
            <button
              onClick={toggleExpanded}
              className="mt-4 text-[#E00201] hover:text-[#CB0201] font-medium transition-colors duration-200 relative z-10 bg-white py-2 px-4"
            >
              {expanded ? 'Voir moins' : 'Lire la suite'}
            </button>
          </div>
        </div>

        {/* Specifications */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Caractéristiques
          </h2>
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <tbody className="divide-y divide-gray-200">
                {specifications.map((spec: Specification, index: number) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {spec.label}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900 font-medium text-right">
                      {spec.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Sidebar - Location and Delivery */}
      <div className="lg:col-span-1">
        <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-6">
          {/* Location */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Localisation
            </h3>
            <div className="flex items-center text-gray-600">
              <MapPin className="w-5 h-5 mr-2 flex-shrink-0" />
              <span>{location}</span>
            </div>
          </div>

          {/* Delivery Options */}
          <div className="pt-6 border-t border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Options de livraison
            </h3>
            <ul className="space-y-3">
              {deliveryOptions.map((option: string, index: number) => (
                <li key={index} className="flex items-start">
                  <span className="inline-block w-2 h-2 rounded-full bg-gray-400 mt-2 mr-2" />
                  <span className="text-gray-600">{option}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm font-medium text-gray-900">
                Frais de livraison:{' '}
                <span className="text-[#E00201]">{shippingCost} €</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
