'use client';
import Link from 'next/link';
import { useEffect } from 'react';

export default function PaymentCancel() {
  useEffect(() => {
    // Remove pending booking ID since payment was cancelled
    localStorage.removeItem('pendingBookingId');
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6" dir="rtl">
      <div className="w-full max-w-md text-center">
        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-red-900 to-red-600 flex items-center justify-center text-5xl mx-auto mb-8 shadow-[0_0_60px_rgba(220,38,38,0.4)]">
          ✕
        </div>

        <h1 className="text-3xl font-black text-white mb-3">تم إلغاء الدفع</h1>

        <p className="text-white/50 mb-8 leading-relaxed">
          لم تكتمل عملية الدفع. لم يتم خصم أي مبلغ من حسابك.
          يمكنك المحاولة مرة أخرى في أي وقت.
        </p>

        <div className="flex flex-col gap-3">
          <Link href="/ar/payment">
            <button className="w-full py-3 bg-gradient-to-r from-red-700 to-red-500 text-white font-bold rounded-2xl hover:opacity-90 transition shadow-[0_0_20px_rgba(255,0,0,0.3)]">
              🔄 حاول مرة أخرى
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
