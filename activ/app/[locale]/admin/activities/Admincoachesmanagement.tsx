'use client';

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

import en from "@/messages/en.json";
import ar from "@/messages/ar.json";

type Coach = {
  id: string;
  name: string;
  title: string;
  bio: string;
  image?: string;
  experience: string;
  students: string;
  rating: string;
  specialization: string;
};

type Props = {
  lang?: "en" | "ar";
};

export default function AdminCoachesManagement({ lang = "en" }: Props) {
  const t = lang === "ar" ? ar.admin : en.admin;

  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCoach, setEditingCoach] = useState<Coach | null>(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState<any>({
    name: "",
    title: "",
    bio: "",
    specialization: "football",
    image: null,
    experience: "",
    students: "",
    rating: "5.0",
  });

  const sports = [
    { id: 'football', name: 'Football', nameAr: 'كرة القدم' },
    { id: 'basketball', name: 'Basketball', nameAr: 'كرة السلة' },
    { id: 'swimming', name: 'Swimming', nameAr: 'سباحة' },
  ];

  useEffect(() => {
    fetchCoaches();
  }, []);

  const fetchCoaches = async () => {
    try {
      const res = await fetch("/api/coaches");
      const data = await res.json();
      setCoaches(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;

    await fetch(`/api/coaches/${id}`, { method: "DELETE" });
    fetchCoaches();
  };

  const handleEdit = (coach: Coach) => {
    setEditingCoach(coach);
    setFormData(coach);
    setShowModal(true);
  };

  return (
    <div className="space-y-6 bg-black min-h-screen text-white px-6 py-10">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">{t.title}</h2>
          <p className="text-red-400/80">{t.subtitle}</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => setShowModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl font-bold"
        >
          ➕ {t.add}
        </motion.button>
      </div>

      {/* Coaches */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {coaches.map((coach) => (
          <motion.div
            key={coach.id}
            className="bg-black border-2 border-red-500 rounded-3xl overflow-hidden"
          >

            {/* Image */}
            <div className="relative h-64">
              {coach.image ? (
                <Image src={coach.image} alt={coach.name} fill className="object-cover"/>
              ) : (
                <div className="flex items-center justify-center h-full text-6xl">👨‍🏫</div>
              )}
            </div>

            {/* Info */}
            <div className="p-6">
              <h3 className="text-xl font-bold">{coach.name}</h3>
              <p className="text-red-400">{coach.title}</p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 my-4 text-center">
                <div>
                  <p className="text-red-500 font-bold">{coach.experience}+</p>
                  <span className="text-xs">{t.years}</span>
                </div>
                <div>
                  <p className="text-red-500 font-bold">{coach.students}+</p>
                  <span className="text-xs">{t.students}</span>
                </div>
                <div>
                  <p className="text-red-500 font-bold">{coach.rating}</p>
                  <span className="text-xs">{t.rating}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(coach)}
                  className="flex-1 py-2 bg-red-500 rounded-lg"
                >
                  ✏️ {t.edit}
                </button>

                <button
                  onClick={() => handleDelete(coach.id)}
                  className="flex-1 py-2 bg-red-700 rounded-lg"
                >
                  🗑️ {t.delete}
                </button>
              </div>
            </div>
          </motion.div>
        ))}

      </div>

      {/* Empty */}
      {coaches.length === 0 && (
        <div className="text-center py-20">
          <h3 className="text-xl font-bold">{t.noCoaches}</h3>
          <p className="text-red-400">{t.noCoachesDesc}</p>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="bg-black p-8 rounded-2xl w-full max-w-xl"
            >
              <h3 className="text-xl mb-4">
                {editingCoach ? "Edit Coach" : "Add Coach"}
              </h3>

              <input
                placeholder="Name"
                className="w-full mb-3 p-2 bg-black border border-red-500 rounded"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />

              <button
                onClick={() => setShowModal(false)}
                className="mt-4 bg-red-600 px-4 py-2 rounded"
              >
                Save
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}