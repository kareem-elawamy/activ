'use client';
import { useState, useEffect } from "react";
import api from "@/utils/api";
import { useTranslations } from "next-intl";

interface StatsGridProps {
  lang?: "ar" | "en";
}

interface StatsData {
  totalUsers: number;
  activeWorkouts: number;
  pendingBookings: number;
  totalRevenue: number;
}

export default function AdminStatsGrid({ lang = "en" }: StatsGridProps) {
  const t = useTranslations('adminPanel.stats');
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/users/stats');
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch admin stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const dynamicStats = [
    { label: t('totalUsers'), value: stats?.totalUsers || '---', icon: "👥" },
    { label: t('activeWorkouts'), value: stats?.activeWorkouts || '---', icon: "⚽" },
    { label: t('pendingBookings'), value: stats?.pendingBookings || '---', icon: "📋" },
    { label: t('totalRevenue'), value: stats ? `${stats.totalRevenue}` : '---', icon: "💰" }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-black border-b-4 border-red-900/50 p-6 rounded-2xl h-28 animate-pulse flex items-center justify-between">
             <div className="space-y-3 w-1/2">
                <div className="h-3 bg-white/10 rounded w-full"></div>
                <div className="h-6 bg-white/20 rounded w-1/2"></div>
             </div>
             <div className="w-10 h-10 bg-white/10 rounded-full"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {dynamicStats.map((stat, i) => (
        <div
          key={i}
          className="bg-black border-b-4 border-red-600 p-6 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.7)] hover:scale-105 transition-all duration-300"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-white/60 text-sm uppercase tracking-wide">{stat.label}</p>
              <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
            </div>
            <span className="text-3xl">{stat.icon}</span>
          </div>
        </div>
      ))}
    </div>
  );
}