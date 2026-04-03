'use client';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';

// The main payment flow is now integrated into the BookNowButton popup on each activity card.
// This standalone /payment page serves as an info/instructions page.

export default function PaymentInfoPage() {
  const { lang } = useTranslation();
  
  const content = [
    { 
      icon: '🧾', 
      title: lang === 'ar' ? 'إيصال من الأكاديمية' : 'Academy Receipt', 
      body: lang === 'ar' 
        ? 'ادفع رسوم الاشتراك في مقر الأكاديمية أو أي فرع مباشرةً، ثم ارفع صورة الإيصال عند الحجز.' 
        : 'Pay the subscription fees directly at the Academy headquarters or any branch, then upload a photo of the receipt when booking.' 
    },
    { 
      icon: '📲', 
      title: 'تحويل InstaPay', 
      body: lang === 'ar' 
        ? 'حوّل المبلغ عبر InstaPay على الحساب: active.academy@instapay ثم ارفع صورة التحويل.' 
        : 'Transfer the amount via InstaPay to the account: active.academy@instapay, then upload a screenshot of the transfer.' 
    },
    { 
      icon: '📱', 
      title: lang === 'ar' ? 'محفظة إلكترونية' : 'E-Wallet', 
      body: lang === 'ar' 
        ? 'يمكنك الدفع عبر Vodafone Cash أو Orange Money أو Etisalat Cash أو WE Pay ثم ارفع صورة التأكيد.' 
        : 'You can pay via Vodafone Cash, Orange Money, Etisalat Cash, or WE Pay, then upload the confirmation screenshot.' 
    },
  ];

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 pt-28" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-lg w-full space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-black text-white mb-2">💳 {lang === 'ar' ? 'طرق الدفع' : 'Payment Methods'}</h1>
          <p className="text-white/40">{lang === 'ar' ? 'جميع المدفوعات يدوية ويتم التحقق منها من قبل الأكاديمية' : 'All payments are manual and verified by the Academy'}</p>
        </div>

        <div className="space-y-3">
          {content.map(m => (
            <div key={m.title} className="bg-[#0d0d0d] border border-white/10 rounded-2xl p-5 flex gap-4">
              <span className="text-3xl flex-shrink-0">{m.icon}</span>
              <div>
                <div className="font-black text-white mb-1">{m.title}</div>
                <div className="text-white/40 text-sm leading-relaxed">{m.body}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-yellow-950/20 border border-yellow-800/30 rounded-2xl p-4 text-center">
          <p className="text-yellow-400 font-bold text-sm">⚠️ {lang === 'ar' ? 'السعر يُحدَّد من قِبل الأكاديمية' : 'Price is determined by the Academy'}</p>
          <p className="text-white/40 text-xs mt-1">{lang === 'ar' ? 'يمكنك الحجز أولاً وسيتم إبلاغك بالسعر النهائي عند التأكيد' : 'You can book first and will be informed of the final price upon confirmation'}</p>
        </div>

        <div className="flex gap-3">
          <Link href={`/${lang}/sports`} className="flex-1">
            <button className="w-full py-3 bg-gradient-to-r from-red-700 to-red-500 text-white font-black rounded-2xl hover:opacity-90 transition shadow-[0_0_20px_rgba(220,38,38,0.3)]">
              ⚽ {lang === 'ar' ? 'احجز الآن' : 'Book Now'}
            </button>
          </Link>
          <Link href={`/${lang}/my-bookings`} className="flex-1">
            <button className="w-full py-3 bg-white/5 border border-white/10 text-white/70 font-bold rounded-2xl hover:bg-white/10 transition">
              📋 {lang === 'ar' ? 'حجوزاتي' : 'My Bookings'}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
