'use client';

import { usePathname, useRouter } from 'next/navigation';

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  const currentLocale = pathname?.startsWith('/en') ? 'en' : 'ar';

  const toggleLanguage = (newLocale: string) => {
    if (!pathname) return;
    
    // Replace the locale at the start of the path
    let newPath = pathname;
    if (pathname.startsWith('/en') || pathname.startsWith('/ar')) {
      newPath = pathname.replace(/^\/[a-z]{2}/, `/${newLocale}`);
    } else {
      newPath = `/${newLocale}${pathname}`;
    }
    
    router.push(newPath);
  };

  return (
    <div className="flex gap-2 z-50">
      <button
        onClick={() => toggleLanguage('ar')}
        className={`px-4 py-1.5 text-sm font-bold rounded-lg transition-all ${
          currentLocale === 'ar' 
            ? 'bg-red-600 text-white shadow-lg scale-105' 
            : 'bg-white/10 text-white/70 hover:bg-white/20'
        }`}
      >
        العربية
      </button>
      <button
        onClick={() => toggleLanguage('en')}
        className={`px-4 py-1.5 text-sm font-bold rounded-lg transition-all ${
          currentLocale === 'en' 
            ? 'bg-red-600 text-white shadow-lg scale-105' 
            : 'bg-white/10 text-white/70 hover:bg-white/20'
        }`}
      >
        English
      </button>
    </div>
  );
}