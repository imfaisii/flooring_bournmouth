"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { navLinks } from "@/lib/constants/navigation";
import { MobileMenu } from "./MobileMenu";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled
        ? "bg-dark-bg/80 backdrop-blur-md border-b border-white/5 py-4"
        : "bg-transparent py-6"
        }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo - Matches "QCF" text from design */}
          <Link href="/" className="group relative z-50 flex items-center gap-2">
            <div className="relative w-12 h-12">
              <Image
                src="/flooring_bournmouth_logo.png"
                alt="Flooring Bournmouth Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="font-heading text-xl lg:text-2xl font-bold text-white tracking-widest group-hover:text-shadow-glow transition-all duration-300">
              Flooring Bournmouth
            </span>
          </Link>

          {/* Desktop Navigation - Centered */}
          <div className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-neutral-300 hover:text-accent transition-all duration-300 uppercase tracking-wide relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          {/* CTA Button - "Get a Quote" with glowing border */}
          <div className="hidden lg:block">
            <Link
              href="/#quote"
              className="px-6 py-2 bg-transparent border border-accent/50 text-accent hover:bg-accent/10 hover:border-accent hover:shadow-[0_0_20px_rgba(230,170,104,0.4)] rounded-full transition-all duration-300 transform hover:-translate-y-0.5 font-medium text-sm tracking-wide"
            >
              Get a Quote
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-neutral-300 hover:text-white"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </header>
  );
}
