'use client';

import { usePathname } from "next/navigation";
import ar from "@/messages/ar.json";
import en from "@/messages/en.json";

const translations: Record<string, any> = { ar, en };

export function useTranslation() {
  const pathname = usePathname();
  const lang = pathname?.startsWith("/ar") ? "ar" : "en";

  const t = (path: string) => {
    const keys = path.split(".");
    let value: any = translations[lang];

    for (const key of keys) {
      value = value?.[key];
    }

    return value || path;
  };

  return { t, lang, setLang: () => {} };
}