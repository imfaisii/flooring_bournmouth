"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { Calculator, Check, RefreshCcw } from "lucide-react";

export function QuoteCalculator() {
    const [width, setWidth] = useState("");
    const [length, setLength] = useState("");
    const [type, setType] = useState("carpet");
    const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);

    const calculateQuote = () => {
        const w = parseFloat(width);
        const l = parseFloat(length);
        if (!w || !l) return;

        // Dummy pricing logic
        const area = w * l;
        let pricePerSqM = 25; // default carpet
        if (type === "hardwood") pricePerSqM = 80;
        if (type === "vinyl") pricePerSqM = 45;
        if (type === "laminate") pricePerSqM = 35;

        setEstimatedPrice(area * pricePerSqM);
    };

    return (
        <section className="py-24 bg-[#080808] relative border-t border-white/5">
            <Container>
                <div className="relative rounded-3xl overflow-hidden bg-dark-card border border-white/5 shadow-2xl">
                    {/* Header Background */}
                    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-secondary via-accent to-secondary" />

                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        {/* Form Side */}
                        <div className="p-8 lg:p-12 relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                                    <Calculator className="w-5 h-5" />
                                </div>
                                <h2 className="text-2xl font-bold text-white font-heading">Quick Quote Estimator</h2>
                            </div>

                            <p className="text-neutral-400 mb-8 text-sm">
                                Enter your room dimensions to get an instant estimated price range for your new flooring.
                            </p>

                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-neutral-500 uppercase tracking-wide">Width (m)</label>
                                        <input
                                            type="number"
                                            value={width}
                                            onChange={(e) => setWidth(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-accent/50 transition-colors"
                                            placeholder="e.g. 4.5"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-neutral-500 uppercase tracking-wide">Length (m)</label>
                                        <input
                                            type="number"
                                            value={length}
                                            onChange={(e) => setLength(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-accent/50 transition-colors"
                                            placeholder="e.g. 5.2"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wide">Flooring Type</label>
                                    <select
                                        value={type}
                                        onChange={(e) => setType(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-accent/50 transition-colors [&>option]:bg-dark-card"
                                    >
                                        <option value="carpet">Luxury Carpet</option>
                                        <option value="hardwood">Solid Hardwood</option>
                                        <option value="vinyl">Luxury Vinyl Tile (LVT)</option>
                                        <option value="laminate">Premium Laminate</option>
                                    </select>
                                </div>

                                <button
                                    onClick={calculateQuote}
                                    className="w-full bg-accent text-dark-bg font-bold py-4 rounded-xl hover:bg-accent-light transition-colors shadow-[0_5px_20px_rgba(230,170,104,0.2)]"
                                >
                                    Calculate Estimate
                                </button>

                                <p className="text-xs text-neutral-600 text-center mt-4">
                                    *Estimates exclude installation & subfloor preparation. Book a free measure for a final quote.
                                </p>
                            </div>
                        </div>

                        {/* Result Side */}
                        <div className="relative bg-black/50 p-8 lg:p-12 flex flex-col items-center justify-center text-center border-t lg:border-t-0 lg:border-l border-white/5">
                            {/* Decorative Grid */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:40px_40px]" />

                            <div className="relative z-10">
                                {estimatedPrice !== null ? (
                                    <div className="space-y-4 animate-in fade-in zoom-in duration-500">
                                        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto border border-green-500/20">
                                            <Check className="w-8 h-8 text-green-500" />
                                        </div>
                                        <div>
                                            <p className="text-neutral-400 font-medium">Estimated Material Cost</p>
                                            <div className="text-5xl lg:text-6xl font-bold text-white font-heading mt-2">
                                                £{Math.round(estimatedPrice).toLocaleString()}
                                            </div>
                                        </div>
                                        <div className="pt-6">
                                            <button
                                                onClick={() => setEstimatedPrice(null)}
                                                className="text-sm text-neutral-500 hover:text-white flex items-center justify-center gap-2 mx-auto"
                                            >
                                                <RefreshCcw className="w-4 h-4" />
                                                Recalculate
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="opacity-50 space-y-4">
                                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/5">
                                            <span className="text-3xl">£?</span>
                                        </div>
                                        <p className="text-lg text-neutral-400">Enter your details to see a price</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}
