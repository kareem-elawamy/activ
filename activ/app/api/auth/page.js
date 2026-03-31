'use client';

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import api from "@/utils/api";

export default function Auth() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("login");

  const switchTab = (tab) => setActiveTab(tab);

  const handleLogin = async (e) => {
    e.preventDefault();
    const formData = {
      email: e.target.email.value,
      password: e.target.password.value,
    };

    try {
      const res = await api.post("/auth/login", formData);
      const token = res.data.token;
      const name = res.data.name || (res.data.user && res.data.user.name);

      if (token && name) {
        localStorage.setItem("token", token);
        localStorage.setItem("userName", name);
        window.dispatchEvent(new Event("storage_updated"));
        router.push("/dashboard");
      } else alert("Login successful but missing user data.");
    } catch (err) {
      console.error("Login Error:", err);
      const msg = err?.response?.data?.message || err?.message || "Login failed";
      alert(msg);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const nameInput = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirm = e.target.confirm.value;

    if (password !== confirm) {
      alert("Passwords do not match");
      return;
    }

    const formData = { name: nameInput, email, password };

    try {
      const res = await api.post("/auth/register", formData);
      const token = res.data.token;
      const nameToSave = res.data.name || (res.data.user && res.data.user.name) || nameInput;

      localStorage.setItem("token", token);
      localStorage.setItem("userName", nameToSave);
      window.dispatchEvent(new Event("storage_updated"));
      router.push("/dashboard");
    } catch (err) {
      console.error("Registration Error:", err);
      const msg = err?.response?.data?.message || err?.message || "Registration failed";
      alert(msg);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Left Side */}
      <div className="flex-1 flex flex-col justify-center p-8 sm:p-16 bg-white">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform duration-300">
          <Image src="/assets/logo.png" alt="Logo" width={140} height={80} />
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-black text-black mb-2">
          {activeTab === "login" ? "Welcome Back!" : "Join Our Academy Today!"}
        </h1>
        <p className="text-gray-600 mb-10 text-sm sm:text-base">
          {activeTab === "login"
            ? "Sign in to continue your journey to greatness"
            : "Create an account to unlock your potential"}
        </p>

        {/* Tabs */}
        <div className="flex gap-5 border-b-2 border-gray-200 mb-8">
          <button
            className={`pb-3 font-semibold transition-colors ${
              activeTab === "login"
                ? "text-pomegranate border-b-2 border-pomegranate"
                : "text-gray-400"
            }`}
            onClick={() => switchTab("login")}
          >
            Login
          </button>
          <button
            className={`pb-3 font-semibold transition-colors ${
              activeTab === "register"
                ? "text-pomegranate border-b-2 border-pomegranate"
                : "text-gray-400"
            }`}
            onClick={() => switchTab("register")}
          >
            Register
          </button>
        </div>

        {/* Forms */}
        {activeTab === "login" ? (
          <form onSubmit={handleLogin} className="space-y-6">
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-pomegranate focus:ring-1 focus:ring-pomegranate"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-pomegranate focus:ring-1 focus:ring-pomegranate"
              required
            />
            <div className="text-right">
              <a href="#" className="text-gray-400 text-sm hover:text-pomegranate">
                Forgot password?
              </a>
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-pomegranate text-white font-semibold rounded-lg hover:bg-red-700 shadow-lg hover:scale-105 transition-all"
            >
              Sign In
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-pomegranate focus:ring-1 focus:ring-pomegranate"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-pomegranate focus:ring-1 focus:ring-pomegranate"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-pomegranate focus:ring-1 focus:ring-pomegranate"
              required
            />
            <input
              type="password"
              name="confirm"
              placeholder="Confirm Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-pomegranate focus:ring-1 focus:ring-pomegranate"
              required
            />
            <button
              type="submit"
              className="w-full py-3 mt-2 bg-pomegranate text-white font-semibold rounded-lg hover:bg-red-700 shadow-lg hover:scale-105 transition-all"
            >
              Create Account
            </button>
          </form>
        )}
      </div>

      {/* Right Side Video */}
      <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-gray-800/90 to-pomegranate/80 items-center justify-center text-white p-16">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        >
          <source src="/assets/one.mp4" type="video/mp4" />
        </video>
        <div className="text-center max-w-md z-10">
          <h2 className="text-4xl sm:text-5xl font-black mb-5">
            Unlock the Potential of Your Little Champion!
          </h2>
        </div>
      </div>
    </div>
  );
}