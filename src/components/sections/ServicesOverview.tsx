import {
  TreeDeciduous,
  Layers,
  LayoutGrid,
  Droplets,
  Grid3X3,
  Scissors,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { services } from "@/lib/constants/services";

const iconMap: Record<string, React.ElementType> = {
  TreeDeciduous,
  Layers,
  LayoutGrid,
  Droplets,
  Grid3X3,
  Scissors,
};

export function ServicesOverview() {
  return (
    <section id="services" className="py-16 lg:py-24 bg-dark-bg">
      <Container>
        <SectionHeading
          title="Our Flooring Services"
          subtitle="From classic hardwood to modern luxury vinyl, we offer a complete range of flooring solutions for every room and budget."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const Icon = iconMap[service.icon] || LayoutGrid;

            return (
              <Card key={service.id} hover className="p-8 group">
                <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-6 group-hover:border-accent/50 transition-colors">
                  <Icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-accent transition-colors">
                  {service.title}
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                  {service.description}
                </p>
                <ul className="space-y-3">
                  {service.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-3 text-sm text-neutral-300"
                    >
                      <span className="w-1.5 h-1.5 bg-accent rounded-full shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
