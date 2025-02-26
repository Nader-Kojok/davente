import Header from '@/components/Header';
import Hero from '@/components/Banner';
import RecentSearches from '@/components/RecentSearches';
import TrendingCategories from '@/components/TrendingCategories';
import TopCategories from '@/components/TopCategories';
import CurrentListings from '@/components/CurrentListings';

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
      </main>
    </div>
  );
}