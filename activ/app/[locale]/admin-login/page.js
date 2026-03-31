"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Simple admin credentials — in production, use a proper auth system or env vars
// Default: admin / admin123 (can be changed via environment variables)
const ADMIN_USERNAME = process.env.NEXT_PUBLIC_ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123";

export default function AdminLogin() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const username = e.target.username.value.trim();
    const password = e.target.password.value;

    // Small delay to prevent brute-force feel
    await new Promise(r => setTimeout(r, 400));

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      localStorage.setItem("isAdminLoggedIn", "true");
      localStorage.setItem("adminName", username);
      router.push(`/ar/admin`);
    } else {
      setError("اسم المستخدم أو كلمة المرور غير صحيحة");
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black" dir="rtl">
      <div className="bg-[#0d0d0d] border border-red-900/30 rounded-2xl p-10 w-full max-w-sm shadow-[0_0_60px_rgba(220,38,38,0.1)]">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-4xl font-black mb-1">
            <span className="text-red-600">ACTIV</span>
            <span className="text-white"> ADMIN</span>
          </div>
          <p className="text-white/30 text-sm">لوحة التحكم</p>
        </div>

        {error && (
          <div className="bg-red-950/40 border border-red-800/50 rounded-xl px-4 py-3 mb-5 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-white/40 text-xs font-semibold block mb-1.5">اسم المستخدم</label>
            <input
              type="text"
              name="username"
              required
              autoComplete="username"
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:border-red-500 focus:outline-none transition placeholder-white/20"
              placeholder="admin"
            />
          </div>

          <div>
            <label className="text-white/40 text-xs font-semibold block mb-1.5">كلمة المرور</label>
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:border-red-500 focus:outline-none transition placeholder-white/20"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 bg-gradient-to-r from-red-700 to-red-500 text-white font-black rounded-xl hover:opacity-90 transition shadow-[0_0_20px_rgba(220,38,38,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <><span className="animate-spin inline-block">⟳</span> جاري الدخول...</>
            ) : (
              "دخول"
            )}
          </button>
        </form>

        <p className="text-center text-white/15 text-xs mt-6">
          بيانات الدخول الافتراضية: admin / admin123
        </p>
      </div>
    </div>
  );
}
