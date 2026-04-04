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
  links: { label: string; href: string; external?: boolean }[];
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

  const pagesLinks = Array.isArray(pagesCol) ? pagesCol.map((label: string, i: number) => {
    const paths = [
      `/${lang}`, 
      `/${lang}/heroes`, 
      `/${lang}/coaches`, 
      `/${lang}/sports`, 
      `/${lang}/ai-analyzer`, 
      `/${lang}/about-us`, 
      `/${lang}/contact-us`
    ];
    return { label, href: paths[i] || `/${lang}` };
  }) : [];

  const programsLinks = Array.isArray(programsCol) ? programsCol.map((label: string) => {
    return { label, href: `/${lang}/sports` || `/${lang}/heroes` };
  }) : [];

  const socialLinks = Array.isArray(socialCol) ? socialCol.map((label: string, i: number) => {
    const url = i === 0 ? "https://www.facebook.com/share/1CMa57wnQh/?mibextid=wwXIfr" : "https://wa.me/201207128432";
    return { label, href: url, external: true };
  }) : [];

  const columnsData = [
    { title: String(t('footer.columns.pagesTitle')), links: pagesLinks },
    { title: String(t('footer.columns.programsTitle')), links: programsLinks },
    { title: String(t('footer.columns.socialTitle')), links: socialLinks }
  ];

  return (
    <footer ref={footerRef} dir={lang === "ar" ? "rtl" : "ltr"} className="relative overflow-hidden bg-black text-white pt-24 pb-10">
      {/* Neon Backgrounds و Stars كما قبل */}

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

interface FooterLinkItem {
  label: string;
  href: string;
  external?: boolean;
}

function FooterColumn({ title, links, lang }: { title: string, links: FooterLinkItem[], lang?: "en" | "ar" }) {
  return (
    <div>
      <h4 className="font-semibold mb-4 text-red-500 drop-shadow-[0_0_10px_red]">{title}</h4>
      <ul className="space-y-3 text-white/80">
        {links.map((link, idx) => (
          <li key={idx} className="hover:text-pink-500 transition">
            {link.external ? (
              <a href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a>
            ) : (
              <Link href={link.href}>{link.label}</Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}