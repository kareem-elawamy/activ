'use client';
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import en from "../messages/en.json";
import ar from "../messages/ar.json";

interface Star {
  x: number;
  y: number;
  // أي props حقيقية تحتاجينها
}
interface FooterColumnProps {
  title: string;
  links: Array<{
    label: string;
    href: string;
  }>;
}

interface UltraFooterProps {
  lang?: "en" | "ar";
  
}

export default function UltraFooter({ lang = "en" }: UltraFooterProps) {
  const footerRef = useRef<HTMLElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [stars, setStars] = useState<Star[]>([]);

  const texts = lang === "ar" ? ar : en;

  // … جميع التأثيرات (stars، mouse move) كما في النسخة السابقة

  const columnsData = [
    { title: lang === "ar" ? "الصفحات" : "Pages", links: texts.columns.pages },
    { title: lang === "ar" ? "البرامج" : "Programs", links: texts.columns.programs },
    { title: lang === "ar" ? "وسائل التواصل" : "Social Media", links: texts.columns.social }
  ];

  return (
    <footer ref={footerRef} dir={lang === "ar" ? "rtl" : "ltr"} className="relative overflow-hidden bg-black text-white pt-24 pb-10">
      {/* Neon Backgrounds و Stars كما قبل */}

      <div className="max-w-7xl mx-auto px-6 mb-24 relative z-10 text-center">
        <h2 className="text-4xl font-bold animate-bounce text-white drop-shadow-[0_0_20px_red]">
          {texts.footerHeading}
        </h2>
      </div>

      <div className="bg-black/95 text-white rounded-t-[50px] z-10 relative shadow-[0_0_50px_rgba(255,0,0,0.6)] border-t border-red-800">
        <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 relative z-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform duration-300">
              <img src="/assets/logo.png" alt="Logo" className="w-36 h-20 drop-shadow-[0_0_30px_red]" />
            </div>
            <p className="text-white/80 max-w-sm mb-6">{texts.footerDescription}</p>
            <Link href="/sports">
              <button className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-full font-semibold shadow-[0_0_25px_rgba(255,0,0,0.8)] hover:shadow-[0_0_40px_rgba(255,0,255,1)] transition-all duration-300">
                {texts.enrollButton}
              </button>
            </Link>
          </div>

          {columnsData.map(col => (
            <FooterColumn key={col.title} {...col} lang={lang} />
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-red-800">
          <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/70">
            <p>{texts.bottomLeft}</p>
            <p>{texts.bottomRight}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links, lang }: FooterColumnProps) {
  return (
    <div>
      <h4 className="font-semibold mb-4 text-red-500 drop-shadow-[0_0_10px_red]">{title}</h4>
      <ul className="space-y-3 text-white/80">
        {links.map(link => (
          <li key={link} className="hover:text-pink-500 transition">
            <Link href={`/${link.toLowerCase().replace(/\s+/g, "-")}`}>{link}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}