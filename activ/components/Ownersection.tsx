'use client';

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";

/* ─── tiny hook: triggers when element enters viewport ─── */
function useInView(threshold: number = 0.15): [React.RefObject<HTMLDivElement | null>, boolean] {
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

/* ─── stat counter ─── */
function Counter({ to, suffix = "", duration = 2000 }: { to: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const [ref, visible] = useInView();

  useEffect(() => {
    if (!visible) return;

    let start = 0;
    const step = Math.ceil(to / (duration / 16));

    const id = setInterval(() => {
      start += step;
      if (start >= to) {
        setCount(to);
        clearInterval(id);
      } else {
        setCount(start);
      }
    }, 16);

    return () => clearInterval(id);
  }, [visible, to, duration]);

  return <span ref={ref as React.RefObject<HTMLSpanElement>}>{count.toLocaleString()}{suffix}</span>;
}

/* ─── video modal ─── */
function VideoModal({ src, poster, onClose }: { src: string; poster: string; onClose: () => void }) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/92 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl rounded-2xl overflow-hidden border border-red-900/30 shadow-[0_0_80px_rgba(255,0,0,0.25)]"
        onClick={(e) => e.stopPropagation()}
      >
        <video
          className="w-full aspect-video bg-black"
          controls
          autoPlay
          poster={poster}
          src={src}
        />
        <button
          onClick={onClose}
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-black/70 border border-white/15 text-white/60 hover:text-white flex items-center justify-center transition-colors duration-200"
          aria-label="Close video"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-4 h-4">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   OWNER SECTION
════════════════════════════════════════════════════════ */
export default function OwnerSection() {
  const { t, lang } = useTranslation();

  const preTitle = String(t('owner.sectionHeader.preTitle'));
  const title = String(t('owner.sectionHeader.title'));
  const mainTitle = String(t('owner.mainTitle'));
  const paragraphs = t('owner.paragraphs') || [];
  const stats = t('owner.stats') || [];
  const quote = String(t('owner.quote'));
  const quoteAuthor = String(t('owner.quoteAuthor'));

  const [headerRef, headerVisible] = useInView(0.1);
  const [photoRef, photoVisible] = useInView(0.15);
  const [textRef, textVisible] = useInView(0.1);
  const [statsRef, statsVisible] = useInView(0.2);
  const [quoteRef, quoteVisible] = useInView(0.2);

  return (
    <section className="relative bg-black overflow-hidden py-28 font-cairo" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* Header */}
        <div
          ref={headerRef}
          className="text-center mb-20"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? "translateY(0)" : "translateY(30px)",
            transition: "0.8s",
          }}
        >
          <p className="text-red-500 text-sm font-black uppercase mb-4">
            {preTitle}
          </p>

          <h2 className="text-5xl md:text-6xl font-black text-white whitespace-pre-line">
            {title}
          </h2>
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">

          {/* Image */}
          <div ref={photoRef}>
            <Image
              src="/assets/owner.jpg"
              alt="Owner"
              width={600}
              height={700}
              className="rounded-3xl"
            />
          </div>

          {/* Text */}
          <div ref={textRef}>
            <h3 className="text-3xl font-bold text-white mb-6 whitespace-pre-line">
              {mainTitle}
            </h3>

            {Array.isArray(paragraphs) && paragraphs.map((p, i) => (
              <p key={i} className="text-white/70 mb-4">
                {p}
              </p>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Array.isArray(stats) && stats.map((st, i) => (
            <div key={i} className="text-center text-white">
              <h4 className="text-3xl text-red-500">
                <Counter
                  to={parseInt(st.value)}
                  suffix={st.value.replace(/\d+/, "")}
                />
              </h4>
              <p>{st.label}</p>
            </div>
          ))}
        </div>

        {/* Quote */}
        <div ref={quoteRef} className="mt-20 text-center">
          <blockquote className="text-2xl text-white italic">
            {quote}
          </blockquote>
          <p className="text-gray-400 mt-4">
            {quoteAuthor}
          </p>
        </div>
      </div>

    </section>
  );
}