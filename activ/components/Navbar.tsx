'use client';

import { useState, useEffect, useRef } from "react";
import { Link, useRouter } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import LanguageSwitcher from "./LanguageSwitcher";

interface NavLink {
  href: string;
  key: string;
}

const Navbar = () => {
  const t = useTranslations();
  const lang = useLocale();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Auth States
  const [userName, setUserName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  
  const router = useRouter();

  const navLinksKeys: NavLink[] = [
    { href: "/", key: "nav.home" },
    { href: "/sports", key: "nav.sports" },
    { href: "/coaches", key: "nav.coaches" },
    { href: "/ai-analyzer", key: "nav.aiAnalyzer" },
    { href: "/about-us", key: "nav.about" },
    { href: "/contact-us", key: "nav.contact" },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const checkUser = () => {
      if (typeof window !== "undefined") {
        const name = localStorage.getItem("userName");
        const role = localStorage.getItem("role");
        setUserName(name || null);
        setUserRole(role || null);
      }
    };
    checkUser();
    window.addEventListener("storage_updated", checkUser);
    window.addEventListener("storage", checkUser);
    return () => {
      window.removeEventListener("storage_updated", checkUser);
      window.removeEventListener("storage", checkUser);
    };
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
      localStorage.removeItem("role");
      setUserName(null);
      setUserRole(null);
      router.push("/");
    }
  };

  return (
    <nav
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out backdrop-blur-xl border-b border-red-900/40 ${
        isScrolled
          ? "py-3 shadow-[0_8px_30px_rgba(0,0,0,0.6)] bg-black/95"
          : "py-5 bg-black/70"
      }`}
    >
      <div className="max-w-[1400px] w-full mx-auto px-4 lg:px-6 flex justify-between items-center gap-4">
        
        {/* 1. Logo */}
        <div className="flex-shrink-0 cursor-pointer hover:scale-105 transition-transform duration-300">
          <Link href="/">
            <img src="/assets/logo.png" alt="Logo" className="w-28 lg:w-32 h-auto object-contain" />
          </Link>
        </div>

        {/* 2. Middle Navigation Links */}
        <div 
          className={`flex-grow flex justify-center transition-all duration-500 ease-in-out ${
            isMenuOpen 
              ? "absolute top-full left-0 right-0 bg-black/95 flex-col p-6 gap-6 max-h-[80vh] overflow-y-auto border-t border-red-900/40 backdrop-blur-3xl shadow-2xl" 
              : "hidden lg:flex"
          }`}
        >
          <ul className={`flex ${isMenuOpen ? "flex-col w-full text-center gap-6" : "flex-row gap-6 xl:gap-8"} list-none items-center`}>
            {navLinksKeys.map((link, index) => (
              <li key={index}>
                <Link
                  onClick={() => setIsMenuOpen(false)}
                  href={link.href as any}
                  className="text-white text-sm font-semibold relative py-2 transition-all duration-300 hover:text-red-500 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-red-600 after:transition-all after:duration-500 hover:after:w-full"
                >
                  {t(link.key)}
                </Link>
              </li>
            ))}
            
            {/* Mobile Auth Buttons */}
            {isMenuOpen && (
              <li className="mt-4 border-t border-red-900/40 pt-6 w-full flex justify-center">
                <AuthSection userName={userName} userRole={userRole} lang={lang} t={t} onLogout={handleLogout} />
              </li>
            )}
          </ul>
        </div>

        {/* 3. Actions Toolbar */}
        <div className="flex flex-shrink-0 items-center justify-end gap-3 lg:gap-5">
          
          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center">
            <AuthSection userName={userName} userRole={userRole} lang={lang} t={t} onLogout={handleLogout} />
          </div>

          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Hamburger */}
          <button
            className="lg:hidden flex flex-col gap-1.5 cursor-pointer p-2 z-50 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className={`w-7 h-0.5 bg-white rounded transition-all duration-300 ${isMenuOpen ? "rotate-45 translate-y-2" : ""}`}></span>
            <span className={`w-7 h-0.5 bg-white rounded transition-all duration-300 ${isMenuOpen ? "opacity-0" : ""}`}></span>
            <span className={`w-7 h-0.5 bg-white rounded transition-all duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}></span>
          </button>
        </div>

      </div>
    </nav>
  );
};

const AuthSection = ({ userName, userRole, lang, t, onLogout }: { userName: string | null, userRole: string | null, lang: string, t: any, onLogout: () => void }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (userName) {
    return (
      <div className="flex items-center gap-3">
        {/* Admin Panel Button */}
        {userRole === 'admin' && (
          <Link
            href="/admin"
            className="px-4 py-2 rounded-full font-bold text-sm bg-gradient-to-r from-purple-700 to-purple-500 text-white shadow-lg shadow-purple-900/30 hover:scale-105 transition-all"
          >
            {t("nav.adminPanel")}
          </Link>
        )}

        {/* User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm bg-white text-black hover:bg-gray-200 transition-colors shadow-lg"
          >
            <div className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center text-xs">👤</div>
            <span className="truncate max-w-[120px]">{userName}</span>
            <span className="text-xs opacity-50">▼</span>
          </button>

          {dropdownOpen && (
            <div className={`absolute top-full mt-2 w-48 bg-[#0a0a0a] border border-red-900/50 rounded-xl shadow-2xl overflow-hidden z-50 ${lang === 'ar' ? 'left-0' : 'right-0'}`}>
              <div className="flex flex-col py-1">
                <Link 
                  href={"/dashboard" as any}
                  onClick={() => setDropdownOpen(false)}
                  className="px-4 py-3 text-sm text-white/80 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-2"
                >
                  <span>🧑‍💻</span> {t("nav.profile")}
                </Link>
                <Link 
                  href={"/my-bookings" as any}
                  onClick={() => setDropdownOpen(false)}
                  className="px-4 py-3 text-sm text-white/80 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-2"
                >
                  <span>📋</span> {t("nav.myBookings")}
                </Link>
                <div className="h-px bg-white/10 my-1 font-bold"></div>
                <button 
                  onClick={() => {
                    setDropdownOpen(false);
                    onLogout();
                  }}
                  className="px-4 py-3 text-sm text-red-500 hover:text-red-400 hover:bg-red-950/30 text-left transition-colors flex items-center gap-2 font-bold w-full"
                >
                  <span>🚪</span> {t("nav.logout")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 xl:gap-3">
      <Link 
        href="/auth" 
        className="inline-block px-4 py-2 rounded-full font-bold text-sm bg-transparent text-white border border-white/40 hover:border-red-600 hover:text-red-500 hover:-translate-y-0.5 transition-all duration-300"
      >
        {t("nav.login")}
      </Link>
      <Link 
        href="/auth" 
        className="inline-block px-4 py-2 rounded-full font-bold text-sm bg-gradient-to-r from-red-700 to-red-600 text-white shadow-lg shadow-red-900/30 hover:scale-105 transition-all duration-300"
      >
        {t("nav.signup")}
      </Link>
    </div>
  );
};

export default Navbar;