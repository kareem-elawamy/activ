'use client';

import Link from 'next/link';
import EmptyState from '@/components/EmptyState';
import { useEffect, useState } from 'react';

export default function NotFound() {
  const [lang, setLang] = useState('en');

  // Attempt to grasp the locale from URL for navigation routing
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pathLang = window.location.pathname.split('/')[1];
      if (['ar', 'en'].includes(pathLang)) {
        setLang(pathLang);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-white font-sans relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600 rounded-full mix-blend-screen filter blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-900 rounded-full mix-blend-screen filter blur-[150px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center">
        <div className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-white/10 mb-8 drop-shadow-2xl opacity-10">
          404
        </div>
        
        <div className="w-full relative -mt-20">
          <EmptyState 
            icon="🧭"
            title={lang === 'ar' ? 'الصفحة غير موجودة' : 'Page Not Found'}
            message={lang === 'ar' 
              ? 'عذراً، لم نتمكن من العثور على الصفحة التي تبحث عنها. قد يكون الرابط معطلاً أو تم إزالة الصفحة.' 
              : 'Sorry, we couldn’t find the page you’re looking for. The link might be broken or the page may have been removed.'}
            actionLabel={lang === 'ar' ? 'العودة للرئيسية' : 'Return to Home'}
            onAction={() => window.location.href = `/${lang}`}
          />
        </div>
      </div>
    </div>
  );
}
