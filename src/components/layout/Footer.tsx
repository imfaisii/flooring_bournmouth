import Link from "next/link";
import { Phone, Mail, MapPin, Clock, Facebook, Instagram } from "lucide-react";
import { companyInfo } from "@/lib/constants/company";
import { services } from "@/lib/constants/services";
import { siteConfig } from "@/lib/config/site";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-dark text-neutral-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div>
            <div className="mb-4">
              <span className="font-heading text-xl font-bold text-white">
                Bournemouth
              </span>
              <span className="font-heading text-xl font-bold text-secondary">
                {" "}
                Flooring
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-6">
              Professional flooring installation and supply services across
              Bournemouth and the surrounding Dorset area. Quality materials,
              expert fitting, guaranteed satisfaction.
            </p>
            <div className="flex gap-3">
              <a
                href={siteConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Our Services */}
          <div>
            <h3 className="text-white font-heading font-semibold text-lg mb-4">
              Our Services
            </h3>
            <ul className="space-y-2.5">
              {services.map((service) => (
                <li key={service.id}>
                  <span className="text-sm hover:text-secondary-light transition-colors cursor-default">
                    {service.title}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-heading font-semibold text-lg mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/"
                  className="text-sm hover:text-secondary-light transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/#services"
                  className="text-sm hover:text-secondary-light transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/#projects"
                  className="text-sm hover:text-secondary-light transition-colors"
                >
                  Gallery
                </Link>
              </li>
              <li>
                <Link
                  href="/#testimonials"
                  className="text-sm hover:text-secondary-light transition-colors"
                >
                  Testimonials
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm hover:text-secondary-light transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-heading font-semibold text-lg mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={`tel:${companyInfo.phone}`}
                  className="flex items-start gap-2.5 text-sm hover:text-secondary-light transition-colors"
                >
                  <Phone className="w-4 h-4 mt-0.5 shrink-0" />
                  {companyInfo.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${companyInfo.email}`}
                  className="flex items-start gap-2.5 text-sm hover:text-secondary-light transition-colors"
                >
                  <Mail className="w-4 h-4 mt-0.5 shrink-0" />
                  {companyInfo.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                {companyInfo.address.full}
              </li>
              <li className="flex items-start gap-2.5 text-sm">
                <Clock className="w-4 h-4 mt-0.5 shrink-0" />
                <div>
                  {companyInfo.hours.map((h) => (
                    <div key={h.day}>
                      {h.day}: {h.time}
                    </div>
                  ))}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-neutral-400">
            <p>
              &copy; {currentYear} {companyInfo.name}. All rights reserved.
            </p>
            <p>Professional Flooring Services in Bournemouth, Dorset</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
