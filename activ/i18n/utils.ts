import arMessages from '../messages/ar.json';
import enMessages from '../messages/en.json';

type Locale = 'ar' | 'en';

const messages: Record<Locale, any> = {
  ar: arMessages,
  en: enMessages,
};

export function getMessages(locale: Locale) {
  return messages[locale] || messages.en;
}

// دالة الترجمة الرئيسية
export function t(locale: Locale, key: string): string {
  const keys = key.split('.');
  let value = getMessages(locale);
  
  for (const k of keys) {
    value = value?.[k];
    if (!value) break;
  }
  
  return value || key;
}

// دالة للحصول على اتجاه الصفحة
export function getDir(locale: Locale): 'rtl' | 'ltr' {
  return locale === 'ar' ? 'rtl' : 'ltr';
}