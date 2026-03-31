'use client';

import { useState, useEffect } from 'react';

type Activity = {
  _id: string;
  name: string;
  coach: string;
  category: string;
  date: string;
  time: string;
  capacity: number;
  location: string;
  image: string;
  price?: string;      // NEW
  ageRange?: string;   // NEW
  description?: string; // NEW
};

export default function AdminManageActivities() {
  const [name, setName] = useState('');
  const [coach, setCoach] = useState('');
  const [category, setCategory] = useState('kung-fu');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [capacity, setCapacity] = useState<number>(10);
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [ageRange, setAgeRange] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [msg, setMsg] = useState('');

  const categories = [
    { id: 'kung-fu', name: 'Kung Fu / كونغ فو' },
    { id: 'swimming', name: 'Swimming / سباحة' },
    { id: 'gymnastics', name: 'Gymnastics / جمباز' },
  ];

  useEffect(() => {
    const stored = localStorage.getItem('activities');
    if (stored) setActivities(JSON.parse(stored));
  }, []);

  const saveActivities = (list: Activity[]) => {
    setActivities(list);
    localStorage.setItem('activities', JSON.stringify(list));
  };

  const resetForm = () => {
    setName(''); setCoach(''); setCategory('kung-fu'); setDate(''); setTime('');
    setCapacity(10); setLocation(''); setPrice(''); setAgeRange('');
    setDescription(''); setImage(null); setEditId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let imageUrl = '';
    if (image) {
      imageUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
      });
    } else if (editId) {
      imageUrl = activities.find(a => a._id === editId)?.image || '';
    }

    const payload = { name, coach, category, date, time, capacity, location, image: imageUrl, price, ageRange, description };

    if (editId) {
      saveActivities(activities.map(act => act._id === editId ? { ...act, ...payload } : act));
      setMsg('✅ تم تحديث النشاط');
    } else {
      const newActivity: Activity = { _id: Date.now().toString(), ...payload };
      saveActivities([...activities, newActivity]);
      setMsg('✅ تم إضافة النشاط');
    }
    resetForm();
    setTimeout(() => setMsg(''), 3000);
  };

  const handleEdit = (act: Activity) => {
    setName(act.name); setCoach(act.coach); setCategory(act.category);
    setDate(act.date); setTime(act.time); setCapacity(act.capacity);
    setLocation(act.location); setPrice(act.price || ''); setAgeRange(act.ageRange || '');
    setDescription(act.description || ''); setImage(null); setEditId(act._id);
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من الحذف؟')) saveActivities(activities.filter(a => a._id !== id));
  };

  return (
    <div className="flex gap-6" dir="rtl">
      {/* Form */}
      <div className="flex-1 bg-black/60 border border-red-900/30 rounded-2xl p-6 text-white">
        <h3 className="text-lg font-black text-red-400 mb-4">{editId ? '✏️ تعديل نشاط' : '➕ إضافة نشاط جديد'}</h3>

        <form onSubmit={handleSubmit} className="space-y-3">
          {[
            { val: name, set: setName, label: 'اسم النشاط *', type: 'text', required: true },
            { val: coach, set: setCoach, label: 'المدرب *', type: 'text', required: true },
            { val: location, set: setLocation, label: 'الموقع', type: 'text', required: false },
          ].map(f => (
            <div key={f.label}>
              <label className="text-white/40 text-xs block mb-1">{f.label}</label>
              <input type={f.type} value={f.val} onChange={e => f.set(e.target.value)} required={f.required}
                className="w-full p-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm focus:border-red-500 focus:outline-none transition" />
            </div>
          ))}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-white/40 text-xs block mb-1">الفئة</label>
              <select value={category} onChange={e => setCategory(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm focus:outline-none">
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-white/40 text-xs block mb-1">السعة</label>
              <input type="number" value={capacity} onChange={e => setCapacity(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm focus:outline-none" />
            </div>
            <div>
              <label className="text-white/40 text-xs block mb-1">التاريخ</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm focus:outline-none" />
            </div>
            <div>
              <label className="text-white/40 text-xs block mb-1">الوقت</label>
              <input type="time" value={time} onChange={e => setTime(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm focus:outline-none" />
            </div>
            {/* NEW: Price */}
            <div>
              <label className="text-white/40 text-xs block mb-1">السعر (ج.م) — اختياري</label>
              <input type="number" placeholder="يُحدَّد لاحقاً" value={price} onChange={e => setPrice(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm focus:outline-none" dir="ltr" />
            </div>
            {/* NEW: Age Range */}
            <div>
              <label className="text-white/40 text-xs block mb-1">الفئة العمرية</label>
              <input type="text" placeholder="مثال: 6-12" value={ageRange} onChange={e => setAgeRange(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm focus:outline-none" dir="ltr" />
            </div>
          </div>

          {/* NEW: Description */}
          <div>
            <label className="text-white/40 text-xs block mb-1">وصف النشاط</label>
            <textarea rows={2} value={description} onChange={e => setDescription(e.target.value)} placeholder="وصف قصير..."
              className="w-full p-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm focus:outline-none resize-none" />
          </div>

          <div>
            <label className="text-white/40 text-xs block mb-1">صورة النشاط</label>
            <input type="file" accept="image/*" onChange={e => setImage(e.target.files?.[0] || null)}
              className="text-white/50 text-xs" />
          </div>

          {msg && <p className="text-green-400 text-sm font-bold">{msg}</p>}

          <div className="flex gap-3 pt-1">
            {editId && (
              <button type="button" onClick={resetForm}
                className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-semibold hover:bg-white/8 transition">
                إلغاء
              </button>
            )}
            <button type="submit"
              className="flex-1 py-2.5 bg-gradient-to-r from-red-700 to-red-500 rounded-xl font-black text-sm hover:opacity-90 transition">
              {editId ? '💾 حفظ التعديلات' : '➕ إضافة'}
            </button>
          </div>
        </form>
      </div>

      {/* List */}
      <div className="flex-1 space-y-2 overflow-y-auto max-h-[75vh]">
        <h4 className="text-red-400 font-black mb-3 text-white/60 text-sm">الأنشطة الحالية ({activities.length})</h4>
        {activities.length === 0 && <p className="text-white/25 text-sm">لا توجد أنشطة بعد</p>}
        {activities.map(act => (
          <div key={act._id} className="bg-black/60 border border-white/8 rounded-xl p-4 hover:border-red-900/40 transition">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="font-bold text-white text-sm">{act.name}</div>
                <div className="text-white/40 text-xs mt-0.5">
                  {act.coach} · {act.category} {act.price ? `· ${act.price} ج.م` : '· السعر غير محدد'}
                </div>
                {act.date && <div className="text-white/25 text-xs mt-0.5">{act.date} {act.time}</div>}
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => handleEdit(act)} className="px-3 py-1 bg-yellow-700/50 hover:bg-yellow-700 text-white rounded-lg text-xs transition">تعديل</button>
                <button onClick={() => handleDelete(act._id)} className="px-3 py-1 bg-red-700/50 hover:bg-red-700 text-white rounded-lg text-xs transition">حذف</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
