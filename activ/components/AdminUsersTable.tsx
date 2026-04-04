'use client';
import { useState, useEffect } from "react";
import api from "@/utils/api";
import EmptyState from "./EmptyState";
import { BookingRowSkeleton } from "./ActivityCardSkeleton";
import { useTranslations } from "next-intl";

interface User {
  _id: string; name: string; email: string; role: string; createdAt: string;
}

export default function AdminUsersTable({ lang = "en" }: { lang?: "ar" | "en" }) {
  const t = useTranslations("adminPanel.users");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/users");
        setUsers(res.data);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="space-y-3">{[1,2,3,4,5].map(i => <BookingRowSkeleton key={i} />)}</div>;

  if (error) return (
    <EmptyState
      icon="⚠️"
      title={t("error")}
      message={error}
      actionLabel={t("retry")}
      onAction={() => window.location.reload()}
    />
  );

  if (users.length === 0) return (
    <EmptyState icon="👥" title={t("noUsers")} message={t("noUsersDesc")} />
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white">{t("title")}</h2>
          <p className="text-white/30 text-sm mt-0.5">{users.length} {t("count")}</p>
        </div>
        {/* Search */}
        <div className="relative">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full sm:w-64 pl-9 pr-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:border-red-600/40 focus:outline-none transition placeholder:text-white/20"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0f0f0f] border border-white/[0.06] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {[t("name"), t("email"), t("role"), t("joinedDate")].map((h, i) => (
                  <th key={i} className={`py-4 px-5 text-white/30 font-bold text-xs uppercase tracking-widest ${lang === "ar" ? "text-right" : "text-left"}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filtered.map(user => (
                <tr key={user._id} className="hover:bg-white/[0.025] transition-colors group">
                  {/* Name */}
                  <td className={`py-4 px-5 ${lang === "ar" ? "text-right" : "text-left"}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-700/60 to-red-900/60 border border-red-800/30 flex items-center justify-center text-xs font-black text-red-300 flex-shrink-0">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold text-white/80 group-hover:text-white transition-colors">{user.name}</span>
                    </div>
                  </td>
                  {/* Email */}
                  <td className={`py-4 px-5 text-white/40 text-sm font-mono ${lang === "ar" ? "text-right" : "text-left"}`}>
                    {user.email}
                  </td>
                  {/* Role */}
                  <td className={`py-4 px-5 ${lang === "ar" ? "text-right" : "text-left"}`}>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${
                      user.role === "admin"
                        ? "bg-violet-900/30 text-violet-400 border border-violet-800/30"
                        : "bg-blue-900/30 text-blue-400 border border-blue-800/30"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${user.role === "admin" ? "bg-violet-400" : "bg-blue-400"}`} />
                      {user.role}
                    </span>
                  </td>
                  {/* Date */}
                  <td className={`py-4 px-5 text-white/30 text-xs ${lang === "ar" ? "text-right" : "text-left"}`}>
                    {new Date(user.createdAt).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", {
                      year: "numeric", month: "short", day: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && search && (
            <div className="text-center py-12 text-white/25">
              <p className="text-sm font-semibold">No results for &quot;{search}&quot;</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
