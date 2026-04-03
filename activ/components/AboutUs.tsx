"use client";

import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";

const AboutUs = () => {
  const { t, lang } = useTranslation();

  const texts = {
    sectionLabel: String(t('aboutUs.sectionLabel')),
    title: String(t('aboutUs.title')),
    subtitle: String(t('aboutUs.subtitle')),
    journeyTitle: String(t('aboutUs.journeyTitle')),
  };

  const journeyParagraphs = t('aboutUs.journeyParagraphs') || [];
  const features = t('aboutUs.features') || [];

  return (
    <section
      className="py-20 bg-black text-white overflow-hidden mt-13"
      id="about"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-6 py-2 bg-red-900/30 border border-red-700 rounded-full text-red-500 font-bold text-sm mb-4 tracking-wider uppercase">
            {texts.sectionLabel}
          </span>

          <h2 className="text-5xl md:text-6xl font-black mb-4">
            {texts.title}
          </h2>

          <p className="text-lg text-white/70 max-w-3xl mx-auto leading-relaxed">
            {texts.subtitle}
          </p>
        </div>

        {/* About Content Grid */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          {/* Images Collage */}
          <div className="relative h-[600px]">
            <div className="absolute top-20 right-12 bg-black border border-red-800 p-4 pb-16 shadow-[0_20px_60px_rgba(0,0,0,0.6)] rotate-[-8deg] hover:rotate-0 hover:scale-105 transition-all duration-300 z-20">
              <div className="w-64 h-72 flex items-center justify-center">
                <Image
                  src="/assets/congs.jpg"
                  alt="congrats"
                  width={1000}
                  height={1000}
                  className="object-cover rounded"
                />
              </div>
            </div>

            <div className="absolute bottom-1 right-32 bg-black border border-red-800 p-4 pt-6 pb-16 shadow-[0_20px_60px_rgba(0,0,0,0.6)] rotate-[12deg] hover:rotate-0 hover:scale-105 transition-all duration-300 z-30">
              <div className="w-56 h-64 flex items-center justify-center">
                <Image
                  src="/assets/cong2.jpg"
                  alt="congrats"
                  width={250}
                  height={200}
                  className="object-cover rounded"
                />
              </div>
            </div>

            <div className="absolute top-36 left-8 bg-black border border-red-800 p-4 pb-16 shadow-[0_20px_60px_rgba(0,0,0,0.6)] rotate-[-12deg] hover:rotate-0 hover:scale-105 transition-all duration-300 z-10">
              <div className="w-52 h-60 flex items-center justify-center">
                <Image
                  src="/assets/cong.jpg"
                  alt="congrats"
                  width={1000}
                  height={1000}
                  className="object-cover rounded"
                />
              </div>
            </div>

            {/* Decorative Stars */}
            <div className="absolute top-0 left-0 text-5xl text-red-600 animate-bounce">⭐</div>
            <div className="absolute bottom-0 right-0 text-5xl text-red-600 animate-bounce">⭐</div>
            <div className="absolute bottom-20 left-0 text-4xl text-red-500 animate-bounce">⭐</div>
          </div>

          {/* About Text */}
          <div className={lang === "ar" ? "text-right" : "text-left"}>
            <h3 className="text-4xl font-extrabold mb-6">
              {texts.journeyTitle}
            </h3>

            {Array.isArray(journeyParagraphs) && journeyParagraphs.map((p, idx) => (
              <p key={idx} className="text-white/80 leading-relaxed mb-4">
                {p}
              </p>
            ))}

            <ul className="space-y-4">
              {Array.isArray(features) && features.map((f, idx) => (
                <li key={idx} className="flex items-center gap-4 text-lg font-semibold">
                  <span className="text-2xl text-red-600">{f.icon}</span>
                  <span>{f.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;