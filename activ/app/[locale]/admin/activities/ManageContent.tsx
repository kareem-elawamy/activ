'use client';

import { useState, useEffect } from 'react';
import api from '@/utils/api';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';

type Activity = {
  _id: string; name: string; coach: string; category: string;
  date: string; time: string; capacity: number; duration: number;
  location: string; image: string; price?: string;
  ageRange?: string; description?: string;
};

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-4 h-4">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const EditIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-3.5 h-3.5">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-3.5 h-3.5">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
);
const SaveIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
    <polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
  </svg>
);

export default function AdminManageActivities() {
  const t = useTranslations('adminPanel.sports');
  const [saving, setSaving] = useState(false);

  const [name, setName]               = useState('');
  const [coach, setCoach]             = useState('');
  const [category, setCategory]       = useState('rehab');
  const [date, setDate]               = useState('');
  const [time, setTime]               = useState('');
  const [capacity, setCapacity]       = useState<number>(10);
  const [duration, setDuration]       = useState<number>(60);
  const [location, setLocation]       = useState('');
  const [price, setPrice]             = useState('');
  const [ageRange, setAgeRange]       = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage]             = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [activities, setActivities]   = useState<Activity[]>([]);
  const [editId, setEditId]           = useState<string | null>(null);

  const categories = [
    { id: 'rehab',        name: 'Motor Rehabilitation / تأهيل حركى' },
    { id: 'bodybuilding', name: 'Bodybuilding / كمال اجسام' },
    { id: 'gymnastics',   name: 'Gymnastics / جمباز' },
    { id: 'taekwondo',    name: 'Taekwondo / تايكوندو' },
    { id: 'swimming',     name: 'Swimming / سباحة' },
  ];

  useEffect(() => {
    (async () => {
      try { const res = await api.get('/workout'); setActivities(res.data); }
      catch { toast.error(t('fetchError')); }
    })();
  }, [t]);

  const resetForm = () => {
    setName(''); setCoach(''); setCategory('rehab'); setDate(''); setTime('');
    setCapacity(10); setDuration(60); setLocation(''); setPrice(''); setAgeRange('');
    setDescription(''); setImage(null); setImagePreview(null); setEditId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let imageUrl = '';
    setSaving(true);
    const loadingToast = toast.loading(t('savingActivity'));
    if (image) {
      const formData = new FormData();
      formData.append('file', image);
      try {
        const token = localStorage.getItem('token');
        const uploadRes = await fetch('/api/upload', {
          method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: formData,
        });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) {
          throw new Error(uploadData.message || 'Upload Failed');
        }
        imageUrl = uploadData.url;
      } catch (err: any) {
        toast.error(`${t('uploadFailed')}: ${err.message}`, { id: loadingToast });
        setSaving(false);
        return;
      }
    } else if (editId) {
      imageUrl = activities.find(a => a._id === editId)?.image || '';
    }
    const payload = { name, coach, category, date, time, capacity, duration, location, image: imageUrl, price: Number(price) || undefined, ageRange, description };
    try {
      if (editId) {
        const res = await api.put(`/workout/${editId}`, payload);
        setActivities(activities.map(act => act._id === editId ? res.data.workout : act));
        toast.success(t('updateSuccess'), { id: loadingToast });
      } else {
        const res = await api.post(`/workout`, payload);
        setActivities([...activities, res.data]);
        toast.success(t('addSuccess'), { id: loadingToast });
      }
      resetForm();
    } catch (err: any) {
      toast.error(err.response?.data?.message || t('saveError'), { id: loadingToast });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (act: Activity) => {
    setName(act.name); setCoach(act.coach); setCategory(act.category);
    setDate(act.date); setTime(act.time); setCapacity(act.capacity);
    setDuration(act.duration || 60); setLocation(act.location);
    setPrice(act.price || ''); setAgeRange(act.ageRange || '');
    setDescription(act.description || ''); setImage(null); setImagePreview(act.image || null); setEditId(act._id);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('deleteConfirm'))) return;
    try {
      await api.delete(`/workout/${id}`);
      setActivities(activities.filter(a => a._id !== id));
      toast.success(t('deleteSuccess'));
    } catch { toast.error(t('deleteError')); }
  };

  const InputCls = "w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:border-red-500/50 focus:outline-none transition placeholder:text-white/20";

  return (
    <div className="flex flex-col xl:flex-row gap-6">

      {/* ── Form ─────────────────────────────────────── */}
      <div className="xl:w-[380px] flex-shrink-0">
        <div className="bg-[#0f0f0f] border border-white/[0.06] rounded-2xl overflow-hidden">
          {/* Form header */}
          <div className="px-5 py-4 border-b border-white/[0.06] flex items-center gap-3">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${editId ? 'bg-amber-600/20 text-amber-400' : 'bg-red-600/20 text-red-400'}`}>
              {editId ? <EditIcon /> : <PlusIcon />}
            </div>
            <h3 className="text-sm font-black text-white">
              {editId ? t('editActivity') : t('addActivity')}
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="p-5 space-y-3">
            {[
              { val: name,     set: setName,     label: t('activityName') + ' *', type: 'text',   required: true },
              { val: coach,    set: setCoach,    label: t('coach') + ' *',        type: 'text',   required: true },
              { val: location, set: setLocation, label: t('location'),             type: 'text',   required: false },
            ].map(f => (
              <div key={f.label}>
                <label className="text-white/30 text-[10px] font-bold uppercase tracking-widest block mb-1.5">{f.label}</label>
                <input type={f.type} value={f.val} onChange={e => f.set(e.target.value)} required={f.required} className={InputCls} />
              </div>
            ))}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-white/30 text-[10px] font-bold uppercase tracking-widest block mb-1.5">{t('category')}</label>
                <select value={category} onChange={e => setCategory(e.target.value)}
                  className={`${InputCls} [&>option]:bg-[#0f0f0f]`}>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-white/30 text-[10px] font-bold uppercase tracking-widest block mb-1.5">{t('capacity')}</label>
                <input type="number" value={capacity} onChange={e => setCapacity(Number(e.target.value))} className={InputCls} />
              </div>
              <div>
                <label className="text-white/30 text-[10px] font-bold uppercase tracking-widest block mb-1.5">{t('duration')}</label>
                <input type="number" placeholder="60" value={duration} onChange={e => setDuration(Number(e.target.value))} className={InputCls} />
              </div>
              <div>
                <label className="text-white/30 text-[10px] font-bold uppercase tracking-widest block mb-1.5">{t('date')}</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} className={`${InputCls} dark:[color-scheme:dark]`} />
              </div>
              <div>
                <label className="text-white/30 text-[10px] font-bold uppercase tracking-widest block mb-1.5">{t('time')}</label>
                <input type="time" value={time} onChange={e => setTime(e.target.value)} className={`${InputCls} dark:[color-scheme:dark]`} />
              </div>
              <div>
                <label className="text-white/30 text-[10px] font-bold uppercase tracking-widest block mb-1.5">{t('price')}</label>
                <input type="number" placeholder="—" value={price} onChange={e => setPrice(e.target.value)} className={InputCls} dir="ltr" />
              </div>
              <div className="col-span-2">
                <label className="text-white/30 text-[10px] font-bold uppercase tracking-widest block mb-1.5">{t('ageRange')}</label>
                <input type="text" placeholder="6-12" value={ageRange} onChange={e => setAgeRange(e.target.value)} className={InputCls} dir="ltr" />
              </div>
            </div>

            <div>
              <label className="text-white/30 text-[10px] font-bold uppercase tracking-widest block mb-1.5">{t('description')}</label>
              <textarea rows={2} value={description} onChange={e => setDescription(e.target.value)} className={`${InputCls} resize-none`} />
            </div>

            <div>
              <label className="text-white/30 text-[10px] font-bold uppercase tracking-widest block mb-1.5">{t('image')}</label>
              {imagePreview && (
                <div className="relative w-full h-32 rounded-xl overflow-hidden border border-white/10 mb-3 group">
                  <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => { setImage(null); setImagePreview(null); }}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/70 text-white/80 flex items-center justify-center text-[10px] hover:bg-red-600 transition opacity-0 group-hover:opacity-100">
                    ✕
                  </button>
                </div>
              )}
              <label className="flex items-center gap-2 w-full py-2.5 px-3 rounded-xl bg-white/[0.04] border border-dashed border-white/[0.12] text-white/30 text-xs cursor-pointer hover:border-red-500/40 hover:text-white/50 transition">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4 flex-shrink-0">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
                <span className="truncate">{image ? image.name : t('image')}</span>
                <input type="file" accept="image/*" className="hidden" 
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setImage(file);
                      setImagePreview(URL.createObjectURL(file));
                    }
                  }} 
                />
              </label>
            </div>

            <div className="flex gap-3 pt-1">
              {editId && (
                <button type="button" onClick={resetForm}
                  className="flex-1 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/50 text-sm font-semibold hover:bg-white/[0.07] transition">
                  {t('cancel')}
                </button>
              )}
              <button type="submit"
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-red-700 to-red-500 text-white font-black text-sm hover:opacity-90 transition flex items-center justify-center gap-2 shadow-lg shadow-red-900/20">
                <SaveIcon />
                {editId ? t('save') : t('add')}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ── Activities List ──────────────────────────── */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-white/40 text-xs font-bold uppercase tracking-widest">{t('currentActivities')} ({activities.length})</h4>
        </div>

        {activities.length === 0 && (
          <div className="text-center py-16 border border-dashed border-white/[0.06] rounded-2xl">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10 mx-auto mb-3 text-white/10">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
            <p className="text-white/20 text-sm">{t('noActivities')}</p>
          </div>
        )}

        <div className="space-y-2 overflow-y-auto max-h-[75vh] pr-1">
          {activities.map(act => (
            <div key={act._id}
              className={`bg-[#0f0f0f] border rounded-xl p-4 hover:border-white/[0.10] transition-all duration-200 ${
                editId === act._id ? 'border-amber-700/30 bg-amber-950/10' : 'border-white/[0.06]'
              }`}>
              <div className="flex items-start gap-4">
                {/* Activity image */}
                {act.image && (
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/[0.05] flex-shrink-0 border border-white/[0.06]">
                    <img src={act.image} alt={act.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-bold text-white/80 text-sm truncate">{act.name}</p>
                      <p className="text-white/30 text-xs mt-0.5">
                        {act.coach} · <span className="capitalize">{act.category}</span>
                        {act.price ? ` · ${act.price} EGP` : ` · ${t('priceUndetermined')}`}
                      </p>
                      {(act.date || act.time) && (
                        <p className="text-white/20 text-[11px] mt-1">{act.date} {act.time}</p>
                      )}
                    </div>
                    <div className="flex gap-1.5 flex-shrink-0">
                      <button onClick={() => handleEdit(act)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-900/20 text-amber-400 hover:bg-amber-700/30 border border-amber-800/20 text-xs font-bold transition">
                        <EditIcon /> {t('edit')}
                      </button>
                      <button onClick={() => handleDelete(act._id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-900/20 text-red-400 hover:bg-red-700/30 border border-red-800/20 text-xs font-bold transition">
                        <TrashIcon /> {t('delete')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
