"use client";

import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRef } from "react";
import Image from "next/image";

interface Project {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
}

const projects: Project[] = [
  {
    id: "1",
    title: "Luxury Apartment",
    category: "Vinyl",
    image: "/hero_bg_nano.png",
    description: "Premium herringbone vinyl in a modern high-rise."
  },
  {
    id: "2",
    title: "Seaside Villa",
    category: "Hardwood",
    image: "/hero_reference.png",
    description: "Restored oak floorboards with a matte finish."
  },
  {
    id: "3",
    title: "Modern Office",
    category: "Commercial",
    image: "/hero_bg_final.png",
    description: "Durable and stylish safety flooring for workspaces."
  },
  {
    id: "4",
    title: "Heritage Restoration",
    category: "Sanding",
    image: "/hero_bg_v2.png",
    description: "Bringing life back to 100-year-old parquet."
  },
  {
    id: "5",
    title: "Boutique Hotel",
    category: "Laminate",
    image: "/hero_dark_flooring_background.png",
    description: "High-traffic resistance with a luxury aesthetic."
  },
  {
    id: "6",
    title: "Eco Residence",
    category: "Engineered",
    image: "/hero_bg_nano.png",
    description: "Sustainable bamboo flooring with natural warmth."
  },
];

export function FeaturedProjects() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400; // Adjust based on card width + gap
      const newScrollLeft = direction === 'left'
        ? scrollRef.current.scrollLeft - scrollAmount
        : scrollRef.current.scrollLeft + scrollAmount;

      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="projects" className="py-24 bg-dark-bg relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-dark-bg via-[#0a0a0a] to-dark-bg pointer-events-none" />

      <Container className="relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <SectionHeading
              title="Our Masterpieces"
              subtitle="A showcase of precision, quality, and style in homes across Bournemouth."
            />
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => scroll('left')}
              className="p-3 rounded-full border border-white/10 bg-white/5 text-white hover:bg-accent hover:border-accent hover:text-black transition-all duration-300 backdrop-blur-sm group"
              aria-label="Previous project"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-3 rounded-full border border-white/10 bg-white/5 text-white hover:bg-accent hover:border-accent hover:text-black transition-all duration-300 backdrop-blur-sm group"
              aria-label="Next project"
            >
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-12 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:px-0 md:scrollbar-default"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {projects.map((project) => (
            <div
              key={project.id}
              className="min-w-[85vw] md:min-w-[400px] lg:min-w-[500px] snap-start group relative rounded-3xl overflow-hidden aspect-[4/3] border border-white/5 bg-neutral-900"
            >
              {/* Image */}
              <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                />
              </div>

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-80 transition-opacity" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-black bg-accent rounded-full">
                    {project.category}
                  </span>
                </div>

                <h3 className="text-2xl font-heading font-bold text-white mb-2">
                  {project.title}
                </h3>

                <p className="text-neutral-300 text-sm line-clamp-2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 transform translate-y-2 group-hover:translate-y-0">
                  {project.description}
                </p>

                <div className="w-full h-[1px] bg-white/20 group-hover:bg-accent/50 transition-colors duration-500" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
