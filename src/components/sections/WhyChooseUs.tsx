import { Shield, Award, Sparkles, Clock, CheckCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";

const features = [
  {
    icon: Sparkles,
    title: "Premium Materials",
    description: "Sourced globally, we provide only the finest hardwoods and luxury vinyls.",
  },
  {
    icon: Award,
    title: "Master Craftsmanship",
    description: "Our installers are artisans, ensuring every plank and tile is laid to perfection.",
  },
  {
    icon: Shield,
    title: "Lifetime Guarantee",
    description: "Confidence in quality. We stand firmly behind every square meter we install.",
  },
  {
    icon: Clock,
    title: "Efficient Precision",
    description: "We respect your home and schedule, delivering excellence without delay.",
  }
];

export function WhyChooseUs() {
  return (
    <section className="relative py-32 bg-[#050505] overflow-hidden">

      {/* Ambient Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px]" />
      </div>

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* Left Column: Heading and "Image" placeholder/Abstract Art */}
          <div className="space-y-10">
            <div>
              <h2 className="text-5xl md:text-7xl font-heading font-normal text-white leading-[0.9] tracking-tight">
                Why <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-secondary font-bold">
                  Bournemouth
                </span>
                <br />
                Flooring?
              </h2>
              <div className="h-2 w-24 bg-accent mt-8 rounded-full" />
            </div>

            <p className="text-lg text-neutral-400 font-light leading-loose max-w-md">
              We define luxury through precision. More than just floors, we install the foundation of your home's character with unyielding attention to detail.
            </p>

            {/* Abstract Visual Element / Statistic */}
            <div className="relative p-8 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative z-10">
                <div className="text-6xl font-heading font-bold text-white mb-2">15+</div>
                <div className="text-sm uppercase tracking-widest text-accent">Years of Excellence</div>
                <div className="mt-4 flex gap-2">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Sparkles key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500/20" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Feature Grid */}
          <div className="grid grid-cols-1 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="group relative flex items-start gap-6 p-8 rounded-xl bg-[#0a0a0a] border border-white/5 hover:border-accent/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]"
              >
                {/* Icon Box */}
                <div className="relative shrink-0 w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 border border-white/5 group-hover:border-accent/40">
                  <feature.icon className="w-7 h-7 text-neutral-400 group-hover:text-accent transition-colors duration-500" />
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-xl font-heading font-medium text-white mb-3 group-hover:text-accent transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-500 font-light leading-relaxed group-hover:text-neutral-300 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>

                {/* Corner Accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-accent/5 to-transparent rounded-tr-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            ))}
          </div>

        </div>
      </Container>
    </section>
  );
}
