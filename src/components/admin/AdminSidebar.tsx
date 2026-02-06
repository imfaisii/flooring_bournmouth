"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageSquare, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { href: "/admin", label: "Dashboard", icon: Home },
  { href: "/admin/contacts", label: "Contact Inquiries", icon: MessageSquare },
];

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-primary-dark text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="font-heading text-xl font-bold">Admin Panel</h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Flooring Bournemouth
            </p>
          </div>
          {/* Mobile Close Button */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  // Close sidebar on mobile after navigation
                  if (window.innerWidth < 1024) {
                    onClose();
                  }
                }}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors",
                  isActive
                    ? "bg-secondary text-primary-dark"
                    : "text-neutral-300 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm text-neutral-400 hover:text-white transition-colors"
          >
            <Home className="w-4 h-4" />
            Back to Website
          </Link>
        </div>
      </aside>
    </>
  );
}
