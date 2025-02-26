import Link from 'next/link';
import Image from 'next/image';

type TrendingCategory = {
  title: string;
  image: string;
  href: string;
};

const trendingCategories: TrendingCategory[] = [
  {
    title: 'Immobilier',
    image: '/images/trending/immobilier.jpg',
    href: '/categories/immobilier'
  },
  {
    title: 'Véhicules',
    image: '/images/trending/vehicules.jpg',
    href: '/categories/vehicules'
  },
  {
    title: 'Électronique',
    image: '/images/trending/electronique.jpg',
    href: '/categories/electronique'
  },
  {
    title: 'Mode',
    image: '/images/trending/mode.jpg',
    href: '/categories/mode'
  }
];

export default function TrendingCategories() {
  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Title Card */}
          <div className="relative overflow-hidden rounded-2xl shadow-sm bg-gradient-to-br from-[#FFE5D9] to-[#FFCDB2] aspect-[3/4] flex items-center justify-center p-6">
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <svg
                  className="w-8 h-8 text-[#EC5A12]"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"
                    fill="currentColor"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C12.5523 2 13 2.44772 13 3V4.08296C16.0657 4.51904 18.4810 7.93353 18.4810 12C18.4810 16.0665 16.0657 19.481 13 19.917V21C13 21.5523 12.5523 22 12 22C11.4477 22 11 21.5523 11 21V19.917C7.93432 19.481 5.51903 16.0665 5.51903 12C5.51903 7.93353 7.93432 4.51904 11 4.08296V3C11 2.44772 11.4477 2 12 2ZM7.51903 12C7.51903 15.0376 9.70567 17.4810 12 17.4810C14.2943 17.4810 16.4810 15.0376 16.4810 12C16.4810 8.96243 14.2943 6.51903 12 6.51903C9.70567 6.51903 7.51903 8.96243 7.51903 12Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Tendance en ce moment</h2>
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
