'use client';

import React from 'react';

interface EmptyStateProps {
  icon?: string | React.ReactNode;
  title?: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({ icon = <svg fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>, title, message, actionLabel, onAction }: EmptyStateProps) {
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
