'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import dynamic from 'next/dynamic';
const BookButton = dynamic(() => import('../../components/BookNowButton'), { ssr: false });

export default function SportsPage() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'All Sports', icon: '🏅' },
    { id: 'kung-fu', name: 'Kung Fu', icon: '🥋' },
    { id: 'swimming', name: 'Swimming', icon: '🏊' },
    { id: 'gymnastics', name: 'Gymnastics', icon: '🤸' },
  ];

  // جلب الأنشطة من localStorage (اللي الادمن ضافها)
  useEffect(() => {
    const stored = localStorage.getItem('activities');
    if (stored) setWorkouts(JSON.parse(stored));
    setLoading(false);
  }, []);

  const filteredWorkouts = workouts.filter(w => {
    const matchesCategory = selectedCategory === 'all' || w.category === selectedCategory;
    const matchesSearch = w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>
  );

  return (
    <section className="min-h-screen bg-black py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-display font-black text-white mb-4">
            Our <span className="text-red-500">Sports Programs</span>
          </h1>
          <p className="text-xl text-red-400/80 max-w-3xl mx-auto">
            Discover our programs designed for all ages
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="max-w-2xl mx-auto mb-12">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search for sports..."
            className="w-full px-6 py-4 pr-14 rounded-2xl border-2 border-red-500 focus:border-red-700 focus:outline-none text-lg text-white bg-black"
          />
        </motion.div>

        {/* Categories */}
        <motion.div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((cat, i) => (
            <motion.button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-red-500 to-red-700 text-white shadow-lg scale-105'
                  : 'bg-black text-white border-2 border-red-500 hover:border-red-400 hover:shadow-lg hover:scale-105'
              }`}
            >
              <span className="text-2xl">{cat.icon}</span>
              <span>{cat.name}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Activities Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredWorkouts.map((w, idx) => (
            <motion.div
              key={w._id || idx}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
              className="bg-black rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl border-2 border-red-500 hover:border-red-400 transition-all duration-300"
            >
              {/* صورة النشاط */}
              <div className="relative h-56 bg-red-500/20 flex items-center justify-center overflow-hidden">
                {w.image ? (
                  <Image src={w.image} alt={w.name} fill className="object-cover hover:scale-110 transition-transform duration-500"/>
                ) : (
                  <span className="text-8xl text-red-500">{w.icon}</span>
                )}
              </div>

              {/* تفاصيل النشاط */}
              <div className="p-6">
                <h3 className="text-2xl font-display font-black text-white mb-2">{w.name}</h3>
                <p className="text-red-400/80 mb-2 line-clamp-2">{w.description}</p>

                <div className="space-y-2 mb-4 text-white/80">
                  <div className="flex items-center gap-3"><span>👤</span><span className="font-semibold">Coach: {w.coach}</span></div>
                  <div className="flex items-center gap-3"><span>📅</span><span className="font-semibold">Date: {w.date || '-'}</span></div>
                  <div className="flex items-center gap-3"><span>⏰</span><span className="font-semibold">Time: {w.time || '-'}</span></div>
                  <div className="flex items-center gap-3"><span>👥</span><span className="font-semibold">Age: {w.ageRange || 'All'}</span></div>
                  <div className="flex items-center gap-3 text-red-500"><span>💰</span><span className="font-bold text-lg">{w.price || '-'} EGP/month</span></div>
                  <div className="flex items-center gap-3"><span>📍</span><span className="font-semibold">Location: {w.location || '-'}</span></div>
                  <div className="flex items-center gap-3"><span>🎯</span><span className="font-semibold">Category: {w.category}</span></div>
                </div>

                {/* زرار الحجز */}
                <BookButton activity={w} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}