import Link from 'next/link';
import Image from 'next/image';
import { Flame } from 'lucide-react';

type TrendingCategory = {
  title: string;
  image: string;
  href: string;
};

const trendingCategories: TrendingCategory[] = [
  {
    title: 'Immobilier',
    image: 'https://picsum.photos/800/1200?category=architecture',
    href: '/categories/immobilier'
  },
  {
    title: 'Véhicules',
    image: 'https://picsum.photos/800/1200?category=cars',
    href: '/categories/vehicules'
  },
  {
    title: 'Électronique',
    image: 'https://picsum.photos/800/1200?category=tech',
    href: '/categories/electronique'
  },
  {
    title: 'Mode',
    image: 'https://picsum.photos/800/1200?category=fashion',
    href: '/categories/mode'
  }
];

export default function TrendingCategories() {
  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Title Card */}
          <div className="relative overflow-hidden rounded-2xl shadow-sm bg-gradient-to-bl from-[#FFEECD] to-[#F7D8D5] aspect-[3/4] p-6">
            <div className="flex flex-col">
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                Tendance en ce moment
                </h2>
                <Flame className="w-6 h-6 text-[#152233]" />
            </div>
          </div>

          {/* Category Cards */}
          {trendingCategories.map((category) => (
            <Link
              key={category.title}
              href={category.href}
              className="group relative overflow-hidden rounded-2xl shadow-sm aspect-[3/4] bg-gray-100"
            >
              <Image
                src={category.image}
                alt={category.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-lg font-medium text-white">{category.title}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
