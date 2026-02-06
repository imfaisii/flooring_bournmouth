import Link from "next/link";
import { Smartphone, Upload, Eye, Layers } from "lucide-react";
import { Container } from "@/components/ui/Container";

export function RoomVisualizer() {
    return (
        <section className="py-24 bg-dark-bg relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] pointer-events-none -translate-x-1/2 translate-y-1/2" />

            <Container>
                <div className="flex flex-col lg:flex-row items-center gap-16">

                    {/* Content */}
                    <div className="w-full lg:w-1/2 space-y-8 z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
                            <Eye className="w-4 h-4 text-accent" />
                            <span className="text-accent text-xs font-bold uppercase tracking-wider">Try Before You Buy</span>
                        </div>

                        <h2 className="text-4xl lg:text-5xl font-heading font-bold text-white leading-tight">
                            SEE IT IN <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent">YOUR OWN ROOM</span>
                        </h2>

                        <p className="text-lg text-neutral-400 max-w-lg leading-relaxed">
                            Not sure which floor suits your style? Use our advanced AR Visualizer. simply upload a photo of your room and instantly see how different floors look in your space.
                        </p>

                        <div className="space-y-4 pt-4">
                            {[
                                { icon: Upload, text: "Upload a photo of your room" },
                                { icon: Layers, text: "Select from our premium flooring collection" },
                                { icon: Smartphone, text: "View instantly on your phone or computer" }
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                        <item.icon className="w-5 h-5 text-secondary" />
                                    </div>
                                    <span className="text-neutral-300 font-medium">{item.text}</span>
                                </div>
                            ))}
                        </div>

                        <div className="pt-6">
                            <button className="group relative px-8 py-4 bg-white/5 border border-accent/50 text-white font-bold rounded-full overflow-hidden transition-all hover:bg-accent hover:border-accent hover:text-dark-bg hover:shadow-[0_0_30px_rgba(230,170,104,0.4)]">
                                <span className="relative z-10 flex items-center gap-2">
                                    LAUNCH VISUALIZER
                                    <Eye className="w-5 h-5" />
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Visual Representation (Mock UI since image gen failed) */}
                    <div className="w-full lg:w-1/2 relative lg:h-[600px] flex items-center justify-center">
                        {/* Device Frame */}
                        <div className="relative w-[300px] h-[600px] bg-neutral-900 rounded-[3rem] border-4 border-neutral-800 shadow-2xl p-4 rotate-[-5deg] transform transition-transform hover:rotate-0 duration-500 z-20">
                            {/* Screen */}
                            <div className="w-full h-full bg-dark-bg rounded-[2.5rem] overflow-hidden relative border border-white/5">
                                {/* Header UI */}
                                <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/80 to-transparent z-10 flex items-center justify-center pt-4">
                                    <div className="w-20 h-6 bg-black rounded-b-xl" />
                                </div>

                                {/* Mock Content - Room Image */}
                                <div className="absolute inset-0 bg-neutral-800">
                                    {/* Split View Effect */}
                                    <div className="absolute inset-0 bg-neutral-700 clip-path-diagonal">
                                        {/* Floor A */}
                                        <div className="absolute bottom-0 inset-x-0 h-[40%] bg-[linear-gradient(45deg,#3E2723_25%,#5D4037_25%,#5D4037_50%,#3E2723_50%,#3E2723_75%,#5D4037_75%,#5D4037_100%)] bg-[length:20px_20px] opacity-50" />
                                    </div>
                                    {/* Floor B */}
                                    <div className="absolute bottom-0 inset-x-0 h-[40%] bg-[linear-gradient(45deg,#C8A876_25%,#E0CFA8_25%,#E0CFA8_50%,#C8A876_50%,#C8A876_75%,#E0CFA8_75%,#E0CFA8_100%)] bg-[length:20px_20px] opacity-50 clip-path-diagonal-reverse" />

                                    {/* Overlay UI */}
                                    <div className="absolute bottom-8 left-4 right-4 bg-black/60 backdrop-blur-md rounded-xl p-4 border border-white/10 flex items-center justify-between">
                                        <div className="flex gap-2">
                                            <div className="w-10 h-10 rounded-lg bg-[#3E2723] border-2 border-accent shadow-[0_0_10px_rgba(230,170,104,0.5)]" />
                                            <div className="w-10 h-10 rounded-lg bg-[#C8A876] opacity-50" />
                                            <div className="w-10 h-10 rounded-lg bg-[#5A574F] opacity-50" />
                                        </div>
                                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-accent text-dark-bg">
                                            <Upload className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Background decorative elements */}
                        <div className="absolute top-1/4 right-10 w-24 h-24 bg-accent/20 rounded-full blur-xl animate-pulse" />
                        <div className="absolute bottom-1/4 left-10 w-32 h-32 bg-secondary/10 rounded-full blur-xl" />
                    </div>

                </div>
            </Container>
        </section>
    );
}
