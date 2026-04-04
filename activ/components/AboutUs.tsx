"use client";

import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";
import React, { useEffect, useRef, useState } from "react";


/* ── tiny hook: triggers once when element enters viewport ── */
function useInView(threshold = 0.15): [React.RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);

  return [ref, visible];
}

/* ── SVG icon map (no emojis) ── */
const IconMap: Record<string, React.ReactElement> = {
  star: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
  rocket: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  ),
  lightbulb: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </svg>
  ),
};

/* ── decorative star SVG (replaces ⭐ emoji) ── */
function DecorativeStar({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

const AboutUs = () => {
  const { t, lang } = useTranslation();

  const texts = {
    sectionLabel: String(t("aboutUs.sectionLabel")),
    title: String(t("aboutUs.title")),
    subtitle: String(t("aboutUs.subtitle")),
    journeyTitle: String(t("aboutUs.journeyTitle")),
  };

  const journeyParagraphs = t("aboutUs.journeyParagraphs") || [];
  const features = t("aboutUs.features") || [];

  /* scroll refs */
  const [headerRef, headerVisible] = useInView(0.1);
  const [imagesRef, imagesVisible] = useInView(0.15);
  const [textRef, textVisible] = useInView(0.1);

  return (
    <section
      className="py-20 bg-black text-white overflow-hidden mt-13"
      id="about"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto px-6">

        {/* ── Section Header ── */}
        <div
          ref={headerRef}
          className="text-center mb-16"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? "translateY(0)" : "translateY(40px)",
            transition: "opacity 0.8s ease, transform 0.8s ease",
          }}
        >
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

        {/* ── Content Grid ── */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">

          {/* Images Collage */}
          <div
            ref={imagesRef}
            className="relative h-[600px]"
            style={{
              opacity: imagesVisible ? 1 : 0,
              transform: imagesVisible ? "translateX(0)" : "translateX(-60px)",
              transition: "opacity 0.9s ease, transform 0.9s ease",
            }}
          >
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

            {/* Decorative Stars — SVG instead of emojis */}
            <DecorativeStar className="absolute top-0 left-0 w-10 h-10 text-red-600 animate-bounce" />
            <DecorativeStar className="absolute bottom-0 right-0 w-10 h-10 text-red-600 animate-bounce" />
            <DecorativeStar className="absolute bottom-20 left-0 w-8 h-8 text-red-500 animate-bounce" />
          </div>

          {/* About Text */}
          <div
            ref={textRef}
            className={lang === "ar" ? "text-right" : "text-left"}
            style={{
              opacity: textVisible ? 1 : 0,
              transform: textVisible ? "translateX(0)" : "translateX(60px)",
              transition: "opacity 0.9s ease 0.2s, transform 0.9s ease 0.2s",
            }}
          >
            <h3 className="text-4xl font-extrabold mb-6">
              {texts.journeyTitle}
            </h3>

            {Array.isArray(journeyParagraphs) &&
              journeyParagraphs.map((p, idx) => (
                <p key={idx} className="text-white/80 leading-relaxed mb-4">
                  {p}
                </p>
              ))}

            <ul className="space-y-4 mt-6">
              {Array.isArray(features) &&
                features.map((f, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-4 text-lg font-semibold"
                    style={{
                      opacity: textVisible ? 1 : 0,
                      transform: textVisible ? "translateX(0)" : "translateX(30px)",
                      transition: `opacity 0.6s ease ${0.3 + idx * 0.15}s, transform 0.6s ease ${0.3 + idx * 0.15}s`,
                    }}
                  >
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-red-600/20 border border-red-600 text-red-500 shrink-0">
                      {IconMap[f.icon] ?? (
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                          <circle cx="12" cy="12" r="10" />
                        </svg>
                      )}
                    </span>
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