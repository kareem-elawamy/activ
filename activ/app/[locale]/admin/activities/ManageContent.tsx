'use client';

import { useState, useEffect } from 'react';
import api from '@/utils/api';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';

type Activity = {
  _id: string;
  name: string;
  coach: string;
  category: string;
  date: string;
  time: string;
  capacity: number;
  duration: number;
  location: string;
  image: string;
  price?: string;      
  ageRange?: string;   
  description?: string; 
};

export default function AdminManageActivities() {
  const t = useTranslations('adminPanel.sports');
  const [name, setName] = useState('');
  const [coach, setCoach] = useState('');
  const [category, setCategory] = useState('kung-fu');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [capacity, setCapacity] = useState<number>(10);
  const [duration, setDuration] = useState<number>(60);
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [ageRange, setAgeRange] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [editId, setEditId] = useState<string | null>(null);

  const categories = [
    { id: 'kung-fu', name: 'Kung Fu / كونغ فو' },
    { id: 'swimming', name: 'Swimming / سباحة' },
    { id: 'gymnastics', name: 'Gymnastics / جمباز' },
  ];

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await api.get('/workout');
        setActivities(res.data);
      } catch (err) {
        console.error("Failed to fetch activities:", err);
        toast.error(t('fetchError'));
      }
    };
    fetchActivities();
  }, [t]);

  const resetForm = () => {
    setName(''); setCoach(''); setCategory('kung-fu'); setDate(''); setTime('');
    setCapacity(10); setDuration(60); setLocation(''); setPrice(''); setAgeRange('');
    setDescription(''); setImage(null); setEditId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let imageUrl = '';
    const loadingToast = toast.loading(t('savingActivity'));

    if (image) {
      const formData = new FormData();
      formData.append('file', image);
      try {
        const token = localStorage.getItem('token');
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData
        });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error('Upload Failed');
        imageUrl = uploadData.url;
      } catch (err) {
        console.error("Upload error:", err);
        toast.error(`❌ ${t('uploadFailed')}`, { id: loadingToast });
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
        toast.success(`✅ ${t('updateSuccess')}`, { id: loadingToast });
      } else {
        const res = await api.post(`/workout`, payload);
        setActivities([...activities, res.data]);
        toast.success(`✅ ${t('addSuccess')}`, { id: loadingToast });
      }
      resetForm();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || `❌ ${t('saveError')}`, { id: loadingToast });
    }
  };

  const handleEdit = (act: Activity) => {
    setName(act.name); setCoach(act.coach); setCategory(act.category);
    setDate(act.date); setTime(act.time); setCapacity(act.capacity);
    setDuration(act.duration || 60); setLocation(act.location); setPrice(act.price || ''); setAgeRange(act.ageRange || '');
    setDescription(act.description || ''); setImage(null); setEditId(act._id);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t('deleteConfirm'))) {
      try {
        await api.delete(`/workout/${id}`);
        setActivities(activities.filter(a => a._id !== id));
        toast.success(`✅ ${t('deleteSuccess')}`);
      } catch (err: any) {
        console.error(err);
        toast.error(`❌ ${t('deleteError')}`);
      }
    }
  };

  return (
    <div className="flex flex-col xl:flex-row gap-6">
      {/* Form */}
      <div className="flex-1 bg-black/60 border border-red-900/30 rounded-2xl p-6 text-white min-w-[300px]">
        <h3 className="text-lg font-black text-red-400 mb-4">{editId ? `✏️ ${t('editActivity')}` : `➕ ${t('addActivity')}`}</h3>

        <form onSubmit={handleSubmit} className="space-y-3">
          {[
            { val: name, set: setName, label: t('activityName') + ' *', type: 'text', required: true },
            { val: coach, set: setCoach, label: t('coach') + ' *', type: 'text', required: true },
            { val: location, set: setLocation, label: t('location'), type: 'text', required: false },
          ].map(f => (
            <div key={f.label}>
              <label className="text-white/40 text-xs block mb-1">{f.label}</label>
              <input type={f.type} value={f.val} onChange={e => f.set(e.target.value)} required={f.required}
                className="w-full p-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm focus:border-red-500 focus:outline-none transition" />
            </div>
          ))}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-white/40 text-xs block mb-1">{t('category')}</label>
              <select value={category} onChange={e => setCategory(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm focus:outline-none [&>option]:bg-black">
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-white/40 text-xs block mb-1">{t('capacity')}</label>
              <input type="number" value={capacity} onChange={e => setCapacity(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm focus:outline-none" />
            </div>
            <div>
              <label className="text-white/40 text-xs block mb-1">{t('duration')}</label>
              <input type="number" placeholder="60" value={duration} onChange={e => setDuration(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm focus:outline-none" />
            </div>
            <div>
              <label className="text-white/40 text-xs block mb-1">{t('date')}</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm focus:outline-none dark:[color-scheme:dark]" />
            </div>
            <div>
              <label className="text-white/40 text-xs block mb-1">{t('time')}</label>
              <input type="time" value={time} onChange={e => setTime(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm focus:outline-none dark:[color-scheme:dark]" />
            </div>
            <div>
              <label className="text-white/40 text-xs block mb-1">{t('price')}</label>
              <input type="number" placeholder="---" value={price} onChange={e => setPrice(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm focus:outline-none" dir="ltr" />
            </div>
            <div>
              <label className="text-white/40 text-xs block mb-1">{t('ageRange')}</label>
              <input type="text" placeholder="6-12" value={ageRange} onChange={e => setAgeRange(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm focus:outline-none" dir="ltr" />
            </div>
          </div>

          <div>
            <label className="text-white/40 text-xs block mb-1">{t('description')}</label>
            <textarea rows={2} value={description} onChange={e => setDescription(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm focus:outline-none resize-none" />
          </div>

          <div>
            <label className="text-white/40 text-xs block mb-1">{t('image')}</label>
            <input type="file" accept="image/*" onChange={e => setImage(e.target.files?.[0] || null)}
              className="text-white/50 text-xs w-full file:bg-white/10 file:text-white file:border-0 file:rounded-xl file:px-3 file:py-1.5 file:mr-3 file:font-semibold" />
          </div>

          <div className="flex gap-3 pt-1">
            {editId && (
              <button type="button" onClick={resetForm}
                className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-semibold hover:bg-white/8 transition">
                {t('cancel')}
              </button>
            )}
            <button type="submit"
              className="flex-1 py-2.5 bg-gradient-to-r from-red-700 to-red-500 rounded-xl font-black text-sm hover:opacity-90 transition">
              {editId ? `💾 ${t('save')}` : `➕ ${t('add')}`}
            </button>
          </div>
        </form>
      </div>

      {/* List */}
      <div className="flex-1 space-y-2 overflow-y-auto max-h-[85vh] pr-2 xl:pr-4">
        <h4 className="text-red-400 font-black mb-3 text-white/60 text-sm">{t('currentActivities')} ({activities.length})</h4>
        {activities.length === 0 && <p className="text-white/25 text-sm">{t('noActivities')}</p>}
        {activities.map(act => (
          <div key={act._id} className="bg-black/60 border border-white/8 rounded-xl p-4 hover:border-red-900/40 transition">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="font-bold text-white text-sm">{act.name}</div>
                <div className="text-white/40 text-xs mt-0.5">
                  {act.coach} · {act.category} {act.price ? `· ${act.price}` : `· ${t('priceUndetermined')}`}
                </div>
                {(act.date || act.time) && <div className="text-white/25 text-[11px] mt-1">{act.date} {act.time}</div>}
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => handleEdit(act)} className="px-3 py-1.5 bg-yellow-700/20 text-yellow-400 hover:bg-yellow-700/40 hover:text-white border border-yellow-700/30 rounded-lg text-xs font-bold transition">✏️ {t('edit')}</button>
                <button onClick={() => handleDelete(act._id)} className="px-3 py-1.5 bg-red-700/20 text-red-400 hover:bg-red-700/40 hover:text-white border border-red-700/30 rounded-lg text-xs font-bold transition">🗑️ {t('delete')}</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
