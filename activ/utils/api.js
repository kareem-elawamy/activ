import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: typeof window === 'undefined' ? (process.env.INTERNAL_API_URL || 'http://app:3000/api') : (process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api` : "http://localhost:3000/api"),
  headers: {
    "Content-Type": "application/json",
  },
});

// Auto-attach Authorization header
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Global Error Handler for 401 & 403
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined" && error.response) {
      const status = error.response.status;
      const lang = window.location.pathname.split("/")[1] === "ar" ? "ar" : "en";

      if (status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        localStorage.removeItem("role");

        const messages = lang === "ar" ? require("@/messages/ar.json") : require("@/messages/en.json");
        toast.error(messages.api.sessionExpired);
        setTimeout(() => {
          window.location.href = `/${lang}/auth`;
        }, 1500);
      }

      if (status === 403) {
        const messages = lang === "ar" ? require("@/messages/ar.json") : require("@/messages/en.json");
        toast.error(messages.api.accessDenied || "Access Denied");
        setTimeout(() => {
          window.location.href = `/${lang}/auth`;
        }, 1500);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
