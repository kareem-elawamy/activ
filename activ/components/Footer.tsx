'use client';
import { useRef, useState } from "react";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";

interface Star {
  x: number;
  y: number;
}

interface FooterColumnProps {
  title: string;
  links: string[];
  lang?: "en" | "ar";
}

export default function UltraFooter() {
  const { t, lang } = useTranslation();
  const footerRef = useRef<HTMLElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [stars, setStars] = useState<Star[]>([]);

  const footerHeading = String(t('footer.footerHeading'));
  const footerDescription = String(t('footer.footerDescription'));
  const enrollButton = String(t('footer.enrollButton'));
  const bottomLeft = String(t('footer.bottomLeft'));
  const bottomRight = String(t('footer.bottomRight'));

  const pagesCol = t('footer.columns.pages') || [];
  const programsCol = t('footer.columns.programs') || [];
  const socialCol = t('footer.columns.social') || [];

  const columnsData = [
    { title: String(t('footer.columns.pagesTitle')), links: Array.isArray(pagesCol) ? pagesCol : [] },
    { title: String(t('footer.columns.programsTitle')), links: Array.isArray(programsCol) ? programsCol : [] },
    { title: String(t('footer.columns.socialTitle')), links: Array.isArray(socialCol) ? socialCol : [] }
  ];

  return (
    <footer ref={footerRef} dir={lang === "ar" ? "rtl" : "ltr"} className="relative overflow-hidden bg-black text-white pt-24 pb-10">
      {/* Neon Backgrounds و Stars كما قبل */}

      <div className="max-w-7xl mx-auto px-6 mb-24 relative z-10 text-center">
        <h2 className="text-4xl font-bold animate-bounce text-white drop-shadow-[0_0_20px_red]">
          {footerHeading}
        </h2>
      </div>

      <div className="bg-black/95 text-white rounded-t-[50px] z-10 relative shadow-[0_0_50px_rgba(255,0,0,0.6)] border-t border-red-800">
        <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 relative z-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform duration-300">
              <img src="/assets/logo.png" alt="Logo" className="w-36 h-20 drop-shadow-[0_0_30px_red]" />
            </div>
            <p className="text-white/80 max-w-sm mb-6">{footerDescription}</p>
            <Link href={`/${lang}/sports`}>
              <button className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-full font-semibold shadow-[0_0_25px_rgba(255,0,0,0.8)] hover:shadow-[0_0_40px_rgba(255,0,255,1)] transition-all duration-300">
                {enrollButton}
              </button>
            </Link>
          </div>

          {columnsData.map(col => (
            <FooterColumn key={col.title} {...col} lang={lang as "en" | "ar"} />
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-red-800">
          <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/70">
            <p>{bottomLeft}</p>
            <p>{bottomRight}</p>
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
            <Link href={`/${lang}/${link.toLowerCase().replace(/\s+/g, "-")}`}>{link}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}