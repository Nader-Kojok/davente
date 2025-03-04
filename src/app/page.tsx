import Header from '@/components/Header';
import Hero from '@/components/Banner';
import RecentSearches from '@/components/RecentSearches';
import TrendingCategories from '@/components/TrendingCategories';
import TopCategories from '@/components/TopCategories';
import CurrentListings from '@/components/CurrentListings';
import LegalText from '@/components/LegalText';
import MegaFooter from '@/components/ui/MegaFooter';
import Footer from '@/components/Footer';


export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <RecentSearches />
        <TrendingCategories />
        <TopCategories />
        <CurrentListings />
        <LegalText />
        <MegaFooter />
        <Footer />
      </main>
    </div>
  );
}