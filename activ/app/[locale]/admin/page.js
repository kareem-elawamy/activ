"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ManageContent from "./activities/ManageContent";
import BookingsTable from "./activities/BookingsTable";
import AdminCoachesManagement from './activities/Admincoachesmanagement';

const TABS = [
  { id: "sports",   icon: "⚽", label: "الأنشطة" },
  { id: "bookings", icon: "📋", label: "الحجوزات والمدفوعات" },
  { id: "coaches",  icon: "👨‍🏫", label: "المدربون" },
];

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("bookings");
  const [adminName, setAdminName] = useState("Admin");

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isAdminLoggedIn");
    if (!isLoggedIn) router.push("/admin-login");
    const name = localStorage.getItem("adminName");
    if (name) setAdminName(name);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    router.push("/admin-login");
  };

  return (
    <div className="flex min-h-screen bg-black text-white" dir="rtl">
      {/* Sidebar */}
      <aside className="w-60 bg-black border-l border-red-900/25 flex flex-col flex-shrink-0">
        <div className="p-5 border-b border-red-900/25">
          <span className="text-red-600 font-black text-xl tracking-wider">ACTIV</span>
          <span className="text-white/40 font-bold text-xl"> ADMIN</span>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 text-right ${
                activeTab === tab.id
                  ? "bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.3)]"
                  : "text-white/50 hover:bg-red-900/20 hover:text-white"
              }`}
            >
              <span>{tab.icon}</span>
              <span className="font-semibold text-sm">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-red-900/25 space-y-2">
          <div className="px-4 py-2 text-white/30 text-xs">مرحباً، {adminName}</div>
          <button
            onClick={handleLogout}
            className="w-full py-2 bg-red-700/40 hover:bg-red-700 border border-red-700/40 rounded-xl transition text-sm font-bold text-red-300 hover:text-white"
          >
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-14 bg-black border-b border-red-900/20 flex items-center px-6 gap-3">
          <span className="text-red-500 font-black text-lg">
            {TABS.find(t => t.id === activeTab)?.icon}
          </span>
          <h2 className="text-white font-black text-lg">
            {TABS.find(t => t.id === activeTab)?.label}
          </h2>
        </header>

        <div className="flex-1 overflow-auto p-6">
          {activeTab === "sports"    && <ManageContent />}
          {activeTab === "bookings"  && <BookingsTable />}
          {activeTab === "coaches"   && <AdminCoachesManagement />}
        </div>
      </main>
    </div>
  );
}
