import { Container } from "@/components/ui/Container";
import { companyInfo } from "@/lib/constants/company";

const stats = [
  {
    value: companyInfo.yearsInBusiness,
    suffix: "+",
    label: "Years Experience",
  },
  {
    value: companyInfo.projectsCompleted,
    suffix: "+",
    label: "Projects Completed",
  },
  {
    value: companyInfo.happyCustomers,
    suffix: "+",
    label: "Happy Customers",
  },
  {
    value: companyInfo.serviceAreas,
    suffix: "+",
    label: "Areas We Serve",
  },
];

export function StatsCounter() {
  return (
    <section className="py-12 lg:py-16 bg-dark-card border-y border-white/5 relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute inset-0 bg-accent/5 opacity-50" />

      <Container className="relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center group cursor-default">
              <div className="text-4xl sm:text-5xl font-bold text-white mb-2 group-hover:text-accent transition-colors font-heading">
                {stat.value.toLocaleString()}
                {stat.suffix}
              </div>
              <div className="text-neutral-400 text-sm font-medium tracking-wide">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
