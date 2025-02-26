import Link from 'next/link';

type RecentSearch = {
  title: string;
  category: string;
  location: string;
  href: string;
};

const recentSearches: RecentSearch[] = [
  {
    title: 'Iphone 12',
    category: 'Téléphones & Objets connectés',
    location: 'Dakar',
    href: '/categories/electronique/iphone-12'
  },
  {
    title: 'Mixeur plongeant',
    category: 'Électroménager - Cuisine',
    location: 'Mbour',
    href: '/categories/maison/mixeur-plongeant'
  },
  {
    title: 'Électroménager',
    category: 'Cuisine',
    location: 'Tout le Sénégal',
    href: '/categories/maison/electromenager'
  }
];

export default function RecentSearches() {
  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl font-semibold mb-6">Recherches récentes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentSearches.map((search, index) => (
            <div
              key={index}
              className="relative bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200"
            >
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                aria-label="Remove search"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <Link href={search.href} className="block">
                <h3 className="font-bold text-lg mb-1">{search.title}</h3>
                <p className="text-sm font-semibold text-gray-600 mb-1">{search.category}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {search.location}
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}