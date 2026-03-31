'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function CoachesPage() {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [filterSport, setFilterSport] = useState('all');

  const sports = [
    { id: 'all', name: 'All Coaches', nameAr: 'جميع المدربين', icon: '👥' },
    { id: 'swimming', name: 'Swimming', nameAr: 'سباحة', icon: '🏊' },
    { id: 'gymnastics', name: 'Gymnastics', nameAr: 'جمباز', icon: '🤸' },
    { id: 'martial-arts', name: 'Martial Arts', nameAr: 'فنون قتالية', icon: '🥋' },
  ];

  useEffect(() => {
    fetchCoaches();
  }, []);

  const fetchCoaches = async () => {
    try {
      const response = await fetch('/api/coaches');
      const data = await response.json();
      setCoaches(data);
    } catch (error) {
      console.error('Error fetching coaches:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCoaches = coaches.filter((coach) => {
    if (filterSport === 'all') return true;
    return coach.specialization === filterSport;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce text-red-500">👨‍🏫</div>
          <p className="text-xl font-bold text-white">Loading coaches...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-black py-20 text-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-6 py-2 bg-red-900/50 border-2 border-red-500 rounded-full text-red-400 font-bold text-sm mb-4">
            Meet Our Team
          </span>
          <h1 className="text-5xl md:text-6xl font-black mb-4">
            Our Expert <span className="text-red-500">Coaches</span>
          </h1>
          <p className="text-xl text-red-400 max-w-3xl mx-auto leading-relaxed">
            Professional, certified coaches dedicated to helping you achieve your athletic goals
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
              className={`px-6 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 ${
                filterSport === sport.id
                  ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-xl scale-105'
                  : 'bg-red-900 text-red-400 hover:shadow-lg hover:scale-105'
              }`}
            >
              <span className="text-2xl">{sport.icon}</span>
              <span>{sport.name}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Coaches Grid */}
        {filteredCoaches.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCoaches.map((coach, index) => (
              <motion.div
                key={coach.id}
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
                    <div className="w-full h-full flex items-center justify-center text-9xl">
                      👨‍🏫
                    </div>
                  )}

                  {/* Overlay with Quick Info */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <div className="text-white">
                      <p className="text-sm font-semibold mb-1">Click for details</p>
                      <div className="flex items-center gap-2 text-orange-400">
                        <span>⭐</span>
                        <span className="font-bold">{coach.rating || '5.0'}/5</span>
                      </div>
                    </div>
                  </div>

                  {/* Badge */}
                  <div className="absolute top-4 right-4 px-4 py-2 bg-red-500 rounded-full text-white font-bold text-sm shadow-lg">
                    {sports.find(s => s.id === coach.specialization)?.icon || '🏃'} {sports.find(s => s.id === coach.specialization)?.name || coach.specialization}
                  </div>
                </div>

                {/* Coach Info */}
                <div className="p-6">
                  <h3 className="text-2xl font-black text-white mb-2">{coach.name}</h3>
                  <p className="text-red-500 font-bold mb-3">{coach.title || 'Professional Coach'}</p>
                  <p className="text-red-400 mb-4 line-clamp-2">
                    {coach.bio || 'Dedicated coach with years of experience in training athletes.'}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center bg-red-900/20 rounded-xl p-2">
                      <div className="text-2xl font-black text-red-500">{coach.experience || '10'}+</div>
                      <div className="text-xs text-red-400">Years</div>
                    </div>
                    <div className="text-center bg-red-900/20 rounded-xl p-2">
                      <div className="text-2xl font-black text-red-500">{coach.students || '200'}+</div>
                      <div className="text-xs text-red-400">Students</div>
                    </div>
                    <div className="text-center bg-red-900/20 rounded-xl p-2">
                      <div className="text-2xl font-black text-red-500">{coach.certifications || '5'}+</div>
                      <div className="text-xs text-red-400">Certs</div>
                    </div>
                  </div>

                  {/* View Profile Button */}
                  <button className="w-full py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all group-hover:scale-105">
                    View Profile →
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 text-red-400"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold mb-2">No coaches found</h3>
            <p>Try selecting a different sport category</p>
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
              className="bg-black rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto text-white"
            >
              {/* محتوى المودال بالكامل بنفس ألوان الداكنة والأحمر */}
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
          <h2 className="text-4xl font-black mb-4">Want to Join Our Team?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            We're always looking for passionate, certified coaches to join our academy
          </p>
          <button className="px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all">
            Apply Now
          </button>
        </motion.div>
      </div>
    </section>
  );
}