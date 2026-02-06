import { Container } from "@/components/ui/Container";

const steps = [
  {
    step: "1.",
    title: "SCHEDULE YOUR APPOINTMENT",
    description: (
      <>
        To take advantage of our free measuring and estimate service, contact us by phone or through our website. As a trusted carpet supplier in Bournemouth, our friendly staff will schedule an appointment at your convenience. Whether you&apos;re looking for carpets or flooring <span className="bg-yellow-400/80 text-black px-1 font-medium">services</span> our expert team is ready to assist with personalised guidance. We&apos;re here to ensure you receive the best possible solutions for your home or business.
      </>
    ),
  },
  {
    step: "2.",
    title: "ON-SITE MEASUREMENT",
    description: (
      <>
        A member of our highly experienced team will visit your premises at the scheduled time. Equipped with precision tools and expertise, they will carefully measure the dimensions of your rooms to ensure accurate calculations for your carpet or flooring needs. This step is crucial to guaranteeing a seamless installation process and ensuring that you receive an estimate tailored to your specific requirements.
      </>
    ),
  },
  {
    step: "3.",
    title: "RECEIVE YOUR ESTIMATE",
    description: (
      <>
        After the on-site measurement, we will provide you with a no-obligation estimate, typically on the same day. This detailed estimate will include the cost of materials and installation <span className="bg-yellow-400/80 text-black px-1 font-medium">services</span>, ensuring transparency based on the measurements taken during the visit. As specialists in carpets in Bournemouth, we pride ourselves on offering competitive pricing and exceptional service.
      </>
    ),
  },
];

export function ProcessSteps() {
  return (
    <section className="py-24 bg-[#1a1a1a] relative overflow-hidden">
      {/* Background Texture - Herringbone Pattern Simulation via opacity/gradients or just dark ambiance */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)',
          backgroundSize: '60px 60px',
          backgroundPosition: '0 0, 30px 30px'
        }}
      />

      {/* Top Gradient Overlay */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />

      <Container className="relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white uppercase tracking-wide drop-shadow-lg">
            How Does It Work?
          </h2>
          <p className="text-sm md:text-base text-neutral-400 tracking-[0.2em] uppercase font-light">
            Our Free Measuring and Estimate Service
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {steps.map((item, index) => (
            <div key={index} className="group relative flex flex-col bg-[#111] rounded-xl p-8 border border-white/5 hover:border-accent/30 transition-all duration-300 hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
              {/* Number */}
              <div className="mb-6">
                <span className="text-6xl md:text-7xl font-heading font-bold text-white tracking-tighter">
                  {item.step}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-xl md:text-2xl font-heading font-bold text-white mb-6 uppercase leading-tight">
                {item.title}
              </h3>

              {/* Description */}
              <div className="text-neutral-400 text-sm leading-7 font-light text-justify">
                {item.description}
              </div>

              {/* Bottom Gold Line */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
