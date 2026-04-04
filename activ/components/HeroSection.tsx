'use client';

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";

/* ── tiny hook: triggers once when element enters viewport ── */
function useInView(threshold = 0.1): [React.RefObject<HTMLDivElement | null>, boolean] {
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

const HeroSection = () => {
  const { t, lang } = useTranslation();

  /* hero content fades in on load */
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      id="home"
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="relative min-h-[90vh] overflow-hidden flex items-center"
    >
      {/* Video Background */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-[-1]"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      >
        <source src="/assets/0202.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-8 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Hero Content */}
        <div
          className="space-y-8"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(50px)",
            transition: "opacity 1s ease 0.2s, transform 1s ease 0.2s",
          }}
        >
          <h1 className="text-5xl lg:text-7xl font-black leading-tight bg-gradient-to-r from-white via-red-500 to-red-800 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(0,0,0,0.8)]">
            {t("hero.title")}
          </h1>

          <div
            className="flex flex-wrap gap-4"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(30px)",
              transition: "opacity 1s ease 0.5s, transform 1s ease 0.5s",
            }}
          >
            {/* Get Started */}
            <Link href={`/${lang}/payment`}>
              <button className="px-8 py-4 bg-red-600 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-red-600/50 hover:scale-105 transition-all duration-300 flex items-center gap-2">
                {t("hero.getStarted")}
                <svg
                  className={`transition-transform duration-300 ${lang === 'ar' ? 'rotate-180' : ''}`}
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </Link>

            {/* Our Programs */}
            <Link href={`/${lang}/sports`}>
              <button className="px-8 py-4 bg-transparent text-white border-2 border-white rounded-full font-bold text-lg hover:bg-white hover:text-black transition-all duration-300">
                {t("hero.ourPrograms")}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;