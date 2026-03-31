'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';

function PaymobIframeInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const iframeUrl = searchParams.get('iframeUrl');

  // قبل أي شي، تأكد من وجود iframeUrl
  if (!iframeUrl || !iframeUrl.startsWith('http')) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-red-400">رابط الدفع غير صالح أو مفقود</p>
          <button
            onClick={() => router.push('/ar/payment')}
            className="mt-4 px-6 py-2 bg-red-600 rounded-xl"
          >
            الرجوع للدفع
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => router.push('/ar/payment')}
            className="text-white/50 hover:text-white text-sm transition flex items-center gap-2"
          >
            ← رجوع
          </button>
          <div className="text-white/60 text-sm flex items-center gap-2">
            🔒 <span>دفع آمن عبر Paymob</span>
          </div>
        </div>

        {/* Iframe container */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(255,0,0,0.2)] border border-red-900/20">
          <div className="bg-gray-50 px-4 py-2 border-b flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <span className="text-gray-400 text-xs font-mono ml-2 truncate">
              {decodeURIComponent(iframeUrl).slice(0, 60)}...
            </span>
          </div>
          <iframe
            src={decodeURIComponent(iframeUrl)}
            className="w-full h-[580px] border-none"
            title="Paymob Payment Gateway"
            allow="payment"
          />
        </div>

        <p className="text-center text-white/20 text-xs mt-4">
          🛡️ بياناتك محمية بتشفير SSL — Paymob PCI DSS Compliant
        </p>
      </div>
    </div>
  );
}
export default function PaymobIframePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white/60 animate-pulse">جاري التحميل...</div>
      </div>
    }>
      <PaymobIframeInner />
    </Suspense>
  );
}
