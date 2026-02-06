import Link from "next/link";
import { Container } from "@/components/ui/Container";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-dark-bg text-white overflow-hidden pt-20">

      {/* Background with Image and Overlay */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none bg-[#050505]">

        {/* Actual Image - Updated to Final Pretty Version */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80"
          style={{ backgroundImage: 'url(/hero_bg_nano.png)' }}
        />

        {/* Cinematic Vignette - Reduced contrast to show more floor */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#000000_90%)] opacity-60" />

        {/* Golden Ambience Gradient - Simulating overhead light */}
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[80%] h-[60%] bg-accent/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen" />
      </div>

      <Container className="relative z-10 flex flex-col items-center text-center">

        {/* Central Glass Sphere with Q Logo */}
        <div className="relative mb-8 lg:mb-12">
          {/* Outer Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-accent/5 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />

          {/* The Sphere Container */}
          <div className="relative w-[280px] h-[280px] rounded-full border border-white/10 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_0_60px_rgba(255,255,255,0.05)] flex items-center justify-center overflow-hidden group hover:border-accent/20 transition-all duration-700">

            {/* Reflection/Sheen */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent opacity-50 rounded-t-full" />

            {/* The "Q" Logo */}
            <div className="text-[180px] leading-none font-heading font-bold text-transparent bg-clip-text bg-gradient-to-b from-secondary via-accent to-secondary-light drop-shadow-[0_0_25px_rgba(230,170,104,0.5)] transform translate-y-2 select-none group-hover:scale-105 transition-transform duration-700">
              B
            </div>

            {/* Inner highlight */}
            <div className="absolute inset-0 rounded-full border border-white/5 opacity-50" />
          </div>
        </div>

        {/* Headline */}
        <div className="space-y-6 max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-[5rem] font-heading font-normal tracking-tight text-white drop-shadow-2xl leading-[1.1]">
            BESPOKE  FLOORING
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5F5F0] via-white to-[#F5F5F0] drop-shadow-[0_0_25px_rgba(230,170,104,0.2)]">
              TAILORED FOR YOU
            </span>
          </h1>

          {/* CTA Button */}
          <div className="pt-8">
            <Link
              href="/#quote"
              className="group relative inline-flex items-center justify-center px-12 py-4 text-sm font-medium tracking-[0.2em] uppercase text-neutral-200 transition-all duration-300 hover:text-white"
            >
              {/* Glowing Outline */}
              <div className="absolute inset-0 rounded-full border border-accent/40 shadow-[0_0_15px_rgba(230,170,104,0.15)] group-hover:bg-accent/5 group-hover:border-accent group-hover:shadow-[0_0_30px_rgba(230,170,104,0.5)] transition-all duration-500" />

              <span className="relative z-10">Get a Quote</span>
            </Link>
          </div>
        </div>

      </Container>
    </section>
  );
}
