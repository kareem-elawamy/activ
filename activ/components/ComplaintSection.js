"use client";

import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import toast from "react-hot-toast";

export default function ComplaintSection() {
  const { t, lang } = useTranslation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const apiUrl = typeof window === 'undefined'
        ? (process.env.INTERNAL_API_URL || 'http://app:3000')
        : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000');
      await fetch(`${apiUrl}/api/complaints`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      setSuccess(true);
      setFormData({ name: "", email: "", message: "" });
      toast.success(String(t('complaint.success')));
    } catch (error) {
      console.error("Error submitting complaint", error);
      toast.error(lang === 'ar' ? "حدث خطأ أثناء إرسال الشكوى" : "Failed to send complaint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-black py-20 px-4" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-2xl mx-auto bg-[#0d0d0d] border border-red-900/30 rounded-3xl shadow-[0_0_60px_rgba(220,38,38,0.08)] p-10">
        
        <h2 className="text-3xl font-bold text-center text-white mb-3">
          {String(t('complaint.title'))}
        </h2>

        <p className="text-center text-white/50 mb-8 text-sm">
          {String(t('complaint.subtitle'))}
        </p>

        {success && (
          <div className="bg-green-950/40 border border-green-800/50 text-green-400 p-3 rounded-xl mb-6 text-sm text-center">
            {String(t('complaint.success'))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <label className="block text-sm font-medium mb-2 text-white/60">
              {String(t('complaint.fullName'))}
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border border-white/10 bg-white/[0.04] rounded-xl px-4 py-3 text-white
                         focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition placeholder-white/20"
              placeholder={String(t('complaint.namePlaceholder'))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-white/60">
              {String(t('complaint.email'))}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-white/10 bg-white/[0.04] rounded-xl px-4 py-3 text-white
                         focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition placeholder-white/20"
              placeholder={String(t('complaint.emailPlaceholder'))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-white/60">
              {String(t('complaint.message'))}
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="4"
              className="w-full border border-white/10 bg-white/[0.04] rounded-xl px-4 py-3 text-white
                         focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition placeholder-white/20"
              placeholder={String(t('complaint.messagePlaceholder'))}
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-700 to-red-500 text-white py-3 rounded-xl font-bold
                       hover:opacity-90 transition duration-300 shadow-[0_0_20px_rgba(220,38,38,0.3)] disabled:opacity-50"
          >
            {loading ? String(t('complaint.sending')) : String(t('complaint.send'))}
          </button>

        </form>
      </div>
    </section>
  );
}