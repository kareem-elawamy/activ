'use client';

import React from 'react';

interface EmptyStateProps {
  icon?: string | React.ReactNode;
  title?: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({ icon = '📭', title, message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 lg:p-20 text-center w-full bg-white/[0.02] border border-white/5 rounded-3xl animate-fadeIn">
      <div className="text-6xl mb-6 opacity-60">
        {icon}
      </div>
      
      {title && (
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      )}
      
      <p className="text-white/40 max-w-sm mx-auto leading-relaxed text-sm md:text-base">
        {message}
      </p>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-8 px-6 py-2.5 bg-white/10 hover:bg-white/15 border border-white/10 rounded-full text-white text-sm font-semibold transition-all duration-300 hover:text-red-400 focus:ring-2 focus:ring-red-500/50"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
