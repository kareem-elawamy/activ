'use client';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';

const STATUS_CONFIG = {
  pending:  { label: { ar: 'قيد المراجعة', en: 'Under Review' }, color: 'bg-yellow-900/30 text-yellow-400 border-yellow-700/40', icon: '⏳' },
  approved: { label: { ar: 'تم التأكيد',   en: 'Approved'      }, color: 'bg-green-900/30 text-green-400 border-green-700/40',   icon: '✅' },
  rejected: { label: { ar: 'مرفوض',        en: 'Rejected'      }, color: 'bg-red-900/30 text-red-400 border-red-700/40',         icon: '❌' },
};

const PAYMENT_ICONS = { receipt: '🧾', instapay: '📲', wallet: '📱' };

export default function MyBookingsPage({ params }) {
  // In Next.js 14 App Router, params is a promise in some configs — use React.use() to be safe
  const resolvedParams = typeof params?.then === 'function' ? use(params) : params;
  const lang = resolvedParams?.locale || 'ar';
  const isAr = lang === 'ar';

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');

  const loadBookings = async (id) => {
    try {
      const res = await fetch(`/api/bookings?userId=${encodeURIComponent(id)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data)) setBookings(data);
      else setError('Failed to load bookings');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const id = localStorage.getItem('userId') || localStorage.getItem('nationalId');
    if (id) {
      setUserId(id);
      loadBookings(id);
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="text-4xl animate-spin">⟳</div>
        <div className="text-white/50">{isAr ? 'جاري التحميل...' : 'Loading...'}</div>
      </div>
    </div>
  );

  if (!userId) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-5 p-6 text-center pt-28">
      <div className="text-6xl">📋</div>
      <h2 className="text-white text-2xl font-black">{isAr ? 'لا توجد حجوزات بعد' : 'No bookings found'}</h2>
      <p className="text-white/40 max-w-sm">{isAr ? 'قم بحجز نشاط أولاً من صفحة الرياضات وسيظهر حجزك هنا تلقائياً' : 'Book an activity from the Sports page and it will appear here automatically'}</p>
      <Link href={`/${lang}/sports`}>
        <button className="px-8 py-3 bg-gradient-to-r from-red-700 to-red-500 text-white rounded-xl font-bold hover:opacity-90 transition shadow-[0_0_20px_rgba(220,38,38,0.3)]">
          {isAr ? '⚽ استكشاف الأنشطة' : '⚽ Explore Activities'}
        </button>
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-black pt-24 pb-16 px-4" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-8 flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-black text-white mb-1">{isAr ? '📋 حجوزاتي' : '📋 My Bookings'}</h1>
            <p className="text-white/30 text-sm">{isAr ? `الرقم القومي: ${userId}` : `ID: ${userId}`}</p>
          </div>
          <button
            onClick={() => { setLoading(true); loadBookings(userId); }}
            className="px-4 py-2 text-sm bg-white/5 border border-white/10 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition"
          >
            🔄 {isAr ? 'تحديث' : 'Refresh'}
          </button>
        </div>

        {error && (
          <div className="bg-red-950/20 border border-red-800/30 rounded-xl p-3 mb-5 text-red-400 text-sm">
            {isAr ? '⚠️ خطأ في التحميل: ' : '⚠️ Error: '}{error}
          </div>
        )}

        {bookings.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-white/40 text-lg">{isAr ? 'لا توجد حجوزات بعد' : 'No bookings yet'}</p>
            <Link href={`/${lang}/sports`}>
              <button className="mt-6 px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-500 transition">
                {isAr ? 'احجز الآن' : 'Book Now'}
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map(booking => {
              const cfg = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending;
              return (
                <div key={booking._id} className="bg-[#0d0d0d] border border-white/8 rounded-2xl overflow-hidden hover:border-red-900/40 transition-all">
                  {/* Top bar */}
                  <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5 bg-white/[0.01]">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{PAYMENT_ICONS[booking.paymentMethod] || '📋'}</span>
                      <span className="text-white font-black">{booking.activityName}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${cfg.color}`}>
                      {cfg.icon} {cfg.label[isAr ? 'ar' : 'en']}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="px-5 py-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                    {booking.coach     && <Info label={isAr ? 'المدرب'       : 'Coach'}          value={booking.coach} />}
                    {booking.date      && <Info label={isAr ? 'التاريخ'      : 'Date'}           value={booking.date} />}
                    {booking.time      && <Info label={isAr ? 'الوقت'        : 'Time'}           value={booking.time} />}
                    {booking.location  && <Info label={isAr ? 'الموقع'       : 'Location'}       value={booking.location} />}
                    {booking.paymentMethod && (
                      <Info label={isAr ? 'طريقة الدفع' : 'Payment'}
                        value={`${booking.paymentMethod}${booking.walletType ? ` (${booking.walletType})` : ''}`} />
                    )}
                    {booking.approvedPrice != null && (
                      <Info label={isAr ? 'السعر المحدد' : 'Set Price'}
                        value={`${booking.approvedPrice} ${isAr ? 'ج.م' : 'EGP'}`} highlight />
                    )}
                    {booking.holdUntil && (
                      <Info label={isAr ? 'محجوز حتى' : 'Held Until'}
                        value={new Date(booking.holdUntil).toLocaleDateString(isAr ? 'ar-EG' : 'en-US')} />
                    )}
                  </div>

                  {/* Admin note */}
                  {booking.adminNote && (
                    <div className="mx-5 mb-4 bg-blue-950/20 border border-blue-800/30 rounded-xl px-4 py-2.5 text-sm text-blue-300">
                      <span className="font-bold text-blue-400">{isAr ? '💬 ملاحظة الأكاديمية: ' : '💬 Academy Note: '}</span>
                      {booking.adminNote}
                    </div>
                  )}

                  {/* Proof */}
                  {booking.proofUrl && (
                    <div className="px-5 pb-3">
                      <a href={booking.proofUrl} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition bg-red-950/20 border border-red-900/20 rounded-lg px-3 py-1.5">
                        📎 {isAr ? 'عرض إثبات الدفع' : 'View Payment Proof'}
                      </a>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="px-5 pb-3 flex justify-between items-center border-t border-white/5 pt-2.5 mt-1">
                    <span className="text-white/15 text-[10px] font-mono">{booking._id}</span>
                    <span className="text-white/20 text-xs">
                      {new Date(booking.createdAt).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function Info({ label, value, highlight = false }) {
  return (
    <div>
      <div className="text-white/25 text-[11px] mb-0.5">{label}</div>
      <div className={`font-semibold text-sm ${highlight ? 'text-green-400 text-base' : 'text-white/80'}`}>{value}</div>
    </div>
  );
}
