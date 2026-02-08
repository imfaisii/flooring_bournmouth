import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ContactForm } from "@/components/forms/ContactForm";
import { companyInfo } from "@/lib/constants/company";

// Enable ISR with 2-hour revalidation (static contact info)
export const revalidate = 7200; // Revalidate every 2 hours

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Flooring Bournemouth for a free quote. Call us, email us, or fill out our contact form for expert flooring advice.",
};

const contactDetails = [
  {
    icon: Phone,
    label: "Phone",
    value: companyInfo.phone,
    href: `tel:${companyInfo.phone}`,
  },
  {
    icon: Mail,
    label: "Email",
    value: companyInfo.email,
    href: `mailto:${companyInfo.email}`,
  },
  {
    icon: MapPin,
    label: "Address",
    value: companyInfo.address.full,
    href: null,
  },
];

export default function ContactPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-primary-dark text-white py-16 lg:py-20">
        <Container>
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Get In <span className="text-secondary">Touch</span>
            </h1>
            <p className="text-lg text-neutral-300 leading-relaxed">
              Ready to transform your floors? Contact us for a free,
              no-obligation quote. We&apos;d love to hear about your project.
            </p>
          </div>
        </Container>
      </section>

      {/* Contact Content */}
      <section className="py-16 lg:py-24">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-primary-dark mb-6">
                Send Us a Message
              </h2>
              <ContactForm />
            </div>

            {/* Sidebar */}
            <div>
              <h2 className="text-2xl font-bold text-primary-dark mb-6">
                Contact Details
              </h2>

              <div className="space-y-6 mb-8">
                {contactDetails.map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-500">
                        {item.label}
                      </p>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="text-primary-dark font-semibold hover:text-primary transition-colors"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-primary-dark font-semibold">
                          {item.value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Business Hours */}
              <div className="bg-neutral-50 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-primary-dark">
                    Business Hours
                  </h3>
                </div>
                <div className="space-y-2">
                  {companyInfo.hours.map((h) => (
                    <div
                      key={h.day}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-neutral-600">{h.day}</span>
                      <span className="font-medium text-primary-dark">
                        {h.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
