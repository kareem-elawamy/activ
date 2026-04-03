'use client';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import api from '@/utils/api';
import EmptyState from '@/components/EmptyState';
import { BookingRowSkeleton } from '@/components/ActivityCardSkeleton';

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
  const [userName, setUserName] = useState('');
  const [error, setError] = useState('');

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      if (!token) {
        setError(isAr ? 'يجب تسجيل الدخول' : 'You must log in to view bookings.');
        return;
      }
      
      // We use our centralized api instance which automatically handles tokens and 401 redirects!
      const res = await api.get('/booking/my');
      setBookings(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('userName');
    if (name) setUserName(name);

    if (token) {
      loadBookings();
    } else {
      setLoading(false);
    }
  }, []);


  if (!userName && !localStorage.getItem('token')) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-5 p-6 text-center pt-28">
      <div className="text-6xl">🔒</div>
      <h2 className="text-white text-2xl font-black">{isAr ? 'يرجى تسجيل الدخول' : 'Please Sign In'}</h2>
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
            <p className="text-white/30 text-sm">{userName}</p>
          </div>
          <button
            onClick={() => loadBookings()}
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

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <BookingRowSkeleton key={i} />)}
          </div>
        ) : bookings.length === 0 ? (
          <EmptyState 
            icon="📅"
            title={isAr ? 'لا توجد حجوزات' : 'No bookings yet'}
            message={isAr ? 'قم بحجز نشاط أولاً من صفحة الرياضات وسيظهر حجزك هنا تلقائياً' : 'Book an activity from the Sports page and it will appear here automatically'}
            actionLabel={isAr ? 'احجز الآن' : 'Book Now'}
            onAction={() => window.location.href = `/${lang}/sports`}
          />
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
                      <span className="text-white font-black">{booking.workout?.name || booking.activityName}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${cfg.color}`}>
                      {cfg.icon} {cfg.label[isAr ? 'ar' : 'en']}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="px-5 py-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                    {booking.workout?.coach && <Info label={isAr ? 'المدرب' : 'Coach'} value={booking.workout.coach} />}
                    {booking.date && <Info label={isAr ? 'التاريخ' : 'Date'} value={booking.date} />}
                    {booking.workout?.time && <Info label={isAr ? 'الوقت' : 'Time'} value={booking.workout.time} />}
                    {booking.workout?.location && <Info label={isAr ? 'الموقع' : 'Location'} value={booking.workout.location} />}
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
