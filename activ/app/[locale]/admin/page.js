"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import ManageContent from "./activities/ManageContent";
import BookingsTable from "./activities/BookingsTable";
import AdminCoachesManagement from "./activities/Admincoachesmanagement";
import AdminHeroesManagement from "./activities/AdminHeroesManagement";
import AdminUsersTable from "@/components/AdminUsersTable";
import AdminStatsGrid from "@/components/AdminStatsGrid";

/* ── SVG Icons ────────────────────────────────────────────────── */
const Icons = {
  overview: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4.5 h-4.5 w-[18px] h-[18px]">
      <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  users: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  sports: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
      <circle cx="12" cy="12" r="10" />
      <path d="M4.93 4.93c1.66 4.57 3.58 7.37 7.07 7.07 3.49-.3 5.41-2.5 7.07-7.07" />
      <path d="M19.07 19.07c-1.66-4.57-3.58-7.37-7.07-7.07-3.49.3-5.41 2.5-7.07 7.07" />
    </svg>
  ),
  coaches: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
      <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  ),
  bookings: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
      <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
      <path d="m9 16 2 2 4-4" />
    </svg>
  ),
  heroes: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  ),
  logout: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  menu: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-5 h-5">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  close: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-4 h-4">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <line x1="12" y1="8" x2="12" y2="12" /><circle cx="12" cy="16" r="1" fill="currentColor" />
    </svg>
  ),
};

const TABS = [
  { id: "overview", icon: Icons.overview },
  { id: "users", icon: Icons.users },
  { id: "sports", icon: Icons.sports },
  { id: "coaches", icon: Icons.coaches },
  { id: "heroes", icon: Icons.heroes },
  { id: "bookings", icon: Icons.bookings },
];

export default function AdminPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale || "ar";
  const t = useTranslations("adminPanel");

  const [activeTab, setActiveTab] = useState("bookings");
  const [adminName, setAdminName] = useState("Admin");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") { setIsAuthorized(false); setIsChecking(false); return; }
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

  const switchTab = (tabId) => { setActiveTab(tabId); setSidebarOpen(false); };

  /* ── Loading ─────────────────────────────────── */
  if (isChecking) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-white/30 text-sm font-semibold tracking-widest uppercase">Checking Authorization</p>
        </div>
      </div>
    );
  }

  /* ── Access Denied ───────────────────────────── */
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center text-white p-6 text-center">
        <div className="w-24 h-24 rounded-full bg-red-950/50 border border-red-800/40 flex items-center justify-center mb-6 text-red-500">
          {Icons.shield}
        </div>
        <h1 className="text-4xl font-black mb-2 tracking-tight">403</h1>
        <p className="text-white/40 text-lg mb-2 font-semibold">Access Denied</p>
        <p className="text-white/25 text-sm mb-8 max-w-sm">You do not have administrative privileges to view this page.</p>
        <button
          onClick={() => router.push(`/${locale}`)}
          className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full font-bold transition-all text-sm"
        >
          Return to Homepage
        </button>
      </div>
    );
  }

  const activeTabData = TABS.find(tab => tab.id === activeTab);

  /* ── Dashboard ───────────────────────────────── */
  return (
    <div
      className="flex min-h-screen bg-[#080808] text-white"
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      {/* ── Mobile overlay ──────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ══ SIDEBAR ════════════════════════════════ */}
      <aside
        className={`
          fixed md:static inset-y-0 z-50
          ${locale === "ar" ? "right-0" : "left-0"}
          w-[220px] bg-[#0d0d0d] border-red-900/20 flex flex-col flex-shrink-0
          ${locale === "ar" ? "border-l" : "border-r"}
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : (locale === "ar" ? "translate-x-full" : "-translate-x-full")}
          md:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-white/[0.06] flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <div className="leading-tight">
              <span className="text-white font-black text-sm tracking-wider">{t("brand")}</span>
              <span className="text-red-500 font-black text-sm"> {t("brandSuffix")}</span>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 text-white/40 hover:bg-white/10 hover:text-white transition"
          >
            {Icons.close}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => switchTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 text-sm font-semibold group ${activeTab === tab.id
                  ? "bg-red-600/15 text-red-400 border border-red-600/20"
                  : "text-white/40 hover:bg-white/[0.04] hover:text-white/80 border border-transparent"
                }`}
            >
              <span className={`flex-shrink-0 transition-colors ${activeTab === tab.id ? "text-red-500" : "text-white/30 group-hover:text-white/60"}`}>
                {tab.icon}
              </span>
              <span>{t(`sidebar.${tab.id}`)}</span>
              {activeTab === tab.id && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
              )}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-white/[0.06] space-y-3 flex-shrink-0">
          {/* Admin info */}
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-700 to-red-500 flex items-center justify-center text-xs font-black flex-shrink-0">
              {adminName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-white/80 text-xs font-bold truncate">{adminName}</p>
              <p className="text-white/30 text-[10px]">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-red-950/40 hover:bg-red-700/60 border border-red-900/30 hover:border-red-700/50 text-red-400 hover:text-white text-xs font-bold transition-all duration-200"
          >
            {Icons.logout}
            {t("logout")}
          </button>
        </div>
      </aside>

      {/* ══ MAIN ═══════════════════════════════════ */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Topbar */}
        <header className="h-16 bg-[#0d0d0d] border-b border-white/[0.06] flex items-center px-4 md:px-6 gap-4 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/60 hover:text-white transition flex-shrink-0"
          >
            {Icons.menu}
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-white/20 text-xs font-semibold hidden sm:block">ACTIV ADMIN</span>
            <span className="text-white/15 hidden sm:block">/</span>
            <div className="flex items-center gap-2">
              <span className="text-red-500/70 flex-shrink-0">{activeTabData?.icon}</span>
              <h1 className="text-white/80 font-bold text-sm capitalize truncate">
                {t(`sidebar.${activeTab}`)}
              </h1>
            </div>
          </div>

          {/* Right */}
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-white/40 text-xs font-semibold">Live</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-700 to-red-500 flex items-center justify-center text-xs font-black flex-shrink-0">
              {adminName.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          {activeTab === "overview" && <AdminStatsGrid lang={locale} />}
          {activeTab === "users" && <AdminUsersTable lang={locale} />}
          {activeTab === "sports" && <ManageContent />}
          {activeTab === "bookings" && <BookingsTable />}
          {activeTab === "coaches" && <AdminCoachesManagement lang={locale} />}
          {activeTab === "heroes" && <AdminHeroesManagement lang={locale} />}
        </div>
      </main>
    </div>
  );
}
