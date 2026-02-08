"use client";

import { Menu } from "lucide-react";

interface AdminHeaderProps {
  onMenuClick: () => void;
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  return (
    <header className="bg-dark-bg/95 backdrop-blur-md border-b border-white/10 sticky top-0 z-30 h-20">
      <div className="flex items-center justify-between px-4 lg:px-8 h-full">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="hidden sm:block">
            <h1 className="text-xl font-heading font-bold text-white tracking-wide">Overview</h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-neutral-200">Admin User</p>
            <p className="text-xs text-accent">Administrator</p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-accent to-secondary rounded-full flex items-center justify-center text-dark-bg font-bold shadow-[0_0_15px_rgba(230,170,104,0.4)] border border-white/20">
            A
          </div>
        </div>
      </div>
    </header>
  );
}
