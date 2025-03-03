import PrimaryButton from './ui/PrimaryButton';
import Image from 'next/image';
import { SquarePlus } from 'lucide-react';

export default function Banner() {
  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-2xl shadow-lg max-w-6xl mx-auto">
        <div className="absolute inset-0">
          <Image
            src="/adinsertion_banner.png"
            alt="Background"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="text-center">
            <h1 className="text-4xl sm:text-3xl font-bold mb-4 font-heading">
              C&apos;est le moment de vendre
            </h1>
            <PrimaryButton href="/publier" icon={SquarePlus}>
              Déposer une annonce
            </PrimaryButton>
          </div>
        </div>
      </div>
    </section>
  );
}
