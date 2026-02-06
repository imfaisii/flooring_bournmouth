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

export default function HomePage() {
  return (
    <>
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
    </>
  );
}
