import HeroSection from '../components/home/HeroSection';
import CategoriesSection from '../components/home/CategoriesSection';
import ValuePropsSection from '../components/home/ValuePropsSection';
import IndustriesSection from '../components/home/IndustriesSection';
import TrustSection from '../components/home/TrustSection';
import CTASection from '../components/home/CTASection';
import StatsSection from '../components/home/StatsSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <CategoriesSection />
      <ValuePropsSection />
      <IndustriesSection />
      <TrustSection />
      <CTASection />
    </>
  );
}
