'use client';

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import api from "@/utils/api";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import toast from "react-hot-toast";

export default function Auth() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('auth');
  const [activeTab, setActiveTab] = useState("login");

  const switchTab = (tab: string) => setActiveTab(tab);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    const formData = {
      email: e.target.email.value,
      password: e.target.password.value,
    };

    try {
      const res = await api.post("/auth/login", formData);
      const token = res.data.token;
      const user = res.data.user;
      const name = user?.name || res.data.name;

      if (token && name) {
        localStorage.setItem("token", token);
        localStorage.setItem("userName", name);
        localStorage.setItem("role", user?.role || "user");
        window.dispatchEvent(new Event("storage_updated"));
        toast.success(t('loginSuccess'));
        if (user?.role === 'admin') {
          router.push(`/${locale}/admin`);
        } else {
          router.push(`/${locale}`);
        }
      } else toast.error(t('loginMissingData'));
    } catch (err: any) {
      console.error("Login Error:", err);
      const msg = err?.response?.data?.message || err?.message || t('loginFailed');
      toast.error(msg);
    }
  };

  const handleRegister = async (e: any) => {
    e.preventDefault();
    const nameInput = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirm = e.target.confirm.value;

    if (password !== confirm) {
      toast.error(t('passwordsMismatch'));
      return;
    }

    const formData = { name: nameInput, email, password };

    try {
      const res = await api.post("/auth/register", formData);
      const token = res.data.token;
      const nameToSave = res.data.name || (res.data.user && res.data.user.name) || nameInput;

      localStorage.setItem("token", token);
      localStorage.setItem("userName", nameToSave);
      localStorage.setItem("role", res.data.user?.role || "user");
      window.dispatchEvent(new Event("storage_updated"));
      toast.success(t('registerSuccess'));
      router.push(`/${locale}/dashboard`);
    } catch (err: any) {
      console.error("Registration Error:", err);
      const msg = err?.response?.data?.message || err?.message || t('registerFailed');
      toast.error(msg);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      {/* Left Side */}
      <div className="flex-1 flex flex-col justify-center p-8 sm:p-16 bg-white pt-28">
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-black text-black mb-2">
          {activeTab === "login" ? t('welcomeBack') : t('joinToday')}
        </h1>
        <p className="text-gray-600 mb-10 text-sm sm:text-base">
          {activeTab === "login" ? t('signInSubtitle') : t('registerSubtitle')}
        </p>

        {/* Tabs */}
        <div className="flex gap-5 border-b-2 border-gray-200 mb-8">
          <button
            className={`pb-3 font-semibold transition-colors ${
              activeTab === "login"
                ? "text-red-600 border-b-2 border-red-600"
                : "text-gray-400 hover:text-red-500"
            }`}
            onClick={() => switchTab("login")}
          >
            {t('loginTab')}
          </button>
          <button
            className={`pb-3 font-semibold transition-colors ${
              activeTab === "register"
                ? "text-red-600 border-b-2 border-red-600"
                : "text-gray-400 hover:text-red-500"
            }`}
            onClick={() => switchTab("register")}
          >
            {t('registerTab')}
          </button>
        </div>

        {/* Forms */}
        {activeTab === "login" ? (
          <form onSubmit={handleLogin} className="space-y-6">
            <input
              type="email"
              name="email"
              placeholder={t('emailPlaceholder')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
              required
            />
            <input
              type="password"
              name="password"
              placeholder={t('passwordPlaceholder')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
              required
            />
            <div className={`text-${locale === 'ar' ? 'left' : 'right'}`}>
              <a href="#" className="text-gray-400 text-sm hover:text-red-600 transition-colors">
                {t('forgotPassword')}
              </a>
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-red-700 to-red-600 text-white font-black rounded-lg hover:shadow-lg hover:shadow-red-600/30 hover:-translate-y-1 transition-all duration-300"
            >
              {t('signInButton')}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder={t('fullNamePlaceholder')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
              required
            />
            <input
              type="email"
              name="email"
              placeholder={t('emailPlaceholder')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
              required
            />
            <input
              type="password"
              name="password"
              placeholder={t('passwordPlaceholder')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
              required
            />
            <input
              type="password"
              name="confirm"
              placeholder={t('confirmPasswordPlaceholder')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
              required
            />
            <button
              type="submit"
              className="w-full py-3 mt-4 bg-gradient-to-r from-red-700 to-red-600 text-white font-black rounded-lg hover:shadow-lg hover:shadow-red-600/30 hover:-translate-y-1 transition-all duration-300"
            >
              {t('createAccountButton')}
            </button>
          </form>
        )}
      </div>

      {/* Right Side Video */}
      <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-black/90 to-red-900/80 items-center justify-center text-white p-16">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay"
        >
          <source src="/assets/one.mp4" type="video/mp4" />
        </video>
        <div className="text-center max-w-lg z-10 relative">
          <div className="mb-8 flex justify-center">
            <Image src="/assets/logo.png" alt="Logo" width={200} height={120} className="object-contain drop-shadow-2xl" priority style={{ width: 'auto', height: 'auto' }} />
          </div>
          <h2 className="text-4xl sm:text-5xl font-black mb-5 leading-tight drop-shadow-md">
            {t('videoTitle')}
          </h2>
          <p className="text-white/80 text-lg">
            {t('videoSubtitle')}
          </p>
        </div>
      </div>
    </div>
  );
}
