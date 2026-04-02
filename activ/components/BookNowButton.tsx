'use client';
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import toast from 'react-hot-toast';

interface BookButtonProps {
  activity: any;
}

type Step = 'info' | 'payment-method' | 'upload-proof' | 'done';
type PayMethod = 'receipt' | 'instapay' | 'wallet' | '';
type WalletType = 'vodafone' | 'orange' | 'etisalat' | 'we' | '';

const PAYMENT_INSTRUCTIONS = {
  receipt: {
    ar: 'قم بدفع الرسوم في مقر الأكاديمية أو أي فرع، ثم ارفع صورة الإيصال هنا.',
    en: 'Pay the fees at the academy or any branch, then upload your receipt photo here.',
  },
  instapay: {
    ar: 'قم بالتحويل على حساب InstaPay: active.academy@instapay\nثم ارفع صورة التحويل.',
    en: 'Transfer via InstaPay to: active.academy@instapay\nThen upload the transfer screenshot.',
  },
  wallet: {
    ar: 'قم بالتحويل على المحفظة المختارة، ثم ارفع صورة التأكيد.',
    en: 'Transfer to the selected wallet, then upload your confirmation screenshot.',
  },
};

const WALLET_NUMBERS: Record<string, string> = {
  vodafone: '010-XXXX-XXXX (Vodafone Cash)',
  orange:   '012-XXXX-XXXX (Orange Money)',
  etisalat: '011-XXXX-XXXX (Etisalat Cash)',
  we:       '015-XXXX-XXXX (WE Pay)',
};

export default function BookButton({ activity }: BookButtonProps) {
  const { lang, t: rawT } = useTranslation();
  
  const t = {
    bookNow: String(rawT('bookNow.bookNow')),
    booked: String(rawT('bookNow.booked')),
    pending: String(rawT('bookNow.pending')),
    rejected: String(rawT('bookNow.rejected')),
    popupTitle: String(rawT('bookNow.popupTitle')),
    stepInfo: String(rawT('bookNow.stepInfo')),
    stepPayment: String(rawT('bookNow.stepPayment')),
    stepProof: String(rawT('bookNow.stepProof')),
    fullName: String(rawT('bookNow.fullName')),
    age: String(rawT('bookNow.age')),
    nationalId: String(rawT('bookNow.nationalId')),
    phone: String(rawT('bookNow.phone')),
    email: String(rawT('bookNow.email')),
    next: String(rawT('bookNow.next')),
    back: String(rawT('bookNow.back')),
    cancel: String(rawT('bookNow.cancel')),
    fillAll: String(rawT('bookNow.fillAll')),
    alreadyBooked: String(rawT('bookNow.alreadyBooked')),
    chooseMethod: String(rawT('bookNow.chooseMethod')),
    receipt: String(rawT('bookNow.receipt')),
    instapay: String(rawT('bookNow.instapay')),
    wallet: String(rawT('bookNow.wallet')),
    uploadProof: String(rawT('bookNow.uploadProof')),
    uploadHint: String(rawT('bookNow.uploadHint')),
    uploadFormats: String(rawT('bookNow.uploadFormats')),
    dragHere: String(rawT('bookNow.dragHere')),
    submitting: String(rawT('bookNow.submitting')),
    submit: String(rawT('bookNow.submit')),
    successTitle: String(rawT('bookNow.successTitle')),
    successBody: String(rawT('bookNow.successBody')),
    viewBookings: String(rawT('bookNow.viewBookings')),
    close: String(rawT('bookNow.close')),
    activity: String(rawT('bookNow.activity')),
    name: String(rawT('bookNow.name')),
    method: String(rawT('bookNow.method')),
    instructions: String(rawT('bookNow.instructions')),
    chooseWallet: String(rawT('bookNow.chooseWallet')),
    priceNote: String(rawT('bookNow.priceNote')),
    traineeName: String(rawT('bookNow.traineeName')),
    parentName: String(rawT('bookNow.parentName')),
    parentPhone: String(rawT('bookNow.parentPhone'))
  };

  const [showPopup, setShowPopup] = useState(false);
  const [bookingStatus, setBookingStatus] = useState<string | null>(null); // null | 'pending' | 'approved' | 'rejected'
  const [step, setStep] = useState<Step>('info');

  const [userInfo, setUserInfo] = useState({ fullName: '', age: '', nationalId: '', phone: '', email: '', traineeName: '', parentName: '', parentPhone: '' });
  const [payMethod, setPayMethod] = useState<PayMethod>('');
  const [walletType, setWalletType] = useState<WalletType>('');
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [createdBookingId, setCreatedBookingId] = useState('');

  // Check existing booking for this activity + user
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const apiUrl = typeof window === 'undefined' ? (process.env.INTERNAL_API_URL || 'http://app:3000') : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000');
    
    fetch(`${apiUrl}/api/booking/my?_t=${Date.now()}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        cache: 'no-store'
    })
      .then(r => r.json())
      .then(bookings => {
        if (!Array.isArray(bookings)) return;
        const existing = bookings.find((b: any) => 
               (b.workout?._id === activity._id) || (b.workout === activity._id)
        );
        if (existing) setBookingStatus(existing.status || 'pending');
      })
      .catch(() => {});
  }, [activity._id]);

  const open = () => {
    setStep('info');
    setError('');
    setPayMethod('');
    setWalletType('');
    setProofFile(null);
    setShowPopup(true);
  };

  const close = () => {
    setShowPopup(false);
    setStep('info');
    setError('');
  };

  // ── Step navigation ────────────────────────────────────────────────────
  const goToPayment = () => {
    if (!userInfo.fullName.trim() || !userInfo.nationalId.trim() || !userInfo.phone.trim() || !userInfo.traineeName.trim()) {
      setError(t.fillAll);
      return;
    }
    setError('');
    setStep('payment-method');
  };

  const goToUpload = () => {
    if (!payMethod) { setError(t.chooseMethod); return; }
    if (payMethod === 'wallet' && !walletType) { setError(t.chooseWallet); return; }
    setError('');
    setStep('upload-proof');
  };

  // ── File handling ──────────────────────────────────────────────────────
  const handleFile = (f: File | null) => {
    if (!f) return;
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowed.includes(f.type)) { setError('Only JPG, PNG, PDF allowed'); return; }
    if (f.size > 5 * 1024 * 1024) { setError('File too large (max 5 MB)'); return; }
    setError('');
    setProofFile(f);
  };

  // ── Final submit ───────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!proofFile) { setError(t.uploadHint); return; }
    setSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error(lang === 'ar' ? 'يجب تسجيل الدخول لإتمام الحجز' : 'You must log in to book.');

      const apiUrl = typeof window === 'undefined' ? (process.env.INTERNAL_API_URL || 'http://app:3000') : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000');
      const headers = { Authorization: `Bearer ${token}` };

      // 1. Upload proof file secured
      const fd = new FormData();
      fd.append('file', proofFile);
      const uploadRes = await fetch('/api/upload', { 
        method: 'POST', 
        headers, // Push token
        body: fd 
      });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error || uploadData.message || 'Upload failed');

      // 2. Create Booking natively mapped
      const bookingRes = await fetch(`${apiUrl}/api/booking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({
          workoutId: activity._id,
          date: activity.date || new Date().toISOString(),
          userFullName: userInfo.fullName,
          userPhone: userInfo.phone,
          nationalId: userInfo.nationalId,
          traineeName: userInfo.traineeName,
          parentName: userInfo.parentName,
          parentPhone: userInfo.parentPhone,
          paymentMethod: payMethod,
          walletType: walletType || undefined,
          proofUrl: uploadData.url
        }),
      });
      const bookingData = await bookingRes.json();
      if (!bookingRes.ok) throw new Error(bookingData.message || 'Booking already exists or creation failed');

      // 3. Create Payment record mapped to Booking
      const paymentRes = await fetch(`${apiUrl}/api/payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({
           amount: activity.price ? parseFloat(activity.price) : 0,
           method: payMethod,
           receiptUrl: uploadData.url,
           bookingId: bookingData._id
        }),
      });
      const paymentData = await paymentRes.json();
      if (!paymentRes.ok) throw new Error(paymentData.message || 'Payment submission failed');

      // Sync local identity
      if (userInfo.fullName) localStorage.setItem('userName', userInfo.fullName);

      setCreatedBookingId(bookingData._id);
      setBookingStatus('pending');
      setStep('done');
      toast.success(t.successTitle);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      toast.error(err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Button label ───────────────────────────────────────────────────────
  const buttonLabel =
    bookingStatus === 'approved' ? t.booked
    : bookingStatus === 'pending' ? t.pending
    : bookingStatus === 'rejected' ? t.rejected
    : t.bookNow;

  const isDisabled = bookingStatus === 'approved' || bookingStatus === 'pending';

  const stepIndex = { info: 0, 'payment-method': 1, 'upload-proof': 2, done: 3 }[step];

  return (
    <>
      <button
        onClick={open}
        disabled={isDisabled}
        className={`w-full py-3 rounded-xl font-bold shadow-lg transition-all ${
          bookingStatus === 'approved' ? 'bg-green-700 cursor-not-allowed'
          : bookingStatus === 'pending' ? 'bg-yellow-700 cursor-not-allowed'
          : bookingStatus === 'rejected' ? 'bg-gray-600 cursor-not-allowed'
          : 'bg-gradient-to-r from-red-500 to-red-700 hover:shadow-[0_0_20px_rgba(239,68,68,0.5)] hover:scale-[1.02]'
        } text-white`}
      >
        {buttonLabel}
      </button>

      {showPopup && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50 p-4"
          onClick={close}
        >
          <div
            className="bg-[#0a0a0a] border border-red-900/40 rounded-2xl text-white w-full max-w-md shadow-[0_0_60px_rgba(220,38,38,0.15)] overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-red-900/25 bg-red-950/10">
              <h3 className="text-lg font-black tracking-tight">
                {step === 'done' ? t.successTitle : t.popupTitle}
              </h3>
              <button onClick={close} className="text-white/30 hover:text-white transition text-2xl leading-none w-8 h-8 flex items-center justify-center">✕</button>
            </div>

            {/* Step indicator (not on done) */}
            {step !== 'done' && (
              <div className="flex items-center gap-0 px-6 py-3 border-b border-white/5">
                {[t.stepInfo, t.stepPayment, t.stepProof].map((label, i) => (
                  <div key={i} className="flex items-center flex-1">
                    <div className={`flex items-center gap-1.5 ${i <= stepIndex ? 'text-red-400' : 'text-white/20'}`}>
                      <div className={`w-5 h-5 rounded-full border text-xs flex items-center justify-center font-bold ${i < stepIndex ? 'bg-red-600 border-red-600' : i === stepIndex ? 'border-red-500' : 'border-white/20'}`}>
                        {i < stepIndex ? '✓' : i + 1}
                      </div>
                      <span className="text-[10px] font-semibold hidden sm:block">{label}</span>
                    </div>
                    {i < 2 && <div className={`flex-1 h-px mx-2 ${i < stepIndex ? 'bg-red-700' : 'bg-white/10'}`} />}
                  </div>
                ))}
              </div>
            )}

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">

              {/* ── STEP 1: Info ─────────────────────────────────────── */}
              {step === 'info' && (
                <>
                  {/* Activity pill */}
                  <div className="bg-red-950/20 border border-red-900/30 rounded-xl px-4 py-2.5 flex items-center justify-between text-sm">
                    <span className="text-red-400 font-bold">{activity.name}</span>
                    <span className="text-white/40 text-xs">{t.priceNote}</span>
                  </div>

                  {[
                    { key: 'traineeName', label: t.traineeName || (lang === 'ar' ? 'اسم المتدرب' : 'Trainee Name'), type: 'text', required: true },
                    { key: 'fullName', label: t.fullName, type: 'text', required: true },
                    { key: 'parentName', label: t.parentName || (lang === 'ar' ? 'اسم ولي الأمر' : 'Parent Name'), type: 'text', required: false },
                    { key: 'age', label: t.age, type: 'number', required: false },
                    { key: 'nationalId', label: t.nationalId, type: 'text', required: true },
                    { key: 'phone', label: t.phone, type: 'tel', required: true },
                    { key: 'parentPhone', label: t.parentPhone || (lang === 'ar' ? 'رقم هاتف ولي الأمر' : 'Parent Phone'), type: 'tel', required: false },
                    { key: 'email', label: t.email, type: 'email', required: false },
                  ].map(field => (
                    <div key={field.key}>
                      <label className="text-white/40 text-xs font-semibold block mb-1">
                        {field.label}{field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      <input
                        type={field.type}
                        value={(userInfo as any)[field.key]}
                        onChange={e => setUserInfo({ ...userInfo, [field.key]: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm placeholder-white/20 focus:border-red-500 focus:outline-none transition"
                        dir={field.type === 'tel' || field.type === 'email' ? 'ltr' : undefined}
                      />
                    </div>
                  ))}

                  {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                  <div className="flex gap-3 pt-1">
                    <button onClick={close} className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/8 transition text-sm font-semibold">{t.cancel}</button>
                    <button onClick={goToPayment} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-red-700 to-red-500 font-bold text-sm hover:opacity-90 transition">{t.next} →</button>
                  </div>
                </>
              )}

              {/* ── STEP 2: Payment Method ───────────────────────────── */}
              {step === 'payment-method' && (
                <>
                  <p className="text-white/40 text-xs">{t.chooseMethod}</p>

                  <div className="space-y-2">
                    {(['receipt', 'instapay', 'wallet'] as PayMethod[]).map(m => (
                      <button
                        key={m}
                        onClick={() => { setPayMethod(m); setWalletType(''); }}
                        className={`w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left ${
                          payMethod === m
                            ? 'bg-red-950/40 border-red-600/50 shadow-[0_0_15px_rgba(220,38,38,0.15)]'
                            : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                        }`}
                      >
                        <span className="text-2xl">{m === 'receipt' ? '🧾' : m === 'instapay' ? '📲' : '📱'}</span>
                        <div>
                          <div className={`font-bold text-sm ${payMethod === m ? 'text-red-400' : 'text-white/80'}`}>
                            {(t as any)[m]}
                          </div>
                          <div className="text-white/30 text-xs mt-0.5">
                            {m === 'receipt' ? (lang === 'ar' ? 'ادفع في الأكاديمية وارفع الإيصال' : 'Pay at academy, upload receipt')
                              : m === 'instapay' ? 'active.academy@instapay'
                              : lang === 'ar' ? 'فودافون كاش، أورنج موني، إلخ' : 'Vodafone Cash, Orange Money, etc.'}
                          </div>
                        </div>
                        {payMethod === m && <span className="mr-auto text-red-500 font-black">✓</span>}
                      </button>
                    ))}
                  </div>

                  {/* Wallet sub-options */}
                  {payMethod === 'wallet' && (
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {(['vodafone', 'orange', 'etisalat', 'we'] as WalletType[]).map(w => (
                        <button
                          key={w}
                          onClick={() => setWalletType(w)}
                          className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                            walletType === w
                              ? 'bg-red-950/40 border-red-600/50 text-red-400'
                              : 'bg-white/[0.02] border-white/10 text-white/50 hover:border-white/20'
                          }`}
                        >
                          {w === 'vodafone' ? '📱 Vodafone' : w === 'orange' ? '🟠 Orange' : w === 'etisalat' ? '💚 Etisalat' : '📲 WE Pay'}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Instructions box */}
                  {payMethod && (
                    <div className="bg-red-950/10 border border-red-900/20 rounded-xl p-3 text-xs text-white/60 leading-relaxed whitespace-pre-line">
                      <span className="text-red-400 font-bold block mb-1">{t.instructions}:</span>
                      {(PAYMENT_INSTRUCTIONS[payMethod] as any)[lang]}
                      {payMethod === 'wallet' && walletType && (
                        <div className="mt-1 text-white/40">{WALLET_NUMBERS[walletType]}</div>
                      )}
                    </div>
                  )}

                  {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                  <div className="flex gap-3 pt-1">
                    <button onClick={() => setStep('info')} className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/8 transition text-sm font-semibold">← {t.back}</button>
                    <button onClick={goToUpload} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-red-700 to-red-500 font-bold text-sm hover:opacity-90 transition">{t.next} →</button>
                  </div>
                </>
              )}

              {/* ── STEP 3: Upload Proof ─────────────────────────────── */}
              {step === 'upload-proof' && (
                <>
                  {/* Summary */}
                  <div className="bg-white/[0.03] border border-white/10 rounded-xl p-3 space-y-1.5 text-xs">
                    <div className="flex justify-between"><span className="text-white/40">{t.activity}</span><span className="font-bold text-white">{activity.name}</span></div>
                    <div className="flex justify-between"><span className="text-white/40">{t.name}</span><span className="text-white">{userInfo.fullName}</span></div>
                    <div className="flex justify-between"><span className="text-white/40">{t.method}</span>
                      <span className="text-red-400 font-bold capitalize">{payMethod}{walletType ? ` (${walletType})` : ''}</span>
                    </div>
                    <div className="flex justify-between border-t border-white/5 pt-1.5 mt-1"><span className="text-white/40">{t.priceNote}</span><span className="text-yellow-400 font-bold">⏳</span></div>
                  </div>

                  <div>
                    <label className="text-white/40 text-xs font-semibold block mb-2">{t.uploadProof} <span className="text-red-500">*</span></label>
                    <div
                      onDragOver={e => { e.preventDefault(); setDragging(true); }}
                      onDragLeave={() => setDragging(false)}
                      onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
                      onClick={() => fileRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200
                        ${dragging ? 'border-red-500 bg-red-950/20 scale-[1.01]' : proofFile ? 'border-green-600/50 bg-green-950/10' : 'border-white/10 hover:border-red-800/50'}`}
                    >
                      <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.webp,.pdf" className="hidden" onChange={e => handleFile(e.target.files?.[0] || null)} />
                      {proofFile ? (
                        <div>
                          <div className="text-3xl mb-2">✅</div>
                          <p className="text-green-400 font-bold text-sm">{proofFile.name}</p>
                          <p className="text-white/30 text-xs mt-1">{(proofFile.size / 1024).toFixed(0)} KB</p>
                          <button onClick={e => { e.stopPropagation(); setProofFile(null); }} className="mt-2 text-white/30 hover:text-red-400 text-xs transition">✕ {lang === 'ar' ? 'إزالة' : 'Remove'}</button>
                        </div>
                      ) : (
                        <div>
                          <div className="text-3xl mb-2">📎</div>
                          <p className="text-white/50 text-sm font-semibold mb-1">{t.dragHere}</p>
                          <p className="text-white/25 text-xs">{t.uploadFormats}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {error && <p className="text-red-400 text-sm text-center bg-red-950/20 rounded-lg p-2">{error}</p>}

                  <div className="flex gap-3 pt-1">
                    <button onClick={() => setStep('payment-method')} className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/8 transition text-sm font-semibold">← {t.back}</button>
                    <button
                      onClick={handleSubmit}
                      disabled={submitting || !proofFile}
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-red-700 to-red-500 font-black text-sm hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                    >
                      {submitting ? <><span className="animate-spin">⟳</span> {t.submitting}</> : t.submit}
                    </button>
                  </div>
                </>
              )}

              {/* ── DONE ─────────────────────────────────────────────── */}
              {step === 'done' && (
                <div className="text-center py-4">
                  <div className="text-5xl mb-4">🎉</div>
                  <h4 className="text-xl font-black text-white mb-3">{t.successTitle}</h4>
                  <p className="text-white/50 text-sm leading-relaxed mb-6">{t.successBody}</p>
                  <div className="bg-yellow-950/20 border border-yellow-800/30 rounded-xl p-3 mb-6">
                    <span className="text-yellow-400 text-xs font-bold">⏳ {lang === 'ar' ? 'قيد المراجعة' : 'Under Review'}</span>
                    <p className="text-white/40 text-xs mt-1">{lang === 'ar' ? 'رقم الحجز: ' : 'Booking ID: '}<span className="font-mono text-white/60">{createdBookingId}</span></p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={close} className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/8 transition text-sm">{t.close}</button>
                    <a href={`/${lang}/my-bookings`} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-red-700 to-red-500 font-bold text-sm hover:opacity-90 transition text-center block">{t.viewBookings}</a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
