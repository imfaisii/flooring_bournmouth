import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { QuoteForm } from "@/components/sections/QuoteForm";
import { Phone, Mail, Clock, MapPin } from "lucide-react";
import { companyInfo } from "@/lib/constants/company";

export const metadata: Metadata = {
  title: "Get a Free Quote",
  description:
    "Request a free, no-obligation quote for your flooring project. Fast response within 24 hours from Flooring Bournemouth.",
};

export default function QuotePage() {
  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-glow/5 rounded-full blur-[120px]" />
        </div>

        <Container className="relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 font-heading">
              Get Your <span className="text-accent">Free Quote</span>
            </h1>
            <p className="text-lg lg:text-xl text-neutral-400 leading-relaxed">
              Transform your space with premium flooring. Request a personalized
              quote and our expert team will be in touch within 24 hours.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Quote Form */}
            <div className="lg:col-span-2">
              <QuoteForm />
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              {/* Contact Info Card */}
              <div className="bg-dark-card border border-white/10 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-6 font-heading">
                  Contact Information
                </h3>

                <div className="space-y-5">
                  <a
                    href={`tel:${companyInfo.phone}`}
                    className="flex items-start gap-4 group"
                  >
                    <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
                      <Phone className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500 mb-1">Phone</p>
                      <p className="text-white font-semibold group-hover:text-accent transition-colors">
                        {companyInfo.phone}
                      </p>
                    </div>
                  </a>

                  <a
                    href={`mailto:${companyInfo.email}`}
                    className="flex items-start gap-4 group"
                  >
                    <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
                      <Mail className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500 mb-1">Email</p>
                      <p className="text-white font-semibold group-hover:text-accent transition-colors break-all">
                        {companyInfo.email}
                      </p>
                    </div>
                  </a>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500 mb-1">Address</p>
                      <p className="text-white font-medium leading-relaxed">
                        {companyInfo.address.full}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Hours Card */}
              <div className="bg-gradient-to-br from-accent/10 to-glow/5 border border-accent/20 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Clock className="w-6 h-6 text-accent" />
                  <h3 className="text-lg font-bold text-white font-heading">
                    Business Hours
                  </h3>
                </div>

                <div className="space-y-3">
                  {companyInfo.hours.map((h) => (
                    <div
                      key={h.day}
                      className="flex justify-between items-center text-sm"
                    >
                      <span className="text-neutral-400">{h.day}</span>
                      <span className="font-semibold text-white">{h.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Why Choose Us */}
              <div className="bg-dark-card border border-white/10 rounded-2xl p-8">
                <h3 className="text-lg font-bold text-white mb-4 font-heading">
                  Why Choose Us?
                </h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2 text-neutral-300">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                    Free home consultations
                  </li>
                  <li className="flex items-center gap-2 text-neutral-300">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                    Expert installation team
                  </li>
                  <li className="flex items-center gap-2 text-neutral-300">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                    Premium quality materials
                  </li>
                  <li className="flex items-center gap-2 text-neutral-300">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                    Competitive pricing
                  </li>
                  <li className="flex items-center gap-2 text-neutral-300">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                    Satisfaction guaranteed
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
