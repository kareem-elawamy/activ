'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "../hooks/useTranslation";

interface NavLink {
  href: string;
  key: string;
}

const Navbar = () => {
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const router = useRouter();

  const navLinksKeys: NavLink[] = [
    { href: "/", key: "nav.home" },
    { href: "/about-us", key: "nav.about" },
    { href: "/sports", key: "nav.sports" },
    { href: "/payment", key: "nav.book" },
    { href: "/my-bookings", key: "nav.myBookings" },
    { href: "/testimonials", key: "nav.testimonials" },
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
        setUserName(name || null);
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
      setUserName(null);
      router.push("/");
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out backdrop-blur-xl border-b border-red-900/40 ${
        isScrolled
          ? "py-2 shadow-[0_8px_30px_rgba(0,0,0,0.6)] bg-black/90"
          : "py-5 bg-black/70"
      } animate-slide-down`}
    >
      <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform duration-300">
          <img src="/assets/logo.png" alt="Logo" className="w-36 h-20 object-contain" />
        </div>

        {/* Nav Links */}
        <ul
          className={`flex gap-10 list-none items-center transition-all duration-500 ease-in-out ${
            isMenuOpen
              ? "flex-col absolute top-20 left-0 right-0 bg-black/95 backdrop-blur-xl p-8 gap-6 max-h-[calc(100vh-80px)] overflow-y-auto border-t border-red-900/40"
              : "hidden md:flex"
          }`}
        >
          {navLinksKeys.map((link, index) => (
            <li key={index}>
              <Link
                onClick={() => setIsMenuOpen(false)}
                href={link.href}
                className="text-white text-base font-semibold relative py-2 transition-all duration-300 hover:text-red-500 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-red-600 after:transition-all after:duration-500 hover:after:w-full"
              >
                {String(t(link.key) || link.key)}
              </Link>
            </li>
          ))}

          <li>
            <div className={`flex gap-4 items-center ${isMenuOpen ? "flex-col w-full" : ""}`}>
              {userName ? (
                <div className="flex gap-3 items-center">
                  <span className="px-6 py-3 rounded-full font-bold text-sm bg-white text-black shadow-lg">
                    {String(t("nav.hello").replace("{name}", userName))}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-6 py-3 rounded-full font-bold text-sm bg-gradient-to-r from-red-700 to-red-600 text-white shadow-lg hover:shadow-red-700/40 hover:-translate-y-1 hover:scale-105 transition-all duration-300"
                  >
                    {String(t("nav.logout"))}
                  </button>
                </div>
              ) : (
                <div className="flex gap-3 items-center">
                  <Link href="/auth">
                    <button className="px-6 py-3 rounded-full font-bold text-sm bg-transparent text-white border border-white/40 hover:border-red-600 hover:text-red-500 hover:-translate-y-1 transition-all duration-300">
                      {String(t("nav.login"))}
                    </button>
                  </Link>
                  <Link href="/auth">
                    <button className="px-6 py-3 rounded-full font-bold text-sm bg-gradient-to-r from-red-700 to-red-600 text-white shadow-lg hover:shadow-red-700/40 hover:-translate-y-1 hover:scale-105 transition-all duration-300">
                      {String(t("nav.signup"))}
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </li>
        </ul>

        {/* Mobile Toggle */}
        <div
          className="md:hidden flex flex-col gap-1 cursor-pointer p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span
            className={`w-7 h-0.5 bg-white rounded transition-all duration-300 ${isMenuOpen ? "rotate-45 translate-y-2" : ""}`}
          ></span>
          <span
            className={`w-7 h-0.5 bg-white rounded transition-all duration-300 ${isMenuOpen ? "opacity-0" : ""}`}
          ></span>
          <span
            className={`w-7 h-0.5 bg-white rounded transition-all duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}
          ></span>
        </div>

        <LanguageSwitcher />
      </div>
    </nav>
  );
};

export default Navbar;