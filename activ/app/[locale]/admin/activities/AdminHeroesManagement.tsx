'use client';

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import api from "@/utils/api";
import toast from "react-hot-toast";
import Image from "next/image";
import { Trophy, Plus, Edit2, Trash2, Camera, Save, Loader2, X, Medal } from 'lucide-react';

type Hero = {
  _id: string;
  name: string;
  sport?: string;
  bio?: string;
  image?: string;
  championships: string[];
};

type Props = {
  lang?: "en" | "ar";
};

const EMPTY_FORM = {
  name: "",
  sport: "",
  bio: "",
  image: "",
};

export default function AdminHeroesManagement({ lang = "en" }: Props) {
  const t = useTranslations('adminPanel.heroes');

  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingHero, setEditingHero] = useState<Hero | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<any>({ ...EMPTY_FORM });
  const [championships, setChampionships] = useState<string[]>([""]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    fetchHeroes();
  }, []);

  const fetchHeroes = async () => {
    setLoading(true);
    try {
      const res = await api.get('/heroes');
      setHeroes(res.data);
    } catch (err) {
      console.error(err);
      toast.error(t('saveError'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('deleteConfirm'))) return;
    try {
      await api.delete(`/heroes/${id}`);
      setHeroes(heroes.filter(h => h._id !== id));
      toast.success(t('deleteSuccess'));
    } catch (err) {
      toast.error(t('deleteError'));
    }
  };

  const handleEdit = (hero: Hero) => {
    setEditingHero(hero);
    setFormData({
      name: hero.name || "",
      sport: hero.sport || "",
      bio: hero.bio || "",
      image: hero.image || "",
    });
    setChampionships(hero.championships?.length ? hero.championships : [""]);
    setImageFile(null);
    setImagePreview(hero.image || null);
    setShowModal(true);
  };

  const openAddModal = () => {
    setEditingHero(null);
    setFormData({ ...EMPTY_FORM });
    setChampionships([""]);
    setImageFile(null);
    setImagePreview(null);
    setShowModal(true);
  };

  const handleImageSelect = (file: File | null) => {
    setImageFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    } else {
      setImagePreview(formData.image || null);
    }
  };

  /* Championship dynamic list helpers */
  const addChampionship = () => setChampionships(prev => [...prev, ""]);
  const removeChampionship = (idx: number) => {
    if (championships.length === 1) return;
    setChampionships(prev => prev.filter((_, i) => i !== idx));
  };
  const updateChampionship = (idx: number, value: string) => {
    setChampionships(prev => prev.map((c, i) => (i === idx ? value : c)));
  };

  const handleSave = async () => {
    if (!formData.name.trim()) return;
    setSaving(true);

    let imageUrl = formData.image;

    if (imageFile) {
      try {
        const fd = new FormData();
        fd.append('file', imageFile);
        const token = localStorage.getItem('token');
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: fd
        });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error('Upload failed');
        imageUrl = uploadData.url;
      } catch (err) {
        toast.error(`❌ ${t('saveError')}`);
        setSaving(false);
        return;
      }
    }

    const filtered = championships.filter(c => c.trim() !== "");

    const payload = {
      name: formData.name,
      sport: formData.sport,
      bio: formData.bio,
      image: imageUrl,
      championships: filtered,
    };

    try {
      if (editingHero) {
        const res = await api.put(`/heroes/${editingHero._id}`, payload);
        setHeroes(heroes.map(h => h._id === editingHero._id ? res.data.hero : h));
      } else {
        const res = await api.post('/heroes', payload);
        setHeroes([res.data, ...heroes]);
      }
      toast.success(t('saveSuccess'));
      setShowModal(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || t('saveError'));
    } finally {
      setSaving(false);
    }
  };

  const updateField = (key: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-black border border-yellow-900/30 rounded-2xl h-80 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-white">{t('title')}</h2>
          <p className="text-white/40 text-sm mt-1">{t('subtitle')}</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-5 py-2.5 bg-gradient-to-r from-yellow-600 to-amber-500 rounded-xl font-bold text-sm hover:opacity-90 transition shadow-lg text-black"
        >
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> {t('addHero')}
          </div>
        </button>
      </div>

      {/* Heroes Grid */}
      {heroes.length === 0 ? (
        <div className="text-center py-20">
          <div className="flex justify-center mb-4"><Trophy className="w-12 h-12 text-white/20" /></div>
          <h3 className="text-xl font-bold text-white">{t('noHeroes')}</h3>
          <p className="text-white/40 mt-2">{t('noHeroesDesc')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {heroes.map((hero) => (
            <div
              key={hero._id}
              className="bg-[#0d0d0d] border border-yellow-900/30 rounded-2xl overflow-hidden hover:border-yellow-500/50 transition-all duration-300 group"
            >
              {/* Image */}
              <div className="relative h-52 bg-gradient-to-br from-yellow-950/30 to-black">
                {hero.image ? (
                  <Image src={hero.image} alt={hero.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="flex items-center justify-center h-full opacity-20">
                    <Trophy className="w-20 h-20 text-yellow-400" />
                  </div>
                )}
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                {/* Sport badge */}
                {hero.sport && (
                  <div className="absolute top-3 right-3 px-3 py-1 bg-yellow-500/90 rounded-full text-black text-xs font-black">
                    {hero.sport}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-5">
                <h3 className="text-lg font-black text-white mb-1">{hero.name}</h3>
                {hero.bio && <p className="text-white/40 text-xs mb-3 line-clamp-2">{hero.bio}</p>}

                {/* Championships */}
                {hero.championships?.length > 0 && (
                  <div className="mb-4 space-y-1.5">
                    <p className="text-yellow-500/70 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                      <Medal className="w-3 h-3" /> {t('championships')} ({hero.championships.length})
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {hero.championships.slice(0, 3).map((c, i) => (
                        <span key={i} className="px-2 py-0.5 bg-yellow-900/30 border border-yellow-700/30 text-yellow-300/80 text-[10px] font-semibold rounded-full">
                          {c}
                        </span>
                      ))}
                      {hero.championships.length > 3 && (
                        <span className="px-2 py-0.5 bg-white/5 text-white/30 text-[10px] font-semibold rounded-full">
                          +{hero.championships.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 mt-3">
                  <button onClick={() => handleEdit(hero)} className="flex-1 py-2 bg-yellow-700/30 hover:bg-yellow-600/60 border border-yellow-700/30 hover:border-yellow-500/50 rounded-lg text-xs font-bold text-yellow-300 transition flex items-center justify-center gap-1">
                    <Edit2 className="w-3.5 h-3.5" /> {t('edit')}
                  </button>
                  <button onClick={() => handleDelete(hero._id)} className="flex-1 py-2 bg-red-700/30 hover:bg-red-700/60 border border-red-700/30 hover:border-red-500/50 rounded-lg text-xs font-bold text-red-400 transition flex items-center justify-center gap-1">
                    <Trash2 className="w-3.5 h-3.5" /> {t('delete')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-[#0a0a0a] border border-yellow-900/30 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">

            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                {editingHero ? t('editHero') : t('addHero')}
              </h3>
              <button onClick={() => setShowModal(false)} className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="text-white/40 text-xs font-semibold block mb-1">{t('name')} *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => updateField('name', e.target.value)}
                  placeholder="e.g. سما محمد"
                  required
                  className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:border-yellow-500 focus:outline-none transition"
                />
              </div>

              {/* Sport */}
              <div>
                <label className="text-white/40 text-xs font-semibold block mb-1">{t('sport')}</label>
                <div className="relative">
                  <select
                    value={formData.sport}
                    onChange={e => updateField('sport', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:border-yellow-500 outline-none transition cursor-pointer appearance-none"
                  >
                    <option value="" className="bg-[#0f0f0f] text-white/50">اختر الرياضة</option>
                    <option value="سباحة" className="bg-[#0f0f0f] text-white">سباحة</option>
                    <option value="تأهيل حركى" className="bg-[#0f0f0f] text-white">تأهيل حركى</option>
                    <option value="كمال اجسام" className="bg-[#0f0f0f] text-white">كمال اجسام</option>
                    <option value="جمباز" className="bg-[#0f0f0f] text-white">جمباز</option>
                    <option value="تايكوندو" className="bg-[#0f0f0f] text-white">تايكوندو</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                    <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="text-white/40 text-xs font-semibold block mb-1">{t('bio')}</label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={e => updateField('bio', e.target.value)}
                  placeholder="نبذة مختصرة عن البطل..."
                  className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:border-yellow-500 focus:outline-none transition resize-none"
                />
              </div>

              {/* Championships */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-white/40 text-xs font-semibold flex items-center gap-1">
                    <Medal className="w-3.5 h-3.5 text-yellow-400" /> {t('championships')}
                  </label>
                  <button
                    type="button"
                    onClick={addChampionship}
                    className="text-xs text-yellow-400 hover:text-yellow-300 font-bold flex items-center gap-1 transition"
                  >
                    <Plus className="w-3.5 h-3.5" /> {t('addChampionship')}
                  </button>
                </div>
                <div className="space-y-2">
                  {championships.map((champ, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <div className="relative flex-shrink-0">
                        <span className="w-6 h-6 flex items-center justify-center text-yellow-500/60 font-black text-xs rounded-lg bg-yellow-900/20 border border-yellow-900/30">
                          {idx + 1}
                        </span>
                      </div>
                      <input
                        type="text"
                        value={champ}
                        onChange={e => updateChampionship(idx, e.target.value)}
                        placeholder={`${t('championshipPlaceholder')} ${idx + 1}`}
                        className="flex-1 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:border-yellow-500 focus:outline-none transition"
                      />
                      {championships.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeChampionship(idx)}
                          className="w-8 h-8 rounded-xl bg-red-900/30 hover:bg-red-700/50 border border-red-900/30 text-red-400 flex items-center justify-center transition flex-shrink-0"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="text-white/40 text-xs font-semibold block mb-2">{t('image')}</label>
                {imagePreview && (
                  <div className="relative w-full h-40 rounded-xl overflow-hidden border border-white/10 mb-3">
                    <Image src={imagePreview} alt="preview" fill className="object-cover" />
                    <button
                      onClick={() => { setImageFile(null); setImagePreview(null); setFormData((p: any) => ({ ...p, image: '' })); }}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 text-white/80 flex items-center justify-center text-xs hover:bg-red-600 transition"
                    >✕</button>
                  </div>
                )}
                <label className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white/[0.04] border-2 border-dashed border-white/15 text-white/50 text-sm cursor-pointer hover:border-yellow-500/50 hover:text-white/70 transition">
                  <Camera className="w-4 h-4" />
                  <span>{imageFile ? imageFile.name : t('uploadImage')}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => handleImageSelect(e.target.files?.[0] || null)}
                  />
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-semibold hover:bg-white/8 transition">
                {t('cancel')}
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !formData.name.trim()}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-yellow-600 to-amber-500 font-bold text-sm text-black hover:opacity-90 transition disabled:opacity-40 flex items-center justify-center gap-2"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} {t('save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
