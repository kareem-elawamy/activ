'use client';
import { useState, useEffect } from "react";
import api from "@/utils/api";
import { useTranslations } from "next-intl";

interface StatsGridProps { lang?: "ar" | "en"; }
interface StatsData {
  totalUsers: number; activeWorkouts: number;
  pendingBookings: number; totalRevenue: number;
}

const StatIcons = [
  /* total users */
  <svg key="u" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>,
  /* active workouts */
  <svg key="w" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <circle cx="12" cy="12" r="10"/>
    <path d="M4.93 4.93c1.66 4.57 3.58 7.37 7.07 7.07 3.49-.3 5.41-2.5 7.07-7.07"/>
    <path d="M19.07 19.07c-1.66-4.57-3.58-7.37-7.07-7.07-3.49.3-5.41 2.5-7.07 7.07"/>
  </svg>,
  /* pending bookings */
  <svg key="b" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
    <circle cx="12" cy="16" r="1" fill="currentColor"/>
  </svg>,
  /* revenue */
  <svg key="r" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 1 0 0 7h5a3.5 3.5 0 1 1 0 7H6"/>
  </svg>,
];

const ACCENTS = [
  { bg: "from-blue-600/10 to-blue-900/5", border: "border-blue-700/20", icon: "bg-blue-600/15 text-blue-400", bar: "bg-blue-500" },
  { bg: "from-emerald-600/10 to-emerald-900/5", border: "border-emerald-700/20", icon: "bg-emerald-600/15 text-emerald-400", bar: "bg-emerald-500" },
  { bg: "from-amber-600/10 to-amber-900/5", border: "border-amber-700/20", icon: "bg-amber-600/15 text-amber-400", bar: "bg-amber-500" },
  { bg: "from-red-600/10 to-red-900/5", border: "border-red-700/20", icon: "bg-red-600/15 text-red-400", bar: "bg-red-500" },
];

export default function AdminStatsGrid({ lang = "en" }: StatsGridProps) {
  const t = useTranslations("adminPanel.stats");
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/users/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch admin stats", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const dynamicStats = [
    { label: t("totalUsers"),     value: stats?.totalUsers     ?? "—" },
    { label: t("activeWorkouts"), value: stats?.activeWorkouts ?? "—" },
    { label: t("pendingBookings"),value: stats?.pendingBookings?? "—" },
    { label: t("totalRevenue"),   value: stats ? `${stats.totalRevenue} EGP` : "—" },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[0,1,2,3].map(i => (
          <div key={i} className="bg-[#111] border border-white/[0.06] rounded-2xl p-6 h-32 animate-pulse">
            <div className="flex justify-between items-start">
              <div className="space-y-3 flex-1">
                <div className="h-3 bg-white/[0.06] rounded w-2/3" />
                <div className="h-7 bg-white/[0.09] rounded w-1/2" />
              </div>
              <div className="w-11 h-11 bg-white/[0.06] rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {dynamicStats.map((stat, i) => {
          const a = ACCENTS[i];
          return (
            <div
              key={i}
              className={`relative bg-gradient-to-br ${a.bg} border ${a.border} rounded-2xl p-6 overflow-hidden group hover:scale-[1.02] transition-all duration-300`}
            >
              {/* Glow */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${a.bg} blur-xl`} />

              <div className="relative flex justify-between items-start">
                <div>
                  <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-2">{stat.label}</p>
                  <h3 className="text-3xl font-black text-white">{stat.value}</h3>
                </div>
                <div className={`w-11 h-11 rounded-xl ${a.icon} flex items-center justify-center flex-shrink-0`}>
                  {StatIcons[i]}
                </div>
              </div>

              {/* Bottom accent bar */}
              <div className={`absolute bottom-0 left-0 right-0 h-[2px] ${a.bar} opacity-40`} />
            </div>
          );
        })}
      </div>

      {/* Welcome banner */}
      <div className="relative bg-gradient-to-r from-red-950/40 via-black to-black border border-red-900/20 rounded-2xl p-6 overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-64 bg-gradient-to-l from-red-600/5 to-transparent" />
        <div className="relative">
          <h2 className="text-2xl font-black text-white mb-1">Welcome to the Dashboard</h2>
          <p className="text-white/30 text-sm">Monitor your academy's performance and manage all operations from here.</p>
        </div>
      </div>
    </div>
  );
}