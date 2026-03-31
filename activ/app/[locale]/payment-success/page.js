'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function SuccessInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const method = searchParams.get('method');
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    // If coming from Paymob redirect, mark pending booking as paid
    const pendingId = localStorage.getItem('pendingBookingId');
    if (pendingId) {
      const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      const updated = bookings.map(b =>
        b._id === pendingId ? { ...b, status: 'paid' } : b
      );
      localStorage.setItem('bookings', JSON.stringify(updated));
      localStorage.removeItem('pendingBookingId');
      setBooking(updated.find(b => b._id === pendingId));
      window.dispatchEvent(new Event('storage_updated'));
    }
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6" dir="rtl">
      <div className="w-full max-w-md text-center">
        {/* Success animation */}
        <div className="relative inline-block mb-8">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-green-700 to-green-400 flex items-center justify-center text-5xl mx-auto shadow-[0_0_60px_rgba(34,197,94,0.5)] animate-bounce">
            ✓
          </div>
          <div className="absolute inset-0 rounded-full animate-ping bg-green-500/20" />
        </div>

        <h1 className="text-3xl font-black text-white mb-3">
          {method === 'receipt' ? 'تم رفع الإيصال! 📄' : 'تم الدفع بنجاح! 🎉'}
        </h1>

        <p className="text-white/50 mb-6 leading-relaxed">
          {method === 'receipt'
            ? 'تم استلام إيصالك وسيتم مراجعته خلال 24 ساعة. سنتواصل معك للتأكيد.'
            : 'تمت عملية الدفع بنجاح عبر Paymob. تم تأكيد حجزك في الأكاديمية.'}
        </p>

        {booking && (
          <div className="bg-green-900/10 border border-green-800/30 rounded-2xl p-5 mb-6 text-right space-y-2 text-sm">
            <div className="text-green-400 font-bold text-base mb-3">تفاصيل الحجز</div>
            <div className="flex justify-between"><span className="text-white/40">النشاط</span><span className="text-white font-bold">{booking.activityName}</span></div>
            <div className="flex justify-between"><span className="text-white/40">المدرب</span><span className="text-white">{booking.coach || '—'}</span></div>
            <div className="flex justify-between"><span className="text-white/40">الاسم</span><span className="text-white">{booking.userFullName}</span></div>
            {booking.date && <div className="flex justify-between"><span className="text-white/40">التاريخ</span><span className="text-white">{booking.date}</span></div>}
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Link href="/ar/sports">
            <button className="w-full py-3 bg-gradient-to-r from-red-700 to-red-500 text-white font-bold rounded-2xl hover:opacity-90 transition shadow-[0_0_20px_rgba(255,0,0,0.3)]">
              استكشاف المزيد من الأنشطة
            </button>
          </Link>
          <Link href="/ar">
            <button className="w-full py-3 bg-white/5 border border-white/10 text-white/70 font-semibold rounded-2xl hover:bg-white/10 transition">
              العودة للرئيسية
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white/60 animate-pulse">جاري التحميل...</div>
      </div>
    }>
      <SuccessInner />
    </Suspense>
  );
}
