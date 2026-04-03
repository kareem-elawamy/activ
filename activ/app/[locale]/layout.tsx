import { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Toaster } from 'react-hot-toast';
import { redirect } from 'next/navigation';
import { routing } from '@/i18n/routing';
import ClientWrapper from '@/components/ClientWrapper';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import '../globals.css';
const inter = Inter({ subsets: ['latin'] });

interface LocaleLayoutProps {
  children: ReactNode;
  params: { locale: string };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = params;

  if (!routing.locales.includes(locale as 'ar' | 'en')) {
    redirect('/ar');
  }

  const messages = await getMessages({ locale });
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir}>
      <body className={`${inter.className} antialiased bg-black text-white`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ClientWrapper>
            <Toaster position="top-center" reverseOrder={false} />
            <Navbar />
            <main className="pt-28 min-h-screen">
              {children}
            </main>
            <Footer />
          </ClientWrapper>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}