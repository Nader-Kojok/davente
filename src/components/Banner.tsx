import Link from 'next/link';
import Image from 'next/image';

export default function Banner() {
  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-2xl shadow-lg max-w-7xl mx-auto">
        <div className="absolute inset-0">
          <Image
            src="/adinsertion_banner.avif"
            alt="Background"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="text-center">
            <h1 className="text-4xl sm:text-3xl font-bold mb-6 font-heading">
              C&apos;est le moment de vendre
            </h1>
            <Link
              href="/publier"
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-[#EC5A12] hover:bg-[#d94e0a] transition-colors duration-200 shadow-sm"
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                  clipRule="evenodd"
                />
              </svg>
              Déposer une annonce
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}