import { Star, Quote } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { testimonials } from "@/lib/constants/testimonials";

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-16 lg:py-24 bg-dark-bg relative">
      <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-accent/5 rounded-full blur-[100px] translate-y-1/2" />
      <Container className="relative z-10">
        <SectionHeading
          title="What Our Customers Say"
          subtitle="Don't just take our word for it. Here's what homeowners across Bournemouth have to say about our flooring services."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="p-8 relative group">
              {/* Quote Icon */}
              <Quote className="w-10 h-10 text-accent/20 absolute top-6 right-6" />

              {/* Stars */}
              <div className="flex gap-0.5 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < testimonial.rating
                        ? "text-accent fill-accent"
                        : "text-neutral-700"
                      }`}
                  />
                ))}
              </div>

              {/* Review */}
              <p className="text-neutral-300 text-sm leading-relaxed mb-6 italic">
                &ldquo;{testimonial.review}&rdquo;
              </p>

              {/* Customer */}
              <div className="border-t border-white/10 pt-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-accent">
                  {testimonial.customerName.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-white text-sm">
                    {testimonial.customerName}
                  </p>
                  <p className="text-neutral-500 text-xs">
                    {testimonial.customerLocation} &middot;{" "}
                    {testimonial.serviceType}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
