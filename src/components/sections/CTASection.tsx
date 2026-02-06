import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { companyInfo } from "@/lib/constants/company";

export function CTASection() {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-dark-card to-black text-white relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 50%, rgba(230, 170, 104, 0.15) 0%, transparent 60%)",
          }}
        />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 font-heading">
          Ready to Transform <span className="text-accent">Your Space?</span>
        </h2>
        <p className="text-lg text-neutral-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          Get in touch today for a free, no-obligation estimate. Whether
          it&apos;s a single room or an entire property, we&apos;re here to
          help.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/#quote"
            className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-light text-dark-bg px-10 py-5 rounded-full font-bold text-lg transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(230,170,104,0.4)]"
          >
            Request a Free Quote
            <ArrowRight className="w-5 h-5" />
          </Link>
          <a
            href={`tel:${companyInfo.phone}`}
            className="inline-flex items-center justify-center gap-2 border border-white/20 hover:border-white hover:bg-white/5 px-10 py-5 rounded-full font-semibold text-lg transition-colors"
          >
            <Phone className="w-5 h-5" />
            {companyInfo.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
