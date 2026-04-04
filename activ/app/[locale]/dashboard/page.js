'use client';
import { useState, useEffect } from 'react';
import api from '@/utils/api';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const t = useTranslations('dashboard');
  const locale = useLocale();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push(`/${locale}/auth`);
        return;
      }
      
      try {
        const cacheBust = { headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }, params: { _t: Date.now() } };
        const userRes = await api.get('/auth/me', cacheBust);
        setProfile(userRes.data.user);
        
        const payRes = await api.get('/payment/my', cacheBust);
        setPayments(payRes.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router, locale]);

  if (loading) return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <div className="mb-3 flex justify-center text-yellow-500 animate-bounce"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-10 h-10"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
        <p className="text-white/60">{t('loading')}</p>
      </div>
    </div>
  );

  return (
    <div className="bg-black min-h-screen text-white pb-20 pt-28">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-4xl font-black text-red-500 mb-8">{t('title')}</h1>
        
        {error && <div className="bg-red-900/30 text-red-400 p-4 rounded-xl mb-6">{error}</div>}

        <div className="grid md:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-fit">
            <h2 className="text-2xl font-bold mb-4 border-b border-red-900/40 pb-3">{t('myProfile')}</h2>
            {profile ? (
              <div className="space-y-4 text-white/80">
                <div><span className="text-white/40 text-sm block">{t('name')}</span><span className="font-bold">{profile.name}</span></div>
                <div><span className="text-white/40 text-sm block">{t('email')}</span><span className="font-bold">{profile.email}</span></div>
                <div><span className="text-white/40 text-sm block">{t('role')}</span><span className="uppercase text-xs font-black bg-red-900/30 text-red-400 px-2 py-1 rounded inline-block">{profile.role}</span></div>
              </div>
            ) : (
                <p className="text-white/30 text-sm">{t('profileFailed')}</p>
            )}
          </div>

          {/* Payment History Section */}
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold bg-white/5 border border-white/10 rounded-2xl p-6">{t('paymentHistory')}</h2>
            {payments.length === 0 ? (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center text-white/40">
                  {t('noPayments')}
                </div>
            ) : (
                <div className="grid gap-4">
                  {payments.map(payment => (
                    <div key={payment._id} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-red-900/40 transition">
                        <div>
                            <div className="text-xs text-white/40 mb-1 font-mono">ID: {payment.booking?._id || payment.booking || payment._id}</div>
                            {payment.booking?.workout?.name && <div className="font-bold text-lg mb-1">{payment.booking.workout.name}</div>}
                            <div className="flex gap-3 text-sm mt-2">
                                <span className="bg-red-900/20 text-red-400 px-2 py-0.5 rounded capitalize font-semibold">{payment.method}</span>
                                <span className="text-green-400 font-bold">{payment.amount} EGP</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 text-sm text-right">
                           {(payment.status === 'pending' && payment.booking?.status !== 'approved' && payment.booking?.status !== 'rejected') ? (
                               <span className="bg-yellow-900/30 border border-yellow-700/40 text-yellow-500 px-3 py-1 rounded-full font-bold flex items-center gap-1.5"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>{t('pending')}</span>
                           ) : (payment.status === 'completed' || payment.booking?.status === 'approved') ? (
                               <span className="bg-green-900/30 border border-green-700/40 text-green-400 px-3 py-1 rounded-full font-bold flex items-center gap-1.5"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>{t('completed')}</span>
                           ) : (
                               <span className="bg-red-900/30 border border-red-700/40 text-red-500 px-3 py-1 rounded-full font-bold flex items-center gap-1.5"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>{t('rejected')}</span>
                           )}
                           {payment.receiptUrl && <a href={payment.receiptUrl} target="_blank" className="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-blue-400 hover:text-blue-300 hover:bg-white/10 transition mt-2 truncate max-w-[150px] inline-block">{t('viewReceipt')}</a>}
                        </div>
                    </div>
                  ))}
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
