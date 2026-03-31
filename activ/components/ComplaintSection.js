"use client";

import { useState } from "react";
import axios from "axios";

export default function ComplaintSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("/api/complaints", formData);
      setSuccess(true);
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Error submitting complaint", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-black py-20 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-10">
        
        <h2 className="text-3xl font-bold text-center text-black mb-3">
          Submit a Complaint
        </h2>

        <p className="text-center text-gray-600 mb-8 text-sm">
          If you faced any issue, please let us know and our team will contact you.
        </p>

        {success && (
          <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-6 text-sm text-center">
            Complaint sent successfully.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <label className="block text-sm font-medium mb-2 text-black">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 
                         focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-black">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 
                         focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-black">
              Complaint Details
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="4"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 
                         focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition"
              placeholder="Describe your issue..."
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold 
                       hover:bg-red-700 transition duration-300"
          >
            {loading ? "Sending..." : "Send Complaint"}
          </button>

        </form>
      </div>
    </section>
  );
}