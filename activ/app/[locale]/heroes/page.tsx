'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { Trophy, Medal, Star, User, X, ChevronRight } from 'lucide-react';
import api from '@/utils/api';

type Hero = {
  _id: string;
  name: string;
  sport?: string;
  bio?: string;
  image?: string;
  championships: string[];
};

export default function HeroesPage() {
  const t = useTranslations('heroes');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHero, setSelectedHero] = useState<Hero | null>(null);

  useEffect(() => {
    const fetchHeroes = async () => {
      try {
        const res = await api.get('/heroes');
        setHeroes(res.data);
      } catch (err) {
        console.error('Error fetching heroes:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHeroes();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <Trophy className="w-16 h-16 text-yellow-500 animate-bounce" />
          </div>
          <p className="text-xl font-bold text-white">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <section
      className="min-h-screen bg-black text-white relative overflow-hidden"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-yellow-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-20 left-10 w-64 h-64 bg-amber-600/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-40 right-10 w-64 h-64 bg-yellow-500/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20">

        {/* ── Header ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-6 py-2.5 bg-yellow-900/30 border border-yellow-700/40 rounded-full text-yellow-400 font-bold text-sm mb-6">
            <Trophy className="w-4 h-4" />
            <span>{t('badge')}</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            {t('title')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500">
              {t('titleHighlight')}
            </span>
          </h1>
          <p className="text-xl text-white/50 max-w-3xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* ── Stats bar ───────────────────────────────────────── */}
        {heroes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center gap-8 mb-16"
          >
            <div className="text-center">
              <div className="text-4xl font-black text-yellow-400">{heroes.length}</div>
              <div className="text-white/40 text-sm mt-1">{t('heroesCount')}</div>
            </div>
            <div className="w-px bg-white/10" />
            <div className="text-center">
              <div className="text-4xl font-black text-amber-400">
                {heroes.reduce((acc, h) => acc + (h.championships?.length || 0), 0)}
              </div>
              <div className="text-white/40 text-sm mt-1">{t('champCount')}</div>
            </div>
          </motion.div>
        )}

        {/* ── Heroes Grid ─────────────────────────────────────── */}
        {heroes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32"
          >
            <Trophy className="w-24 h-24 text-white/10 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-white/30">{t('noHeroes')}</h3>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {heroes.map((hero, index) => (
              <motion.div
                key={hero._id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * index, duration: 0.5 }}
                onClick={() => setSelectedHero(hero)}
                className="relative bg-[#0c0c0c] border border-yellow-900/20 hover:border-yellow-500/50 rounded-3xl overflow-hidden cursor-pointer group transition-all duration-400 hover:shadow-[0_0_40px_rgba(234,179,8,0.1)] hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative h-72 bg-gradient-to-br from-yellow-950/30 to-black overflow-hidden">
                  {hero.image ? (
                    <Image
                      src={hero.image}
                      alt={hero.name}
                      fill
                      className="object-cover object-top group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-28 h-28 text-yellow-900/30" />
                    </div>
                  )}
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                  {/* Sport badge */}
                  {hero.sport && (
                    <div className="absolute top-4 left-4 px-3 py-1.5 bg-yellow-500/90 backdrop-blur-sm rounded-full text-black text-xs font-black shadow-lg">
                      {hero.sport}
                    </div>
                  )}

                  {/* Championships count badge */}
                  {hero.championships?.length > 0 && (
                    <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-black/60 backdrop-blur-sm border border-yellow-500/30 rounded-full text-yellow-300 text-xs font-bold">
                      <Medal className="w-3.5 h-3.5 text-yellow-400" />
                      <span>{hero.championships.length}</span>
                    </div>
                  )}

                  {/* Bottom name overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-2xl font-black text-white group-hover:text-yellow-100 transition-colors">
                      {hero.name}
                    </h3>
                    {hero.bio && (
                      <p className="text-white/50 text-sm mt-1 line-clamp-1">{hero.bio}</p>
                    )}
                  </div>
                </div>

                {/* Championships preview */}
                <div className="p-5">
                  {hero.championships?.length > 0 ? (
                    <>
                      <p className="text-yellow-500/60 text-[10px] font-bold uppercase tracking-widest mb-3 flex items-center gap-1">
                        <Trophy className="w-3 h-3" /> {t('championsshipsLabel')}
                      </p>
                      <div className="space-y-1.5">
                        {hero.championships.slice(0, 3).map((champ, i) => (
                          <div key={i} className="flex items-center gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center text-[9px] font-black text-black flex-shrink-0">
                              {i + 1}
                            </span>
                            <span className="text-white/70 text-sm font-medium truncate">{champ}</span>
                          </div>
                        ))}
                        {hero.championships.length > 3 && (
                          <div className="flex items-center gap-2.5 mt-2">
                            <span className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                              <ChevronRight className="w-3 h-3 text-white/30" />
                            </span>
                            <span className="text-white/30 text-xs">
                              +{hero.championships.length - 3} {t('more')}
                            </span>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <p className="text-white/20 text-sm text-center py-2">{t('noChampionships')}</p>
                  )}

                  <button className="w-full mt-4 py-2.5 bg-gradient-to-r from-yellow-600/20 to-amber-500/20 hover:from-yellow-600/40 hover:to-amber-500/40 border border-yellow-700/30 hover:border-yellow-500/50 rounded-xl text-yellow-300 font-bold text-sm transition-all flex items-center justify-center gap-2 group-hover:shadow-lg">
                    {t('viewAll')}
                    <ChevronRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ── Hero Detail Modal ──────────────────────────────────── */}
      <AnimatePresence>
        {selectedHero && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedHero(null)}
            className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.85, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.85, y: 30, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0a0a0a] border border-yellow-900/30 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto text-white shadow-2xl"
            >
              {/* Modal Image */}
              <div className="relative h-64 rounded-t-3xl overflow-hidden">
                {selectedHero.image ? (
                  <Image src={selectedHero.image} alt={selectedHero.name} fill className="object-cover object-top" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-yellow-950/30 to-black flex items-center justify-center">
                    <User className="w-24 h-24 text-yellow-900/30" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />

                {/* Close button */}
                <button
                  onClick={() => setSelectedHero(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/80 transition"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Sport badge */}
                {selectedHero.sport && (
                  <div className="absolute top-4 left-4 px-3 py-1.5 bg-yellow-500/90 rounded-full text-black text-xs font-black">
                    {selectedHero.sport}
                  </div>
                )}
              </div>

              <div className="p-7">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-3xl font-black text-white">{selectedHero.name}</h3>
                    {selectedHero.bio && (
                      <p className="text-white/50 text-sm mt-2 leading-relaxed">{selectedHero.bio}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 bg-yellow-900/30 border border-yellow-700/30 rounded-xl px-3 py-2 flex-shrink-0">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-yellow-300 font-black text-sm">{selectedHero.championships?.length || 0}</span>
                  </div>
                </div>

                {/* All Championships */}
                {selectedHero.championships?.length > 0 && (
                  <div>
                    <h4 className="text-yellow-400/80 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Medal className="w-4 h-4" />
                      {t('allChampionships')} ({selectedHero.championships.length})
                    </h4>
                    <div className="space-y-2.5">
                      {selectedHero.championships.map((champ, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-center gap-3 p-3 bg-white/[0.03] border border-white/[0.06] hover:border-yellow-700/30 rounded-xl transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center text-xs font-black text-black flex-shrink-0 shadow-lg">
                            {i + 1}
                          </div>
                          <span className="text-white/80 font-semibold group-hover:text-white transition-colors">{champ}</span>
                          <Trophy className="w-3.5 h-3.5 text-yellow-500/40 ml-auto group-hover:text-yellow-400/70 transition-colors" />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setSelectedHero(null)}
                  className="w-full mt-6 py-3 bg-white/5 border border-white/10 rounded-xl font-semibold hover:bg-white/10 transition text-white/60 hover:text-white"
                >
                  {t('close')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
