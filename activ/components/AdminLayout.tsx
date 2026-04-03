"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import StatsGrid from "./AdminStatsGrid";
import ManageContent from "./AdminManageContent";
import AdminUsersTable from "./AdminUsersTable";

import ar from "../messages/ar.json";
import en from "../messages/en.json";

interface AdminDashboardProps {
  lang?: "ar" | "en"; // اللغة الافتراضية "en"
  children?: React.ReactNode;
}

export default function AdminDashboard({ lang = "en", children }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const { data: session, status } = useSession();
  const router = useRouter();

  const texts = lang === "ar" ? ar.adminDashboard : en.adminDashboard;

  // حماية الادمن
  useEffect(() => {
    // We cast user as any to bypass NextAuth's default type restriction for custom 'role'
    if (status === "authenticated" && (session?.user as any)?.role !== "admin") {
      router.push("/");
    }
    if (status === "unauthenticated") {
      router.push("/admin-login");
    }
  }, [status, session, router]);

  if (status === "loading") return <div className="text-white p-10">{texts.loading}</div>;
  if (!session) return null;

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-black border-r border-red-900/40 hidden md:flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-red-900/40 tracking-wider">
          <span className="text-red-600">ACTIV</span> ADMIN
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <SidebarLink icon="📊" label={texts.sidebar.overview} active={activeTab === "overview"} onClick={() => setActiveTab("overview")} />
          <SidebarLink icon="👥" label={texts.sidebar.users} active={activeTab === "users"} onClick={() => setActiveTab("users")} />
          <SidebarLink icon="⚽" label={texts.sidebar.sports} active={activeTab === "sports"} onClick={() => setActiveTab("sports")} />
          <SidebarLink icon="📅" label={texts.sidebar.bookings} active={activeTab === "bookings"} onClick={() => setActiveTab("bookings")} />
        </nav>

        <div className="p-4 border-t border-red-900/40">
          <button
            onClick={() => signOut({ callbackUrl: "/admin-login" })}
            className="w-full py-2 bg-red-600 rounded-lg hover:bg-red-700 transition font-semibold"
          >
            {texts.buttons.logout}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-black border-b border-red-900/40 flex items-center justify-between px-8">
          <h2 className="text-xl font-bold capitalize">
            <span className="text-red-500">{activeTab}</span>
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-white/60">{texts.welcome.replace("{name}", session?.user?.name || "Admin")}</span>
            <div className="w-10 h-10 bg-red-600 rounded-full shadow-md"></div>
          </div>
        </header>

        <div className="p-8">
          {activeTab === "overview" && <StatsGrid lang={lang} />}
          {activeTab === "users" && <AdminUsersTable lang={lang} />}
          {activeTab === "sports" && <ManageContent />}
          {activeTab === "bookings" && <div>{children}</div>}
        </div>
      </main>
    </div>
  );
}

const SidebarLink = ({ icon, label, active, onClick }: { icon: string; label: string; active: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
      active ? "bg-red-600 text-white shadow-md" : "text-white/70 hover:bg-red-900/40 hover:text-white"
    }`}
  >
    <span>{icon}</span>
    <span className="font-semibold">{label}</span>
  </button>
);