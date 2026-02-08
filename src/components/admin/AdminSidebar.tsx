"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageSquare, Users, LogOut, X, ChevronLeft, ChevronRight, LayoutDashboard } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/leads", label: "All Leads", icon: Users },
];

export function AdminSidebar({ isOpen, onClose, isCollapsed, onToggleCollapse }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen bg-dark-bg border-r border-white/10 text-white transition-all duration-300 ease-in-out lg:static",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          isCollapsed ? "w-20" : "w-72"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className={cn(
            "flex items-center p-6 border-b border-white/10 h-20",
            isCollapsed ? "justify-center" : "justify-between"
          )}>
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="relative w-8 h-8 shrink-0">
                <Image src="/flooring_bournmouth_logo.png" alt="Logo" fill className="object-contain" />
              </div>
              {!isCollapsed && (
                <div className="whitespace-nowrap transition-opacity duration-300">
                  <h2 className="font-heading text-lg font-bold">Admin Panel</h2>
                  <p className="text-[10px] text-neutral-400 uppercase tracking-wider">
                    Flooring Bournmouth
                  </p>
                </div>
              )}
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="lg:hidden p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={isCollapsed ? item.label : ""}
                  onClick={() => {
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-xl font-medium transition-all duration-200 group relative",
                    isActive
                      ? "bg-gradient-to-r from-accent/20 to-transparent text-accent border border-accent/20"
                      : "text-neutral-400 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <Icon className={cn("w-5 h-5 shrink-0 transition-colors", isActive ? "text-accent" : "group-hover:text-white")} />
                  {!isCollapsed && (
                    <span className="whitespace-nowrap">{item.label}</span>
                  )}

                  {/* Active Indicator */}
                  {isActive && !isCollapsed && (
                    <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_10px_rgba(230,170,104,0.8)]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer / User / Toggle */}
          <div className="p-4 border-t border-white/10 space-y-4">

            {/* Desktop Collapse Toggle */}
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex w-full items-center justify-center p-2 rounded-lg text-neutral-500 hover:bg-white/5 hover:text-white transition-colors"
            >
              {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <div className="flex items-center gap-2"><ChevronLeft className="w-4 h-4" /> <span className="text-xs">Collapse Sidebar</span></div>}
            </button>

            <div className="pt-2 border-t border-white/5 space-y-1">
              <button
                onClick={async () => {
                  await fetch('/api/auth/logout', { method: 'POST' })
                  window.location.href = '/admin/login'
                }}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm text-neutral-400 hover:bg-red-500/10 hover:text-red-400 transition-colors",
                  isCollapsed && "justify-center"
                )}
                title="Logout"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span>Logout</span>}
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
