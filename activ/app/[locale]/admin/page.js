"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import ManageContent from "./activities/ManageContent";
import BookingsTable from "./activities/BookingsTable";
import AdminCoachesManagement from './activities/Admincoachesmanagement';
import AdminUsersTable from "@/components/AdminUsersTable";
import AdminStatsGrid from "@/components/AdminStatsGrid";

const TABS = [
  { id: "overview",  icon: "📊" },
  { id: "users",     icon: "👥" },
  { id: "sports",    icon: "⚽" },
  { id: "coaches",   icon: "👨‍🏫" },
  { id: "bookings",  icon: "📋" },
];

export default function AdminPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale || "ar";
  const t = useTranslations('adminPanel');
  
  const [activeTab, setActiveTab] = useState("bookings");
  const [adminName, setAdminName] = useState("Admin");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Guard states
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem("role");
    
    if (role !== "admin") {
      setIsAuthorized(false);
      setIsChecking(false);
      return;
    }

    setIsAuthorized(true);
    setIsChecking(false);
    
    const name = localStorage.getItem("userName");
    if (name) setAdminName(name);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("role");
    router.push(`/${locale}/auth`);
  };

  const switchTab = (tabId) => {
    setActiveTab(tabId);
    setSidebarOpen(false); // Auto-close on mobile after selection
  };

  if (isChecking) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white/50 text-xl animate-pulse">Checking Authorization...</div>;
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-6 text-center">
        <div className="text-red-600 text-6xl mb-4">⛔</div>
        <h1 className="text-4xl font-black mb-2 tracking-tight">403 - Access Denied</h1>
        <p className="text-white/50 text-lg mb-8 max-w-md">You do not have administrative privileges to view this page.</p>
        <button 
          onClick={() => router.push(`/${locale}`)}
          className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full font-bold transition-all text-sm"
        >
          Return to Homepage
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-black text-white" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — hidden on mobile, slides in when sidebarOpen */}
      <aside className={`
        fixed md:static inset-y-0 z-50
        ${locale === 'ar' ? 'right-0' : 'left-0'}
        w-60 bg-black border-red-900/25 flex flex-col flex-shrink-0
        ${locale === 'ar' ? 'border-l' : 'border-r'}
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : (locale === 'ar' ? 'translate-x-full' : '-translate-x-full')}
        md:translate-x-0
      `}>
        <div className="p-5 border-b border-red-900/25 flex items-center justify-between">
          <div>
            <span className="text-red-600 font-black text-xl tracking-wider">{t('brand')}</span>
            <span className="text-white/40 font-bold text-xl"> {t('brandSuffix')}</span>
          </div>
          {/* Close button on mobile */}
          <button 
            onClick={() => setSidebarOpen(false)}
            className="md:hidden w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => switchTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.3)]"
                  : "text-white/50 hover:bg-red-900/20 hover:text-white"
              }`}
            >
              <span>{tab.icon}</span>
              <span className="font-semibold text-sm">{t(`sidebar.${tab.id}`)}</span>
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-red-900/25 space-y-2">
          <div className="px-4 py-2 text-white/30 text-xs">{t('welcomeAdmin', { name: adminName })}</div>
          <button
            onClick={handleLogout}
            className="w-full py-2 bg-red-700/40 hover:bg-red-700 border border-red-700/40 rounded-xl transition text-sm font-bold text-red-300 hover:text-white"
          >
            {t('logout')}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Topbar */}
        <header className="h-14 bg-black border-b border-red-900/20 flex items-center px-4 md:px-6 gap-3 flex-shrink-0">
          {/* Mobile hamburger */}
          <button 
            onClick={() => setSidebarOpen(true)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="text-red-500 font-black text-lg">
            {TABS.find(tab => tab.id === activeTab)?.icon}
          </span>
          <h2 className="text-white font-black text-lg truncate">
            {t(`sidebar.${activeTab}`)}
          </h2>
        </header>

        <div className="flex-1 overflow-auto p-3 md:p-6">
          {activeTab === "overview"  && <AdminStatsGrid lang={locale} />}
          {activeTab === "users"     && <AdminUsersTable lang={locale} />}
          {activeTab === "sports"    && <ManageContent />}
          {activeTab === "bookings"  && <BookingsTable />}
          {activeTab === "coaches"   && <AdminCoachesManagement lang={locale} />}
        </div>
      </main>
    </div>
  );
}
