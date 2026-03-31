'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import ar from '../messages/ar.json';
import en from '../messages/en.json';

interface CoachesSectionHomeProps {
  lang?: 'ar' | 'en';
}

export default function CoachesSectionHome({ lang = 'en' }: CoachesSectionHomeProps) {
  const texts = lang === 'ar' ? ar.coachesSection : en.coachesSection;
  const router = useRouter();

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="bg-gradient-to-r from-red-950 to-black rounded-3xl p-12 text-center text-white mx-6 md:mx-20 my-20 shadow-2xl"
    >
      <h2 className="text-4xl md:text-5xl font-black mb-4 animate-fadeIn">
        {texts.title}
      </h2>
      <p className="text-lg md:text-xl text-red-400 mb-8 max-w-2xl mx-auto">
        {texts.subtitle}
      </p>
      <button
        onClick={() => router.push('/coaches')}
        className="px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
      >
        {texts.button}
      </button>
    </motion.section>
  );
}