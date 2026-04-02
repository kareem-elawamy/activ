'use client';

export default function ActivityCardSkeleton() {
  return (
    <div className="group bg-[#0d0d0d] rounded-3xl overflow-hidden border border-red-900/10 shadow-lg relative animate-pulse">
      {/* Image Skeleton */}
      <div className="w-full h-64 bg-white/5 relative overflow-hidden">
        {/* Shimmer effect overlay */}
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        
        {/* Badge Skeletons */}
        <div className="absolute top-4 left-4 w-20 h-6 bg-white/10 rounded-full"></div>
        <div className="absolute top-4 right-4 w-12 h-6 bg-white/10 rounded-full"></div>
      </div>

      {/* Content Skeleton */}
      <div className="p-6">
        {/* Category & Rating */}
        <div className="flex justify-between items-center mb-4">
          <div className="w-24 h-4 bg-red-900/20 rounded-md"></div>
          <div className="w-12 h-4 bg-white/10 rounded-md"></div>
        </div>

        {/* Title */}
        <div className="w-3/4 h-7 bg-white/10 rounded-lg mb-4"></div>

        {/* Schedule */}
        <div className="space-y-2 mb-6">
          <div className="w-full h-3 bg-white/5 rounded-md"></div>
          <div className="w-5/6 h-3 bg-white/5 rounded-md"></div>
        </div>

        {/* Price & Action */}
        <div className="pt-4 border-t border-red-900/20 flex justify-between items-center">
          <div>
            <div className="w-10 h-3 bg-white/5 rounded-md mb-1"></div>
            <div className="w-20 h-5 bg-white/10 rounded-md"></div>
          </div>
          <div className="w-24 h-10 bg-red-900/20 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
}

// Reusable list item skeleton (e.g. for bookings)
export function BookingRowSkeleton() {
  return (
    <div className="bg-white/[0.02] border border-white/5 p-5 pr-8 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-pulse mb-4">
      {/* Left side info */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-red-900/20 rounded-xl"></div>
        <div className="space-y-2">
          <div className="w-32 h-5 bg-white/10 rounded-md"></div>
          <div className="w-24 h-3 bg-white/5 rounded-md"></div>
        </div>
      </div>
      
      {/* Right side status */}
      <div className="flex items-center gap-8 w-full md:w-auto mt-2 md:mt-0 pt-2 md:pt-0 border-t border-white/10 md:border-none">
        <div className="w-20 h-4 bg-white/10 rounded-md"></div>
        <div className="w-16 h-6 bg-white/5 rounded-full"></div>
      </div>
    </div>
  );
}
