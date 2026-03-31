import HeroSection from '@/components/HeroSection';
import AboutUs from '@/components/AboutUs';
import ContactUs from '@/components/ContactUs';
import Testimonials from '@/components/Testimonials';
import ComplaintSection from '@/components/ComplaintSection';
import Ownersection from '@/components/Ownersection';
import CoachesSectionHome from '@/components/CoachesSectionHome';

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutUs />
      <Ownersection />
      <CoachesSectionHome />
      <Testimonials />
      <ContactUs />
      <ComplaintSection />
    </>
  );
}