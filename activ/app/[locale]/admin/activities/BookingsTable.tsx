'use client';

import { useEffect, useState } from 'react';

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
};

const STATUS_COLORS: Record<string, string> = {
  pending:  'bg-yellow-900/30 text-yellow-400 border-yellow-700/40',
  approved: 'bg-green-900/30 text-green-400 border-green-700/40',
  rejected: 'bg-red-900/30 text-red-400 border-red-700/40',
};

export default function AdminBookingsTable() {
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
      const res = await fetch('/api/bookings');
      const data = await res.json();
      if (Array.isArray(data)) setBookings(data);
    } catch (err) {
      console.error('Failed to fetch bookings', err);
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
    setSaveMsg('');
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          paymentStatus: status === 'approved' ? 'approved' : 'rejected',
          approvedPrice: panelPrice ? Number(panelPrice) : null,
          adminNote: panelNote || null,
          holdUntil: panelHold ? new Date(panelHold).toISOString() : null,
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setBookings(prev => prev.map(b => b._id === id ? updated : b));
        setSelectedBooking(updated);
        setSaveMsg(status === 'approved' ? '✅ تمت الموافقة' : '❌ تم الرفض');
      }
    } catch (err) {
      setSaveMsg('خطأ في الحفظ');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNote = async () => {
    if (!selectedBooking) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/bookings/${selectedBooking._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          approvedPrice: panelPrice ? Number(panelPrice) : null,
          adminNote: panelNote || null,
          holdUntil: panelHold ? new Date(panelHold).toISOString() : null,
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setBookings(prev => prev.map(b => b._id === selectedBooking._id ? updated : b));
        setSelectedBooking(updated);
        setSaveMsg('💾 تم الحفظ');
      }
    } finally {
      setSaving(false);
    }
  };

  const filtered = bookings.filter(b => filter === 'all' || b.status === filter);
  const counts = { all: bookings.length, pending: bookings.filter(b => b.status === 'pending').length, approved: bookings.filter(b => b.status === 'approved').length, rejected: bookings.filter(b => b.status === 'rejected').length };

  if (loading) return <div className="text-white/50 p-8 text-center animate-pulse">جاري التحميل...</div>;

  return (
    <div className="flex gap-6 h-full" dir="rtl">
      {/* ── Table side ─────────────────────────────────────────────── */}
      <div className={`${selectedBooking ? 'flex-1' : 'w-full'} min-w-0`}>
        {/* Filter tabs */}
        <div className="flex gap-2 mb-5 flex-wrap">
          {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-bold border transition-all ${filter === f ? 'bg-red-600 border-red-500 text-white' : 'bg-white/5 border-white/10 text-white/50 hover:text-white hover:border-white/20'}`}
            >
              {f === 'all' ? 'الكل' : f === 'pending' ? '⏳ قيد المراجعة' : f === 'approved' ? '✅ مؤكد' : '❌ مرفوض'}
              <span className="mr-1.5 text-xs opacity-60">({counts[f]})</span>
            </button>
          ))}
          <button onClick={fetchBookings} className="mr-auto px-3 py-1.5 rounded-full text-xs bg-white/5 border border-white/10 text-white/40 hover:text-white transition">🔄 تحديث</button>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-white/30">
            <div className="text-4xl mb-3">📭</div>
            <p>لا توجد حجوزات</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-white/8">
            <table className="w-full text-sm text-white">
              <thead>
                <tr className="border-b border-white/8 bg-white/[0.02]">
                  {['الاسم', 'النشاط', 'طريقة الدفع', 'التاريخ', 'الحالة', 'السعر', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-right text-white/40 font-semibold text-xs">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(b => (
                  <tr
                    key={b._id}
                    onClick={() => openPanel(b)}
                    className={`border-b border-white/5 cursor-pointer hover:bg-white/[0.03] transition ${selectedBooking?._id === b._id ? 'bg-red-950/10' : ''}`}
                  >
                    <td className="px-4 py-3">
                      <div className="font-bold">{b.userFullName}</div>
                      <div className="text-white/30 text-xs">{b.userPhone || b.userId}</div>
                    </td>
                    <td className="px-4 py-3 text-white/70">{b.activityName}</td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1 text-white/60">
                        {b.paymentMethod === 'receipt' ? '🧾' : b.paymentMethod === 'instapay' ? '📲' : '📱'}
                        {b.paymentMethod}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white/40 text-xs">{new Date(b.createdAt).toLocaleDateString('ar-EG')}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs border font-bold ${STATUS_COLORS[b.status]}`}>
                        {b.status === 'pending' ? 'قيد المراجعة' : b.status === 'approved' ? 'مؤكد' : 'مرفوض'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-green-400 font-bold">
                      {b.approvedPrice ? `${b.approvedPrice} ج.م` : <span className="text-white/20">—</span>}
                    </td>
                    <td className="px-4 py-3 text-red-400 text-xs">
                      {b.proofUrl && <a href={b.proofUrl} target="_blank" onClick={e => e.stopPropagation()} className="hover:text-red-300">📎 إيصال</a>}
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
        <div className="w-80 flex-shrink-0 bg-[#0d0d0d] border border-red-900/30 rounded-2xl p-5 space-y-4 overflow-y-auto max-h-[80vh] sticky top-0">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-lg text-white">تفاصيل الحجز</h3>
            <button onClick={() => setSelectedBooking(null)} className="text-white/30 hover:text-white text-xl">✕</button>
          </div>

          {/* Status badge */}
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${STATUS_COLORS[selectedBooking.status]}`}>
            {selectedBooking.status === 'pending' ? '⏳ قيد المراجعة' : selectedBooking.status === 'approved' ? '✅ مؤكد' : '❌ مرفوض'}
          </span>

          {/* Info grid */}
          <div className="space-y-2 text-xs border border-white/8 rounded-xl p-3">
            {[
              ['الاسم', selectedBooking.userFullName],
              ['العمر', selectedBooking.userAge],
              ['الرقم القومي', selectedBooking.userId],
              ['الهاتف', selectedBooking.userPhone],
              ['الإيميل', selectedBooking.userEmail],
              ['النشاط', selectedBooking.activityName],
              ['المدرب', selectedBooking.coach],
              ['التاريخ', selectedBooking.date],
              ['الوقت', selectedBooking.time],
              ['المكان', selectedBooking.location],
              ['طريقة الدفع', `${selectedBooking.paymentMethod}${selectedBooking.walletType ? ` (${selectedBooking.walletType})` : ''}`],
              ['تاريخ الحجز', new Date(selectedBooking.createdAt).toLocaleString('ar-EG')],
            ].map(([l, v]) => v ? (
              <div key={l} className="flex justify-between gap-2">
                <span className="text-white/30">{l}</span>
                <span className="text-white/80 text-left font-medium">{v}</span>
              </div>
            ) : null)}
          </div>

          {/* Proof of payment */}
          {selectedBooking.proofUrl && (
            <div>
              <p className="text-white/40 text-xs mb-2">إثبات الدفع:</p>
              {selectedBooking.proofUrl.match(/\.(jpg|jpeg|png|webp)$/i) ? (
                <img src={selectedBooking.proofUrl} alt="proof" className="w-full rounded-xl border border-white/10 max-h-40 object-cover" />
              ) : (
                <a href={selectedBooking.proofUrl} target="_blank" className="flex items-center gap-2 text-red-400 text-xs hover:text-red-300 transition bg-red-950/20 rounded-xl p-3 border border-red-900/20">
                  📄 {selectedBooking.proofFileName || 'عرض الملف'}
                </a>
              )}
            </div>
          )}

          {/* Admin controls */}
          <div className="space-y-3 border-t border-white/8 pt-3">
            <div>
              <label className="text-white/40 text-xs block mb-1">السعر المحدد (ج.م)</label>
              <input type="number" placeholder="0.00" value={panelPrice} onChange={e => setPanelPrice(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:border-green-500 focus:outline-none transition" dir="ltr" />
            </div>
            <div>
              <label className="text-white/40 text-xs block mb-1">الحجز محجوز حتى</label>
              <input type="date" value={panelHold} onChange={e => setPanelHold(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:border-yellow-500 focus:outline-none transition" dir="ltr" />
            </div>
            <div>
              <label className="text-white/40 text-xs block mb-1">ملاحظة للمستخدم</label>
              <textarea rows={2} value={panelNote} onChange={e => setPanelNote(e.target.value)} placeholder="أضف ملاحظة..."
                className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:border-blue-500 focus:outline-none transition resize-none" />
            </div>

            <button onClick={handleSaveNote} disabled={saving}
              className="w-full py-2 rounded-xl bg-white/5 border border-white/10 text-white/70 text-sm font-semibold hover:bg-white/8 transition disabled:opacity-40">
              💾 حفظ التعديلات
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleAction(selectedBooking._id, 'approved')}
                disabled={saving || selectedBooking.status === 'approved'}
                className="py-2.5 rounded-xl bg-green-700 hover:bg-green-600 text-white font-black text-sm transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ✅ موافقة
              </button>
              <button
                onClick={() => handleAction(selectedBooking._id, 'rejected')}
                disabled={saving || selectedBooking.status === 'rejected'}
                className="py-2.5 rounded-xl bg-red-700 hover:bg-red-600 text-white font-black text-sm transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ❌ رفض
              </button>
            </div>

            {saveMsg && <p className="text-center text-sm font-bold" style={{ color: saveMsg.includes('✅') || saveMsg.includes('💾') ? '#4ade80' : '#f87171' }}>{saveMsg}</p>}
          </div>

          {/* ID */}
          <p className="text-white/15 text-[10px] font-mono break-all">{selectedBooking._id}</p>
        </div>
      )}
    </div>
  );
}
