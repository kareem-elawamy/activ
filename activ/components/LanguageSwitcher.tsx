'use client';

import { useState } from 'react';

export default function LanguageSwitcher() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');

  return (
    <div className="flex gap-2">
      <button
        onClick={() => setLang('ar')}
        className="px-3 py-1 bg-blue-500 text-white rounded"
      >
        العربية
      </button>
      <button
        onClick={() => setLang('en')}
        className="px-3 py-1 bg-gray-500 text-white rounded"
      >
        English
      </button>
    </div>
  );
}