import HeroSection from '@/components/HeroSection';
import AboutUs from '@/components/AboutUs';
import ContactUs from '@/components/ContactUs';
import Testimonials from '@/components/Testimonials';
import ComplaintSection from '@/components/ComplaintSection';
import OwnersSection from '@/components/Ownersection';
import CoachesSectionHome from '@/components/CoachesSectionHome';
import HeroesSectionHome from '@/components/HeroesSectionHome';

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutUs />
      <OwnersSection />
      <CoachesSectionHome />
      <HeroesSectionHome />
      <Testimonials />
      <ContactUs />
      <ComplaintSection />
    </>
  );
}