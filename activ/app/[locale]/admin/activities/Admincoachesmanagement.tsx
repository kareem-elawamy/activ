'use client';

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import api from "@/utils/api";
import toast from "react-hot-toast";
import Image from "next/image";

type Coach = {
  _id: string;
  name: string;
  specialty: string;
  bio: string;
  image?: string;
};

type Props = {
  lang?: "en" | "ar";
};

const EMPTY_FORM = {
  name: "",
  specialty: "",
  bio: "",
  image: "",
};

export default function AdminCoachesManagement({ lang = "en" }: Props) {
  const t = useTranslations('adminPanel.coaches');

  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCoach, setEditingCoach] = useState<Coach | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<any>({ ...EMPTY_FORM });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    fetchCoaches();
  }, []);

  const fetchCoaches = async () => {
    setLoading(true);
    try {
      const res = await api.get('/coaches');
      setCoaches(res.data);
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
      await api.delete(`/coaches/${id}`);
      setCoaches(coaches.filter(c => c._id !== id));
      toast.success(t('deleteSuccess'));
    } catch (err) {
      toast.error(t('deleteError'));
    }
  };

  const handleEdit = (coach: Coach) => {
    setEditingCoach(coach);
    setFormData({
      name: coach.name || "",
      specialty: coach.specialty || "",
      bio: coach.bio || "",
      image: coach.image || "",
    });
    setImageFile(null);
    setImagePreview(coach.image || null);
    setShowModal(true);
  };

  const openAddModal = () => {
    setEditingCoach(null);
    setFormData({ ...EMPTY_FORM });
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

  const handleSave = async () => {
    if (!formData.name.trim()) return;
    setSaving(true);

    let imageUrl = formData.image;

    // Upload image if a new file was selected
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

    const payload = { 
      name: formData.name, 
      specialty: formData.specialty, 
      bio: formData.bio, 
      image: imageUrl 
    };

    try {
      if (editingCoach) {
        const res = await api.put(`/coaches/${editingCoach._id}`, payload);
        setCoaches(coaches.map(c => c._id === editingCoach._id ? res.data.coach : c));
      } else {
        const res = await api.post('/coaches', payload);
        setCoaches([res.data, ...coaches]);
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
          <div key={i} className="bg-black border border-red-900/30 rounded-2xl h-80 animate-pulse" />
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
          className="px-5 py-2.5 bg-gradient-to-r from-red-700 to-red-500 rounded-xl font-bold text-sm hover:opacity-90 transition shadow-lg"
        >
          ➕ {t('addCoach')}
        </button>
      </div>

      {/* Coaches Grid */}
      {coaches.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">👨‍🏫</div>
          <h3 className="text-xl font-bold text-white">{t('noCoaches')}</h3>
          <p className="text-white/40 mt-2">{t('noCoachesDesc')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {coaches.map((coach) => (
            <div key={coach._id} className="bg-[#0d0d0d] border border-red-900/30 rounded-2xl overflow-hidden hover:border-red-600/50 transition-all duration-300">
              {/* Image */}
              <div className="relative h-48 bg-gradient-to-br from-red-950/40 to-black">
                {coach.image ? (
                  <Image src={coach.image} alt={coach.name} fill className="object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-6xl opacity-30">👨‍🏫</div>
                )}
              </div>

              {/* Info */}
              <div className="p-5">
                <h3 className="text-lg font-black text-white">{coach.name}</h3>
                <p className="text-white/60 text-sm font-semibold">{coach.specialty}</p>
                {coach.bio && <p className="text-white/40 text-xs mt-2 line-clamp-2">{coach.bio}</p>}

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <button onClick={() => handleEdit(coach)} className="flex-1 py-2 bg-yellow-700/40 hover:bg-yellow-700 rounded-lg text-xs font-bold transition">
                    ✏️ {t('edit')}
                  </button>
                  <button onClick={() => handleDelete(coach._id)} className="flex-1 py-2 bg-red-700/40 hover:bg-red-700 rounded-lg text-xs font-bold transition">
                    🗑️ {t('delete')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal — Simplified: Name, Specialty, Bio, Image Upload */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-[#0a0a0a] border border-red-900/40 rounded-2xl p-6 w-full max-w-md max-h-[85vh] overflow-y-auto shadow-2xl">
            <h3 className="text-xl font-black text-white mb-5">
              {editingCoach ? t('editCoach') : t('addCoach')}
            </h3>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="text-white/40 text-xs font-semibold block mb-1">{t('name')} *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => updateField('name', e.target.value)}
                  required
                  className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:border-red-500 focus:outline-none transition"
                />
              </div>

              {/* Specialty */}
              <div>
                <label className="text-white/40 text-xs font-semibold block mb-1">{t('specialty')}</label>
                <input
                  type="text"
                  value={formData.specialty}
                  onChange={e => updateField('specialty', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:border-red-500 focus:outline-none transition"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="text-white/40 text-xs font-semibold block mb-1">{t('bio')}</label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={e => updateField('bio', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:border-red-500 focus:outline-none transition resize-none"
                />
              </div>

              {/* Image Upload with Preview */}
              <div>
                <label className="text-white/40 text-xs font-semibold block mb-2">{t('image')}</label>
                
                {/* Preview */}
                {imagePreview && (
                  <div className="relative w-full h-40 rounded-xl overflow-hidden border border-white/10 mb-3">
                    <Image src={imagePreview} alt="preview" fill className="object-cover" />
                    <button 
                      onClick={() => { setImageFile(null); setImagePreview(null); setFormData((p: any) => ({...p, image: ''})); }}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 text-white/80 flex items-center justify-center text-xs hover:bg-red-600 transition"
                    >✕</button>
                  </div>
                )}

                <label className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white/[0.04] border-2 border-dashed border-white/15 text-white/50 text-sm cursor-pointer hover:border-red-500/50 hover:text-white/70 transition">
                  <span>📷</span>
                  <span>{imageFile ? imageFile.name : (imagePreview ? t('image') : t('image'))}</span>
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
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-red-700 to-red-500 font-bold text-sm hover:opacity-90 transition disabled:opacity-40"
              >
                {saving ? '⟳' : '💾'} {t('save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}