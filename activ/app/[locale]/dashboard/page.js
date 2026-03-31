import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import Footer from '@/components/Footer';
import AboutUs from '@/components/AboutUs';
import ContactUs from '@/components/ContactUs';
import Testimonials from '@/components/Testimonials';

export default function Dashboard() {
  return (
    <>
      < Navbar />
      <HeroSection />
      <AboutUs />
      <Testimonials />
      <ContactUs />
      <Footer />
    </>
  )
}
