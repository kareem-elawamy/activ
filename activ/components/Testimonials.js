'use client';
import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';
import { IoMdHappy } from "react-icons/io";
import { MdFamilyRestroom, MdStarRate } from "react-icons/md";
import { useTranslation } from '@/hooks/useTranslation';

const Testimonials = () => {
  const { t, lang } = useTranslation();

  const sectionLabel = String(t('testimonials.title'));
  const sectionSubtitle = String(t('testimonials.subtitle'));
  const sectionDesc = String(t('testimonials.description'));
  const happyVisitors = String(t('testimonials.happyVisitors'));
  const happyFamilies = String(t('testimonials.happyFamilies'));
  const averageRating = String(t('testimonials.averageRating'));

  const [stats] = useState([
    { icon: <IoMdHappy className="w-20 h-20 text-red-600" />, value: '98%', target: 98, suffix: '%', color: 'bg-red-600' },
    { icon: <MdFamilyRestroom className="w-20 h-20 text-red-600" />, value: '500+', target: 500, suffix: '+', color: 'bg-red-600' },
    { icon: <MdStarRate className="w-20 h-20 text-red-600" />, value: '4.9/5', target: 4.9, suffix: '/5', color: 'bg-red-600' },
  ]);

  const statLabels = [happyVisitors, happyFamilies, averageRating];

  const [animated, setAnimated] = useState(false);
  const statsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animated) {
            setAnimated(true);
            animateCounters();
          }
        });
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, [animated]);

  const animateCounters = () => {
    const duration = 2000;
    const frameRate = 1000 / 60;
    
    stats.forEach((stat, index) => {
      let current = 0;
      const target = stat.target;
      const increment = target / (duration / frameRate);
      
      const counter = setInterval(() => {
        current += increment;
        const element = document.getElementById(`counter-${index}`);
        if (element) {
          if (current >= target) {
            element.textContent = target % 1 === 0 ? target : target.toFixed(1);
            clearInterval(counter);
          } else {
            element.textContent = Math.floor(current);
          }
        }
      }, frameRate);
    });
  };

  return (
    <section className="py-20 bg-black mt-20" id="testimonials" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-6 py-2 bg-red-600/20 border-2 border-red-600 rounded-full text-red-600 font-bold text-sm mb-4 animate-fadeIn">
            {sectionLabel}
          </span>
          <h2 className="text-5xl md:text-6xl font-black text-white mb-4 animate-slideUp">
            {sectionSubtitle.split(' ').map((word, i) => {
              // Make last two words red for visual style
              const words = sectionSubtitle.split(' ');
              return i >= words.length - 2 
                ? <span key={i} className="text-red-600">{word} </span>
                : <span key={i}>{word} </span>;
            })}
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed animate-slideUp animation-delay-200">
            {sectionDesc}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {[1,2,3,4,5,6].map((i) => (
            <div key={i} className="bg-gray-900 rounded-3xl p-8 shadow-2xl hover:shadow-red-600/40 hover:-translate-y-2 transition-all duration-300 border-2 border-transparent hover:border-red-600 relative">
              <div className="absolute -top-6 -right-6 w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300">
                <Image src="/assets/logo.jpg" alt="Logo" width={50} height={50} className='rounded-full' />
              </div>
              <div className="flex justify-center mb-4 mt-4">
                <Image src={`/assets/test${i}.png`} alt="Rating" width={300} height={24} />
              </div>
            </div>
          ))}
        </div>

        {/* Stats Banner */}
        <div ref={statsRef} className="bg-black/90 rounded-3xl p-12 text-white text-center relative overflow-hidden shadow-xl">
          <div className="grid md:grid-cols-3 gap-8 relative z-10">
            {stats.map((stat, index) => (
              <div key={index} className="group hover:scale-110 transition-transform duration-300">
                <div className="text-5xl mb-2">{stat.icon}</div>
                <div className="text-4xl font-black text-red-600 mb-2">
                  <span id={`counter-${index}`}>0</span>{stat.suffix}
                </div>
                <div className="text-lg font-semibold text-gray-300">
                  {statLabels[index]}
                </div>
                <div className="mt-3 h-2 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-600 rounded-full animate-fillBar"
                    style={{ width: index === 0 ? '98%' : index === 1 ? '100%' : '98%' }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;