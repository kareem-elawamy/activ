"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";

export default function AdminLogin() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale || "ar";
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    try {
      const apiUrl = typeof window === 'undefined' ? (process.env.INTERNAL_API_URL || 'http://app:3000') : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000');
      const res = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || "اسم المستخدم أو كلمة المرور غير صحيحة");
      if (data.user?.role !== "admin") throw new Error("ليس لديك صلاحيات الدخول");

      localStorage.setItem("isAdminLoggedIn", "true");
      localStorage.setItem("adminName", data.user.name);
      localStorage.setItem("token", data.token);
      toast.success("تم تسجيل الدخول بنجاح");
      router.push(`/${locale}/admin`);
    } catch(err) {
      setError(err.message || "خطأ في الاتصال بالخادم");
      toast.error(err.message || "خطأ في الاتصال بالخادم");
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
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
            <label className="text-white/40 text-xs font-semibold block mb-1.5">البريد الإلكتروني للادمن</label>
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:border-red-500 focus:outline-none transition placeholder-white/20"
              placeholder="admin@activ.com"
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
      </div>
    </div>
  );
}
