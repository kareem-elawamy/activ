export type Locale = 'ar' | 'en';

export interface Messages {
  common: Record<string, string>;
  home: Record<string, string>;
  about: Record<string, string>;
  dashboard: Record<string, string>;
  errors: Record<string, string>;
}

export const locales: Locale[] = ['ar', 'en'];
export const defaultLocale: Locale = 'ar';

export const localeNames: Record<Locale, string> = {
  ar: 'العربية',
  en: 'English'
};

export const localeDirections: Record<Locale, 'rtl' | 'ltr'> = {
  ar: 'rtl',
  en: 'ltr'
};