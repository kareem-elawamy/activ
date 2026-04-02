'use client';
import { useState, useEffect } from "react";
import api from "@/utils/api";
import EmptyState from "./EmptyState";
import { BookingRowSkeleton } from "./ActivityCardSkeleton"; 
import { useTranslations } from "next-intl";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminUsersTable({ lang = "en" }: { lang?: "ar" | "en" }) {
  const t = useTranslations('adminPanel.users');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/users');
        setUsers(res.data);
      } catch (err: any) {
        console.error("Failed to fetch users", err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => <BookingRowSkeleton key={i} />)}
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        icon="⚠️"
        title={t('error')}
        message={error}
        actionLabel={t('retry')}
        onAction={() => window.location.reload()}
      />
    );
  }

  if (users.length === 0) {
    return (
      <EmptyState
        icon="👥"
        title={t('noUsers')}
        message={t('noUsersDesc')}
      />
    );
  }

  return (
    <div className="bg-black border border-red-900/40 rounded-2xl overflow-hidden shadow-2xl">
      <div className="p-6 border-b border-red-900/40 flex justify-between items-center">
        <h3 className="text-xl font-bold text-white">
          {t('title')}
        </h3>
        <span className="px-4 py-1 bg-red-900/40 text-red-400 rounded-full text-sm font-semibold">
          {users.length} {t('count')}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-white/80">
          <thead className="bg-red-900/20 text-red-500 uppercase text-sm">
            <tr>
              <th className={`py-4 px-6 font-semibold ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t('name')}</th>
              <th className={`py-4 px-6 font-semibold ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t('email')}</th>
              <th className={`py-4 px-6 font-semibold ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t('role')}</th>
              <th className={`py-4 px-6 font-semibold ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t('joinedDate')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-white/5 transition-colors">
                <td className={`py-4 px-6 font-medium text-white ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{user.name}</td>
                <td className={`py-4 px-6 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{user.email}</td>
                <td className={`py-4 px-6 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      user.role === "admin"
                        ? "bg-purple-900/40 text-purple-400 border border-purple-900"
                        : "bg-blue-900/40 text-blue-400 border border-blue-900"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className={`py-4 px-6 text-sm text-white/50 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                  {new Date(user.createdAt).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
