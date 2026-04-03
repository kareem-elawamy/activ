'use client';

import { useEffect, useState } from 'react';
import api from '@/utils/api';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';

type Booking = {
  _id: string;
  activityName: string;
  activityId: string;
  userFullName: string;
  userAge?: string;
  userId: string;
  userPhone?: string;
  userEmail?: string;
  coach?: string;
  date?: string;
  time?: string;
  location?: string;
  paymentMethod: string;
  walletType?: string;
  proofUrl?: string;
  proofFileName?: string;
  status: 'pending' | 'approved' | 'rejected';
  paymentStatus: string;
  approvedPrice?: string | number;
  holdUntil?: string;
  adminNote?: string;
  createdAt: string;
  // Trainee/Parent metadata
  traineeName?: string;
  parentName?: string;
  parentPhone?: string;
  nationalId?: string;
};

const STATUS_COLORS: Record<string, string> = {
  pending:  'bg-yellow-900/30 text-yellow-400 border-yellow-700/40',
  approved: 'bg-green-900/30 text-green-400 border-green-700/40',
  rejected: 'bg-red-900/30 text-red-400 border-red-700/40',
};

export default function AdminBookingsTable() {
  const t = useTranslations('adminPanel.bookings');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Panel state
  const [panelPrice, setPanelPrice] = useState('');
  const [panelNote, setPanelNote] = useState('');
  const [panelHold, setPanelHold] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/booking');
      if (Array.isArray(res.data)) setBookings(res.data);
    } catch (err) {
      console.error('Failed to fetch bookings', err);
      toast.error(t('failedLoad'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const openPanel = (b: Booking) => {
    setSelectedBooking(b);
    setPanelPrice(b.approvedPrice?.toString() || '');
    setPanelNote(b.adminNote || '');
    setPanelHold(b.holdUntil ? b.holdUntil.slice(0, 10) : '');
    setSaveMsg('');
  };

  const handleAction = async (id: string, status: 'approved' | 'rejected') => {
    setSaving(true);
    try {
      const res = await api.put(`/booking/${id}/status`, {
        status,
        approvedPrice: panelPrice ? Number(panelPrice) : undefined,
        adminNote: panelNote || undefined
      });
      
      const updated = res.data.booking;
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status: updated.status, approvedPrice: updated.approvedPrice, adminNote: updated.adminNote } : b));
      setSelectedBooking(prev => prev ? { ...prev, status: updated.status, approvedPrice: updated.approvedPrice, adminNote: updated.adminNote } : null);
      
      toast.success(status === 'approved' ? `✅ ${t('approveSuccess')}` : `❌ ${t('rejectSuccess')}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || t('actionError'));
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNote = async () => {
    if (!selectedBooking) return;
    setSaving(true);
    try {
      const res = await api.put(`/booking/${selectedBooking._id}/status`, {
        status: selectedBooking.status, 
        approvedPrice: panelPrice ? Number(panelPrice) : undefined,
        adminNote: panelNote || undefined
      });
      const updated = res.data.booking;
      setBookings(prev => prev.map(b => b._id === selectedBooking._id ? { ...b, approvedPrice: updated.approvedPrice, adminNote: updated.adminNote } : b));
      setSelectedBooking(prev => prev ? { ...prev, approvedPrice: updated.approvedPrice, adminNote: updated.adminNote } : null);
      toast.success(`💾 ${t('saveSuccess')}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || t('saveError'));
    } finally {
      setSaving(false);
    }
  };

  const filtered = bookings.filter(b => filter === 'all' || b.status === filter);
  const counts = { all: bookings.length, pending: bookings.filter(b => b.status === 'pending').length, approved: bookings.filter(b => b.status === 'approved').length, rejected: bookings.filter(b => b.status === 'rejected').length };

  if (loading) return <div className="text-white/50 p-8 text-center animate-pulse">...</div>;

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* ── Table side ─────────────────────────────────────────────── */}
      <div className={`${selectedBooking ? 'w-full lg:w-2/3' : 'w-full'} min-w-0 transition-all duration-300`}>
        {/* Filter tabs */}
        <div className="flex gap-2 mb-5 flex-wrap">
          {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-bold border transition-all ${filter === f ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-900/20' : 'bg-white/5 border-white/10 text-white/50 hover:text-white hover:border-white/30 hover:bg-white/10'}`}
            >
              {f === 'all' ? t('all') : f === 'pending' ? `⏳ ${t('pending')}` : f === 'approved' ? `✅ ${t('approved')}` : `❌ ${t('rejected')}`}
              <span className="ml-1.5 text-xs opacity-60">({counts[f]})</span>
            </button>
          ))}
          <div className="flex-1"></div>
          <button onClick={fetchBookings} className="px-4 py-1.5 rounded-full text-xs bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition font-bold">🔄 {t('refresh')}</button>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-white/30 border border-white/5 rounded-2xl bg-black/40">
            <div className="text-4xl mb-3">📭</div>
            <p className="font-semibold text-lg">{t('noBookings')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-white/8 shadow-2xl">
            <table className="w-full text-sm text-left text-white whitespace-nowrap">
              <thead className="bg-white/5 border-b border-white/10 uppercase text-xs font-black text-white/50">
                <tr>
                  {[t('name'), t('activity'), t('paymentMethod'), t('date'), t('status'), t('price'), ''].map((h, i) => (
                    <th key={i} className="px-5 py-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map(b => (
                  <tr
                    key={b._id}
                    onClick={() => openPanel(b)}
                    className={`cursor-pointer transition-colors ${selectedBooking?._id === b._id ? 'bg-red-900/20 border-l-2 border-red-500' : 'hover:bg-white/5 border-l-2 border-transparent'}`}
                  >
                    <td className="px-5 py-4">
                      <div className="font-bold text-white">{b.userFullName}</div>
                      <div className="text-white/40 text-xs mt-0.5 font-mono">{b.userPhone || b.userId}</div>
                    </td>
                    <td className="px-5 py-4 font-medium text-white/80">{b.activityName}</td>
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-2 text-white/60 text-xs font-semibold bg-white/5 px-2.5 py-1 rounded-md inline-flex">
                        {b.paymentMethod === 'receipt' ? '🧾' : b.paymentMethod === 'instapay' ? '📲' : '📱'}
                        <span className="capitalize">{b.paymentMethod}</span>
                      </span>
                    </td>
                    <td className="px-5 py-4 text-white/40 text-xs">{new Date(b.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs border font-bold capitalize ${STATUS_COLORS[b.status]}`}>
                        {b.status === 'pending' ? t('pending') : b.status === 'approved' ? t('approved') : t('rejected')}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-black">
                      {b.approvedPrice ? <span className="text-emerald-400">{b.approvedPrice}</span> : <span className="text-white/20">—</span>}
                    </td>
                    <td className="px-5 py-4 text-xs font-bold text-red-500 text-right">
                      {b.proofUrl && <a href={b.proofUrl} target="_blank" onClick={e => e.stopPropagation()} className="hover:text-red-400 px-2 py-1 bg-red-500/10 rounded-md">📎 {t('receipt')}</a>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Detail panel ────────────────────────────────────────────── */}
      {selectedBooking && (
        <div className="w-full lg:w-1/3 flex-shrink-0 bg-[#0a0a0a] border border-red-900/30 rounded-2xl p-6 space-y-5 overflow-y-auto max-h-[85vh] sticky top-0 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="font-black text-xl text-white flex items-center gap-2">📋 {t('details')}</h3>
            <button onClick={() => setSelectedBooking(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition">✕</button>
          </div>

          {/* Status badge */}
          <div className="flex items-center justify-between bg-black rounded-xl p-3 border border-white/5">
            <span className="text-white/40 text-xs font-bold uppercase">{t('status')}</span>
            <span className={`px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${STATUS_COLORS[selectedBooking.status]}`}>
              {selectedBooking.status === 'pending' ? `⏳ ${t('pending')}` : selectedBooking.status === 'approved' ? `✅ ${t('approved')}` : `❌ ${t('rejected')}`}
            </span>
          </div>

          {/* Trainee/Parent Info — highlighted section */}
          {(selectedBooking.traineeName || selectedBooking.parentName || selectedBooking.parentPhone || selectedBooking.nationalId) && (
            <div className="bg-gradient-to-br from-blue-950/30 to-black rounded-xl p-4 border border-blue-800/30 space-y-3">
              <p className="text-blue-400 text-xs font-black uppercase tracking-widest mb-2">👶 {t('traineeName')}</p>
              {[
                [t('traineeName'), selectedBooking.traineeName, 'font-bold text-blue-300'],
                [t('parentName'), selectedBooking.parentName, 'font-semibold text-white'],
                [t('parentPhone'), selectedBooking.parentPhone, 'font-mono text-blue-400'],
                [t('nationalId'), selectedBooking.nationalId, 'font-mono text-white/60'],
              ].map(([l, v, c]) => v ? (
                <div key={l as string} className="flex justify-between items-start gap-4">
                  <span className="text-blue-400/50 text-xs font-semibold whitespace-nowrap pt-0.5">{l}</span>
                  <span className={`text-sm text-right ${c || 'text-white/80'}`}>{v}</span>
                </div>
              ) : null)}
            </div>
          )}

          {/* Info grid */}
          <div className="space-y-3 bg-black rounded-xl p-4 border border-white/5">
            {[
              [t('name'), selectedBooking.userFullName, 'font-bold text-white'],
              [t('age'), selectedBooking.userAge],
              [t('nationalId'), selectedBooking.userId, 'font-mono'],
              [t('phone'), selectedBooking.userPhone, 'font-mono text-red-400'],
              [t('email'), selectedBooking.userEmail],
              [t('activity'), selectedBooking.activityName, 'font-bold'],
              [t('coach'), selectedBooking.coach],
              [t('date'), selectedBooking.date],
              [t('time'), selectedBooking.time],
              [t('location'), selectedBooking.location],
              [t('paymentMethod'), <span key="pay" className="capitalize text-emerald-400 font-bold">{selectedBooking.paymentMethod}{selectedBooking.walletType ? ` (${selectedBooking.walletType})` : ''}</span>],
              [t('bookingDate'), new Date(selectedBooking.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })],
            ].map(([l, v, c]) => v ? (
              <div key={l as string} className="flex justify-between items-start gap-4">
                <span className="text-white/40 text-xs font-semibold whitespace-nowrap pt-0.5">{l}</span>
                <span className={`text-white/80 text-sm text-right ${c || ''}`}>{v}</span>
              </div>
            ) : null)}
          </div>

          {/* Proof of payment */}
          {selectedBooking.proofUrl && (
            <div className="bg-black rounded-xl p-4 border border-white/5">
              <p className="text-white/50 text-xs font-bold mb-3 uppercase tracking-wide">{t('proofOfPayment')}</p>
              {selectedBooking.proofUrl.match(/\.(jpg|jpeg|png|webp)$/i) ? (
                <a href={selectedBooking.proofUrl} target="_blank" rel="noreferrer" className="block relative group rounded-xl overflow-hidden border border-white/10">
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity z-10 font-bold text-sm backdrop-blur-sm">🔍 View Full</div>
                  <img src={selectedBooking.proofUrl} alt="proof" className="w-full max-h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
                </a>
              ) : (
                <a href={selectedBooking.proofUrl} target="_blank" className="flex items-center gap-3 text-red-400 font-bold hover:text-red-300 transition bg-red-950/30 rounded-xl p-4 border border-red-900/30 hover:bg-red-900/40">
                  <span className="text-2xl">📄</span> {selectedBooking.proofFileName || t('viewFile')}
                </a>
              )}
            </div>
          )}

          {/* Admin controls */}
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-white/40 text-xs font-bold block mb-1.5 uppercase ml-1">{t('approvedPrice')}</label>
              <input type="number" placeholder="0.00" value={panelPrice} onChange={e => setPanelPrice(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm focus:border-green-500 focus:bg-white/[0.05] focus:outline-none transition shadow-inner font-mono font-bold" />
            </div>
            <div>
              <label className="text-white/40 text-xs font-bold block mb-1.5 uppercase ml-1">{t('holdUntil')}</label>
              <input type="date" value={panelHold} onChange={e => setPanelHold(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm focus:border-yellow-500 focus:bg-white/[0.05] focus:outline-none transition shadow-inner dark:[color-scheme:dark]" />
            </div>
            <div>
              <label className="text-white/40 text-xs font-bold block mb-1.5 uppercase ml-1">{t('adminNote')}</label>
              <textarea rows={3} value={panelNote} onChange={e => setPanelNote(e.target.value)} placeholder={t('adminNotePlaceholder')}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm focus:border-blue-500 focus:bg-white/[0.05] focus:outline-none transition resize-none shadow-inner" />
            </div>

            <button onClick={handleSaveNote} disabled={saving}
              className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white uppercase tracking-wider text-xs font-black flex items-center justify-center gap-2 hover:bg-white/10 hover:border-white/20 transition disabled:opacity-40 disabled:cursor-not-allowed">
              💾 {t('saveChanges')}
            </button>

            <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-white/10">
              <button
                onClick={() => handleAction(selectedBooking._id, 'approved')}
                disabled={saving || selectedBooking.status === 'approved'}
                className="py-3.5 rounded-xl bg-green-600 hover:bg-green-500 text-white font-black text-sm uppercase tracking-wide transition disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(22,163,74,0.3)]"
              >
                ✅ {t('approve')}
              </button>
              <button
                onClick={() => handleAction(selectedBooking._id, 'rejected')}
                disabled={saving || selectedBooking.status === 'rejected'}
                className="py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-sm uppercase tracking-wide transition disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(220,38,38,0.3)]"
              >
                ❌ {t('reject')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
