'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { Users, Waves, Activity, Dumbbell, UserSquare2, Medal, User, Star, Search, X } from 'lucide-react';
import api from '@/utils/api';

export default function CoachesPage() {
  const t = useTranslations('coaches');
  const locale = useLocale();
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [filterSport, setFilterSport] = useState('all');

  const sports = [
    { id: 'all', label: t('allCoaches'), icon: <Users className="w-6 h-6" /> },
    { id: 'سباحة', label: 'سباحة', icon: <Waves className="w-6 h-6" /> },
    { id: 'تأهيل حركى', label: 'تأهيل حركى', icon: <Activity className="w-6 h-6" /> },
    { id: 'كمال اجسام', label: 'كمال أجسام', icon: <Dumbbell className="w-6 h-6" /> },
    { id: 'جمباز', label: 'جمباز', icon: <UserSquare2 className="w-6 h-6" /> },
    { id: 'تايكوندو', label: 'تايكوندو', icon: <Medal className="w-6 h-6" /> },
  ];

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const res = await api.get('/coaches');
        setCoaches(res.data);
      } catch (error) {
        console.error('Error fetching coaches:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCoaches();
  }, []);

  const filteredCoaches = coaches.filter((coach) => {
    if (filterSport === 'all') return true;
    return coach.specialty === filterSport;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4 flex justify-center animate-bounce"><User className="w-16 h-16 text-red-500" /></div>
          <p className="text-xl font-bold text-white">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-black py-20 text-white" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-6 py-2 bg-red-900/50 border-2 border-red-500 rounded-full text-red-400 font-bold text-sm mb-4">
            {t('badge')}
          </span>
          <h1 className="text-5xl md:text-6xl font-black mb-4">
            {t('title')} <span className="text-red-500">{t('titleHighlight')}</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Sport Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {sports.map((sport, index) => (
            <motion.button
              key={sport.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              onClick={() => setFilterSport(sport.id)}
              className={`px-6 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 ${filterSport === sport.id
                  ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-xl scale-105'
                  : 'bg-red-900 text-gray-300 hover:shadow-lg hover:scale-105'
                }`}
            >
              <span className="flex items-center justify-center">{sport.icon}</span>
              <span>{sport.label}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Coaches Grid */}
        {filteredCoaches.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCoaches.map((coach, index) => (
              <motion.div
                key={coach._id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                onClick={() => setSelectedCoach(coach)}
                className="bg-black rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-red-500 hover:border-orange-500 cursor-pointer group"
              >
                {/* Coach Image */}
                <div className="relative h-80 bg-gradient-to-br from-red-950 to-black overflow-hidden">
                  {coach.image ? (
                    <Image
                      src={coach.image}
                      alt={coach.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-red-950">
                      <User className="w-32 h-32 text-red-900/40" />
                    </div>
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <div className="text-white">
                      <p className="text-sm font-semibold mb-1">{t('clickDetails')}</p>
                      <div className="flex items-center gap-2 text-orange-400">
                        <span>⭐</span>
                        <span className="font-bold">{coach.rating || '5.0'}/5</span>
                      </div>
                    </div>
                  </div>

                  {/* Badge */}
                  {coach.specialty && (
                    <div className="absolute top-4 right-4 px-4 py-2 bg-red-500 rounded-full text-white font-bold text-sm shadow-lg flex items-center gap-1.5">
                      <span className="w-4 h-4">{sports.find(s => s.id === coach.specialty)?.icon || <Activity className="w-4 h-4" />}</span>
                      <span>{sports.find(s => s.id === coach.specialty)?.label || coach.specialty}</span>
                    </div>
                  )}
                </div>

                {/* Coach Info */}
                <div className="p-6">
                  <h3 className="text-2xl font-black text-white mb-2">{coach.name}</h3>
                  <p className="text-white/70 font-bold mb-3">{coach.title || coach.specialty || ''}</p>
                  <p className="text-gray-400 mb-4 line-clamp-2">
                    {coach.bio || ''}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center bg-red-900/20 rounded-xl p-2">
                      <div className="text-2xl font-black text-white">{coach.experience || '0'}+</div>
                      <div className="text-xs text-gray-400">{t('years')}</div>
                    </div>
                    <div className="text-center bg-red-900/20 rounded-xl p-2">
                      <div className="text-2xl font-black text-white">{coach.students || '0'}+</div>
                      <div className="text-xs text-gray-400">{t('students')}</div>
                    </div>
                    <div className="text-center bg-red-900/20 rounded-xl p-2">
                      <div className="text-2xl font-black text-white">{coach.certifications || '0'}+</div>
                      <div className="text-xs text-gray-400">{t('certs')}</div>
                    </div>
                  </div>

                  {/* View Profile Button */}
                  <button className="w-full py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all group-hover:scale-105">
                    {t('viewProfile')}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 text-gray-400"
          >
            <div className="flex justify-center mb-4"><Search className="w-16 h-16 text-white/20" /></div>
            <h3 className="text-2xl font-bold mb-2 text-white">{t('noCoaches')}</h3>
            <p className="text-white/40">{t('noCoachesHint')}</p>
          </motion.div>
        )}

        {/* Coach Detail Modal */}
        {selectedCoach && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCoach(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0a0a0a] border border-red-900/40 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto text-white p-8"
            >
              <div className="text-center">
                <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-red-600 mb-4">
                  {selectedCoach.image ? (
                    <Image src={selectedCoach.image} alt={selectedCoach.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-red-950">
                      <User className="w-16 h-16 text-red-900/50" />
                    </div>
                  )}
                </div>
                <h3 className="text-2xl font-black">{selectedCoach.name}</h3>
                <p className="text-red-400 font-bold">{selectedCoach.title || selectedCoach.specialty}</p>
                {selectedCoach.bio && <p className="text-white/60 mt-4 text-sm leading-relaxed">{selectedCoach.bio}</p>}

                <div className="grid grid-cols-3 gap-3 mt-6">
                  <div className="bg-red-950/30 rounded-xl p-3">
                    <div className="text-xl font-black text-red-500">{selectedCoach.experience || '0'}+</div>
                    <div className="text-xs text-white/40">{t('years')}</div>
                  </div>
                  <div className="bg-red-950/30 rounded-xl p-3">
                    <div className="text-xl font-black text-red-500">{selectedCoach.students || '0'}+</div>
                    <div className="text-xs text-white/40">{t('students')}</div>
                  </div>
                  <div className="bg-red-950/30 rounded-xl p-3">
                    <div className="text-xl font-black text-red-500 flex items-center justify-center gap-1">
                      <Star className="w-5 h-5 fill-red-500" />
                      {selectedCoach.rating || '5.0'}
                    </div>
                    <div className="text-xs text-white/40 mt-1">{t('certs')}</div>
                  </div>
                </div>

                <button onClick={() => setSelectedCoach(null)} className="mt-6 w-full py-3 bg-white/5 border border-white/10 rounded-xl font-semibold hover:bg-white/10 transition flex items-center justify-center">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Join Our Team CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-20 bg-gradient-to-r from-red-950 to-black rounded-3xl p-12 text-center text-white"
        >
          <h2 className="text-4xl font-black mb-4">{t('joinTeamTitle')}</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            {t('joinTeamSubtitle')}
          </p>
          <button className="px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all">
            {t('applyNow')}
          </button>
        </motion.div>
      </div>
    </section>
  );
}