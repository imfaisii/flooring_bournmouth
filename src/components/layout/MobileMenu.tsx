"use client";

import Link from "next/link";
import { Phone } from "lucide-react";
import { navLinks } from "@/lib/constants/navigation";
import { companyInfo } from "@/lib/constants/company";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="lg:hidden border-t border-white/10 bg-dark-bg/95 backdrop-blur-xl">
      <div className="px-4 py-4 space-y-1">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            className="block px-4 py-3 text-neutral-300 hover:bg-white/5 hover:text-accent rounded-lg font-medium transition-colors"
          >
            {link.label}
          </Link>
        ))}
        <div className="pt-4 space-y-3">
          <Link
            href="/#quote"
            onClick={onClose}
            className="block text-center bg-accent hover:bg-accent-light text-dark-bg px-6 py-3 rounded-lg font-bold transition-colors"
          >
            Get Free Quote
          </Link>
          <a
            href={`tel:${companyInfo.phone}`}
            className="flex items-center justify-center gap-2 text-white hover:text-accent font-medium transition-colors"
          >
            <Phone className="w-4 h-4" />
            {companyInfo.phone}
          </a>
        </div>
      </div>
    </div>
  );
}
