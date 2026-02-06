import { Phone, Clock, Mail } from "lucide-react";
import { companyInfo } from "@/lib/constants/company";

export function TopBar() {
  return (
    <div className="bg-primary-dark text-white text-sm py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-4 sm:gap-6">
          <a
            href={`tel:${companyInfo.phone}`}
            className="flex items-center gap-1.5 hover:text-secondary-light transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>{companyInfo.phone}</span>
          </a>
          <a
            href={`mailto:${companyInfo.email}`}
            className="hidden sm:flex items-center gap-1.5 hover:text-secondary-light transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>{companyInfo.email}</span>
          </a>
        </div>
        <div className="hidden md:flex items-center gap-1.5 text-neutral-300">
          <Clock className="w-3.5 h-3.5" />
          <span>Mon-Fri: 8AM-6PM | Sat: 9AM-3PM</span>
        </div>
      </div>
    </div>
  );
}
