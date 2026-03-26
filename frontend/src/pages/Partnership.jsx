import { useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  PartnerHero,
  BenefitsSection,
  HowItWorks,
  PartnerForm,
  Testimonials,
  FAQ,
} from '../components/partnership';

const Partnership = () => {
  const formRef = useRef(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <PartnerHero onRegisterClick={scrollToForm} />

        {/* Benefits Section */}
        <BenefitsSection />

        {/* How It Works */}
        <HowItWorks />

        {/* Testimonials */}
        <Testimonials />

        {/* Partner Registration Form */}
        <div ref={formRef}>
          <PartnerForm />
        </div>

        {/* FAQ */}
        <FAQ />
      </main>

      <Footer />
    </div>
  );
};

export default Partnership;
