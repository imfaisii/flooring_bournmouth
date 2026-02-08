import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/HeroSection";
import { ServicesOverview } from "@/components/sections/ServicesOverview";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { StatsCounter } from "@/components/sections/StatsCounter";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { CTASection } from "@/components/sections/CTASection";
import { RoomVisualizer } from "@/components/sections/RoomVisualizer";
import { QuoteCalculator } from "@/components/sections/QuoteCalculator";
import { QuoteFormSection } from "@/components/sections/QuoteFormSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { JsonLd } from "@/components/seo/JsonLd";

// Enable ISR with 1-hour revalidation for instant cache hits
export const revalidate = 3600; // Revalidate every 1 hour

export const metadata: Metadata = {
  title: "Flooring Bournemouth | Expert Flooring Installation & Supply in Dorset",
  description:
    "Flooring Bournemouth - Professional flooring installation services in Bournemouth & Dorset. Hardwood, laminate, LVT, tile & carpet. 15+ years experience, 2,500+ projects completed. Get a free quote today!",
  keywords: [
    "flooring bournemouth",
    "flooring installation bournemouth",
    "carpet fitters bournemouth",
    "laminate flooring bournemouth",
    "hardwood flooring bournemouth",
    "lvt flooring bournemouth",
    "flooring company dorset",
    "flooring services poole",
  ],
  openGraph: {
    title: "Flooring Bournemouth | Expert Flooring Installation & Supply",
    description:
      "Professional flooring installation in Bournemouth. Hardwood, laminate, LVT, tile & carpet. 15+ years experience. Free quotes available.",
    type: "website",
    locale: "en_GB",
    images: [
      {
        url: "/images/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "Flooring Bournemouth - Professional Flooring Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Flooring Bournemouth | Expert Flooring Installation",
    description:
      "Professional flooring installation in Bournemouth & Dorset. Free quotes available.",
  },
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <>
      <JsonLd type="LocalBusiness" />
      <JsonLd type="FAQPage" />
      <HeroSection />
      <ProcessSteps />
      <ServicesOverview />
      <RoomVisualizer />
      <WhyChooseUs />
      <FeaturedProjects />
      <QuoteCalculator />
      <StatsCounter />
      <TestimonialsSection />
      <QuoteFormSection />
      <CTASection />
      <FAQSection />
    </>
  );
}
