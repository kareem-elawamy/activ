'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';
import { Trophy, Star, Medal } from 'lucide-react';

export default function HeroesSectionHome() {
  const { t, lang } = useTranslation();
  const router = useRouter();

  // Using existing translations from the 'heroes' namespace
  const title = String(t('heroes.title'));
  const titleHighlight = String(t('heroes.titleHighlight'));
  const subtitle = String(t('heroes.subtitle'));
  const button = String(t('heroes.viewAll'));

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="relative overflow-hidden bg-gradient-to-br from-yellow-950/40 via-black to-black rounded-[2rem] p-12 text-center text-white mx-4 md:mx-20 my-24 border border-yellow-900/30 shadow-[0_0_50px_rgba(133,77,14,0.1)]"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Decorative Icons */}
      <div className="absolute top-10 left-10 opacity-10 -rotate-12 hidden md:block">
        <Trophy size={120} className="text-yellow-500" />
      </div>
      <div className="absolute bottom-10 right-10 opacity-10 rotate-12 hidden md:block">
        <Medal size={100} className="text-amber-500" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-900/30 border border-yellow-700/40 rounded-full text-yellow-400 font-bold text-xs mb-6 uppercase tracking-wider">
          <Star size={14} className="fill-yellow-400" />
          <span>{String(t('heroes.badge'))}</span>
        </div>

        <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
          {title}{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600">
            {titleHighlight}
          </span>
        </h2>

        <p className="text-lg md:text-xl text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>

        <button
          onClick={() => router.push(`/${lang}/heroes`)}
          className="group relative px-10 py-4 bg-gradient-to-r from-yellow-600 to-amber-500 text-black font-black text-lg rounded-2xl shadow-[0_10px_30px_rgba(180,130,0,0.3)] hover:shadow-[0_15px_40px_rgba(180,130,0,0.5)] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-2">
            {button}
            <Trophy size={20} />
          </span>
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
        </button>
      </div>

      {/* Background Glow */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-yellow-600/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-amber-600/10 rounded-full blur-[100px] pointer-events-none" />
    </motion.section>
  );
}
