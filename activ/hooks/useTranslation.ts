import { useState } from "react";
import ar from "@/messages/ar.json";
import en from "@/messages/en.json";

const translations = { ar, en };

export function useTranslation() {
  const [lang, setLang] = useState<"ar" | "en">("ar");

  const t = (path: string) => {
    const keys = path.split(".");
    let value: any = translations[lang];

    for (const key of keys) {
      value = value?.[key];
    }

    return value || path;
  };

  return { t, lang, setLang };
}