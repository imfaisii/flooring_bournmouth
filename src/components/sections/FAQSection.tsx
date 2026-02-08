"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { faqItems } from "@/lib/constants/faq";
import { cn } from "@/lib/utils/cn";

export function FAQSection() {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section
      id="faq"
      className="py-16 lg:py-24 bg-dark-bg relative overflow-hidden"
    >
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />

      <Container className="relative z-10">
        <SectionHeading
          title="Frequently Asked Questions"
          subtitle="Find answers to common questions about our flooring services in Bournemouth. Can't find what you're looking for? Contact us directly."
        />

        <div className="max-w-3xl mx-auto space-y-4">
          {faqItems.map((item) => (
            <div
              key={item.id}
              className={cn(
                "group bg-white/5 backdrop-blur-sm rounded-xl border transition-all duration-300",
                openId === item.id
                  ? "border-accent/50 shadow-[0_0_20px_rgba(230,170,104,0.15)]"
                  : "border-white/10 hover:border-white/20"
              )}
            >
              <button
                onClick={() => toggle(item.id)}
                className="w-full flex items-center justify-between p-5 sm:p-6 text-left gap-4"
                aria-expanded={openId === item.id}
                aria-controls={`faq-answer-${item.id}`}
              >
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  <div
                    className={cn(
                      "w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300",
                      openId === item.id ? "bg-accent/20" : "bg-white/5"
                    )}
                  >
                    <HelpCircle
                      className={cn(
                        "w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-300",
                        openId === item.id ? "text-accent" : "text-neutral-400"
                      )}
                    />
                  </div>
                  <span
                    className={cn(
                      "text-base sm:text-lg font-medium transition-colors duration-300",
                      openId === item.id ? "text-white" : "text-neutral-200"
                    )}
                  >
                    {item.question}
                  </span>
                </div>
                <ChevronDown
                  className={cn(
                    "w-5 h-5 text-neutral-400 transition-transform duration-300 shrink-0",
                    openId === item.id && "rotate-180 text-accent"
                  )}
                />
              </button>

              <div
                id={`faq-answer-${item.id}`}
                className={cn(
                  "overflow-hidden transition-all duration-300 ease-in-out",
                  openId === item.id
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                )}
              >
                <div className="px-5 sm:px-6 pb-5 sm:pb-6 pl-[4.25rem] sm:pl-[4.5rem] text-neutral-400 leading-relaxed">
                  {item.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <p className="text-neutral-400 mb-4">
            Still have questions about flooring in Bournemouth?
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 text-accent hover:text-accent-light transition-colors font-medium"
          >
            Contact our team
            <ChevronDown className="w-4 h-4 -rotate-90" />
          </a>
        </div>
      </Container>
    </section>
  );
}
