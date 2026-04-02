'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';

export default function CoachesSectionHome() {
  const { t, lang } = useTranslation();
  const router = useRouter();

  const title = String(t('coachesSection.title'));
  const subtitle = String(t('coachesSection.subtitle'));
  const button = String(t('coachesSection.button'));

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="bg-gradient-to-r from-red-950 to-black rounded-3xl p-12 text-center text-white mx-6 md:mx-20 my-20 shadow-2xl"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      <h2 className="text-4xl md:text-5xl font-black mb-4 animate-fadeIn">
        {title}
      </h2>
      <p className="text-lg md:text-xl text-red-400 mb-8 max-w-2xl mx-auto">
        {subtitle}
      </p>
      <button
        onClick={() => router.push(`/${lang}/coaches`)}
        className="px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
      >
        {button}
      </button>
    </motion.section>
  );
}