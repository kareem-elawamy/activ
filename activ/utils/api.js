import axios from "axios";

// إنشاء instance جاهز لكل requests
const api = axios.create({
  baseURL: "http://localhost:5000/api", // ال base URL للـ backend
  headers: {
    "Content-Type": "application/json",
  },
});

// إضافة Authorization header تلقائي لو فيه توكن محفوظ
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // التوكن المخزن
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
