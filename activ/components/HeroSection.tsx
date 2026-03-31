'use client';

import { useState } from "react";
import Link from "next/link";
import en from "../messages/en.json";
import ar from "../messages/ar.json";

interface HeroSectionProps {
  lang?: "en" | "ar";
}

const HeroSection = ({ lang = "en" }: HeroSectionProps) => {
  const texts = lang === "ar" ? ar : en;

  return (
    <section
      id="home"
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="relative min-h-screen overflow-hidden flex items-center"
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
      <div className="absolute inset-0 bg-black/50 z-0 animate-pulse-slow"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-8 py-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Hero Content */}
        <div className="animate-slide-in-right">
          <h1 className="text-5xl lg:text-7xl font-black leading-tight mb-6 bg-gradient-to-r from-white via-red-600 to-black bg-clip-text text-transparent animate-fade-in-up font-cairo drop-shadow-[0_0_20px_black]">
            {texts.heroTitle}
          </h1>

          <div className="flex flex-wrap gap-4 mb-16 animate-fade-in-up">
            {/* Get Started */}
            <Link href="/payment">
              <button className="relative px-8 py-4 bg-red-600 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-[0_0_25px_red] hover:scale-105 hover:-translate-y-1 transition-all duration-500 cursor-pointer flex items-center gap-2 font-cairo overflow-hidden">
                {texts.getStarted}
                <svg
                  className="ml-2 transition-transform duration-500 group-hover:translate-x-2"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-500"></span>
              </button>
            </Link>

            {/* Our Programs */}
            <Link href="/sports">
              <button className="px-8 py-4 bg-transparent text-white border-2 border-white rounded-full font-bold text-lg backdrop-blur-sm hover:bg-red-600 hover:text-white hover:border-red-600 hover:-translate-y-1 transition-all duration-500 cursor-pointer font-cairo">
                {texts.ourPrograms}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;