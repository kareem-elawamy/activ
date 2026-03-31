'use client';
import { useState, useEffect } from "react";
import ar from "../messages/ar.json";
import en from "../messages/en.json";

interface RecentBookingsProps {
  lang?: "ar" | "en"; // الافتراضي: "en"
}

export default function RecentBookings({ lang = "en" }: RecentBookingsProps) {
  const [bookings, setBookings] = useState([]);
  const texts = lang === "ar" ? ar.recentBookings : en.recentBookings;

  useEffect(() => {
    const loadBookings = () => {
      const stored = JSON.parse(localStorage.getItem("bookings") || "[]");
      setBookings(stored);
    };

    loadBookings();

    window.addEventListener("storage_updated", loadBookings);
    return () => window.removeEventListener("storage_updated", loadBookings);
  }, []);

  if (!bookings.length)
    return (
      <div className="bg-black p-6 rounded-2xl text-white text-center">
        {texts.noBookings}
      </div>
    );

  return (
    <div className="bg-black border border-red-900/40 p-6 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] overflow-x-auto text-white">
      <h3 className="text-xl font-bold mb-6">
        {texts.title.split(" ")[0]} <span className="text-red-500">{texts.title.split(" ")[1]}</span>
      </h3>

      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-red-900/40 text-white/60 text-sm uppercase tracking-wider">
            <th className="pb-3">{texts.headers.userName}</th>
            <th className="pb-3">{texts.headers.age}</th>
            <th className="pb-3">{texts.headers.userId}</th>
            <th className="pb-3">{texts.headers.activity}</th>
            <th className="pb-3">{texts.headers.coach}</th>
            <th className="pb-3">{texts.headers.date}</th>
            <th className="pb-3">{texts.headers.time}</th>
          </tr>
        </thead>
        <tbody className="text-white/80">
          {bookings.map((b: any) => (
            <tr key={b._id} className="border-b border-red-900/30 hover:bg-red-900/10 transition">
              <td className="py-4 font-medium">{b.userFullName}</td>
              <td className="py-4">{b.userAge}</td>
              <td className="py-4">{b.userId}</td>
              <td className="py-4">{b.activityName}</td>
              <td className="py-4">{b.coach}</td>
              <td className="py-4">{b.date}</td>
              <td className="py-4">{b.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}