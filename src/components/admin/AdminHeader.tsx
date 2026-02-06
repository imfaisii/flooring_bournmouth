"use client";

import { Menu } from "lucide-react";

interface AdminHeaderProps {
  onMenuClick: () => void;
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 lg:px-8 h-16">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-6 h-6 text-neutral-600" />
          </button>

          <div className="hidden sm:block">
            <h1 className="text-xl font-bold text-primary-dark">Dashboard</h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-neutral-700">Admin User</p>
            <p className="text-xs text-neutral-500">Administrator</p>
          </div>
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
            A
          </div>
        </div>
      </div>
    </header>
  );
}
