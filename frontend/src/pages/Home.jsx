import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import PopularHotels from '../components/PopularHotels';
import FeaturedDestinations from '../components/FeaturedDestinations';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <PopularHotels />
        <FeaturedDestinations />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
