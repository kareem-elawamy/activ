'use client';
import Link from 'next/link';

// The main payment flow is now integrated into the BookNowButton popup on each activity card.
// This standalone /payment page serves as an info/instructions page.

export default function PaymentInfoPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 pt-28" dir="rtl">
      <div className="max-w-lg w-full space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-black text-white mb-2">💳 طرق الدفع</h1>
          <p className="text-white/40">جميع المدفوعات يدوية ويتم التحقق منها من قبل الأكاديمية</p>
        </div>

        <div className="space-y-3">
          {[
            { icon: '🧾', title: 'إيصال من الأكاديمية', body: 'ادفع رسوم الاشتراك في مقر الأكاديمية أو أي فرع مباشرةً، ثم ارفع صورة الإيصال عند الحجز.' },
            { icon: '📲', title: 'تحويل InstaPay', body: 'حوّل المبلغ عبر InstaPay على الحساب: active.academy@instapay ثم ارفع صورة التحويل.' },
            { icon: '📱', title: 'محفظة إلكترونية', body: 'يمكنك الدفع عبر Vodafone Cash أو Orange Money أو Etisalat Cash أو WE Pay ثم ارفع صورة التأكيد.' },
          ].map(m => (
            <div key={m.title} className="bg-[#0d0d0d] border border-white/8 rounded-2xl p-5 flex gap-4">
              <span className="text-3xl flex-shrink-0">{m.icon}</span>
              <div>
                <div className="font-black text-white mb-1">{m.title}</div>
                <div className="text-white/40 text-sm leading-relaxed">{m.body}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-yellow-950/20 border border-yellow-800/30 rounded-2xl p-4 text-center">
          <p className="text-yellow-400 font-bold text-sm">⚠️ السعر يُحدَّد من قِبل الأكاديمية</p>
          <p className="text-white/40 text-xs mt-1">يمكنك الحجز أولاً وسيتم إبلاغك بالسعر النهائي عند التأكيد</p>
        </div>

        <div className="flex gap-3">
          <Link href="/ar/sports" className="flex-1">
            <button className="w-full py-3 bg-gradient-to-r from-red-700 to-red-500 text-white font-black rounded-2xl hover:opacity-90 transition shadow-[0_0_20px_rgba(220,38,38,0.3)]">
              ⚽ احجز الآن
            </button>
          </Link>
          <Link href="/ar/my-bookings" className="flex-1">
            <button className="w-full py-3 bg-white/5 border border-white/10 text-white/70 font-bold rounded-2xl hover:bg-white/8 transition">
              📋 حجوزاتي
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
