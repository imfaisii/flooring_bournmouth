import type { Service } from "@/types";

export const services: Service[] = [
  {
    id: "hardwood",
    title: "Hardwood Flooring",
    slug: "hardwood-flooring",
    description:
      "Premium solid hardwood flooring that adds timeless elegance and warmth to any room. Available in oak, walnut, maple, and more.",
    icon: "TreeDeciduous",
    features: [
      "Solid oak, walnut & maple options",
      "Professional sanding & finishing",
      "25+ year lifespan",
    ],
  },
  {
    id: "engineered-wood",
    title: "Engineered Wood",
    slug: "engineered-wood",
    description:
      "Multi-layered engineered wood flooring offering the beauty of real wood with superior stability. Ideal for underfloor heating.",
    icon: "Layers",
    features: [
      "Compatible with underfloor heating",
      "Click-lock & glue-down options",
      "Moisture resistant core",
    ],
  },
  {
    id: "laminate",
    title: "Laminate Flooring",
    slug: "laminate-flooring",
    description:
      "High-quality laminate flooring that replicates the look of natural wood or stone at a fraction of the cost. Durable and easy to maintain.",
    icon: "LayoutGrid",
    features: [
      "Scratch & stain resistant",
      "Quick installation",
      "Budget-friendly option",
    ],
  },
  {
    id: "vinyl-lvt",
    title: "Luxury Vinyl (LVT)",
    slug: "luxury-vinyl-lvt",
    description:
      "Luxury vinyl tiles and planks offering stunning realism, waterproof performance, and exceptional comfort underfoot.",
    icon: "Droplets",
    features: [
      "100% waterproof",
      "Ideal for kitchens & bathrooms",
      "Soft & warm underfoot",
    ],
  },
  {
    id: "tile",
    title: "Tile & Stone",
    slug: "tile-stone",
    description:
      "Professional tile and natural stone flooring installation. From porcelain to marble, we handle all types of tile projects.",
    icon: "Grid3X3",
    features: [
      "Porcelain, ceramic & natural stone",
      "Underfloor heating compatible",
      "Perfect for wet areas",
    ],
  },
  {
    id: "carpet",
    title: "Carpet Fitting",
    slug: "carpet-fitting",
    description:
      "Expert carpet supply and fitting for bedrooms, living areas, and stairs. Wide range of styles, colours, and textures available.",
    icon: "Scissors",
    features: [
      "Wide range of styles & colours",
      "Stain-resistant options",
      "Professional stair fitting",
    ],
  },
];
