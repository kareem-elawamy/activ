'use client';

import { useState, useEffect } from 'react';
import en from '@/messages/en.json';
import ar from '@/messages/ar.json';

interface Booking {
  _id: string;
  user?: string;
  activityName: string;
  coach: string;
  date: string;
  time: string;
}

interface Props {
  lang?: 'en' | 'ar';
}

export default function RecentBookings({ lang = 'en' }: Props) {
  const [bookings, setBookings] = useState<Booking[]>([]);

  const t = lang === 'ar' ? ar.recentBookings : en.recentBookings;

  const loadBookings = () => {
    const stored = JSON.parse(localStorage.getItem('bookings') || '[]');
    setBookings(stored);
  };

  useEffect(() => {
    loadBookings();

    const handleStorageUpdate = () => loadBookings();
    window.addEventListener('storage_updated', handleStorageUpdate);

    return () => window.removeEventListener('storage_updated', handleStorageUpdate);
  }, []);

  if (bookings.length === 0) {
    return (
      <div className="bg-black border border-red-900/40 p-6 rounded-2xl text-white text-center">
        {t.empty}
      </div>
    );
  }

  return (
    <div
      className="bg-black border border-red-900/40 p-6 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] overflow-x-auto text-white"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      <h3 className="text-xl font-bold mb-6">
        {t.title.split(' ')[0]}{" "}
        <span className="text-red-500">{t.title.split(' ')[1]}</span>
      </h3>

      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-red-900/40 text-white/60 text-sm uppercase tracking-wider">
            <th className="pb-3">{t.table.player}</th>
            <th className="pb-3">{t.table.activity}</th>
            <th className="pb-3">{t.table.coach}</th>
            <th className="pb-3">{t.table.dateTime}</th>
            <th className="pb-3">{t.table.status}</th>
          </tr>
        </thead>

        <tbody className="text-white/80">
          {bookings.map((b) => (
            <tr
              key={b._id}
              className="border-b border-red-900/30 hover:bg-red-900/10 transition"
            >
              <td className="py-4 font-medium text-white">
                {b.user || t.anonymous}
              </td>

              <td className="py-4">{b.activityName}</td>

              <td className="py-4">{b.coach}</td>

              <td className="py-4">
                {b.date} {t.at} {b.time}
              </td>

              <td className="py-4">
                <span className="px-3 py-1 bg-green-900/40 text-green-500 border border-green-700 rounded-full text-xs font-semibold">
                  {t.confirmed}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}