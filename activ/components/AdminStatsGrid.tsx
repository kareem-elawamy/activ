'use client';
import ar from "../messages/ar.json";
import en from "../messages/en.json";

interface StatsGridProps {
  lang?: "ar" | "en"; // الافتراضي: "en"
}

export default function StatsGrid({ lang = "en" }: StatsGridProps) {
  const texts = lang === "ar" ? ar.statsGrid : en.statsGrid;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {texts.stats.map((stat, i) => (
        <div
          key={i}
          className="bg-black border-b-4 border-red-600 p-6 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.7)] hover:scale-105 transition-all duration-300"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-white/60 text-sm uppercase tracking-wide">{stat.label}</p>
              <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
            </div>
            <span className="text-3xl">{stat.icon}</span>
          </div>
        </div>
      ))}
    </div>
  );
}