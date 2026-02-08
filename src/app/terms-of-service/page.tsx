import { Container } from "@/components/ui/Container";
import { companyInfo } from "@/lib/constants/company";

export default function TermsOfServicePage() {
    return (
        <main className="bg-dark-bg min-h-screen pt-24 pb-12">
            <Container>
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-8">
                        Terms of Service
                    </h1>

                    <div className="prose prose-invert prose-lg max-w-none space-y-8 text-neutral-400">
                        <p>
                            Last updated: {new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">1. Agreement to Terms</h2>
                            <p>
                                By accessing our website and using our services at {companyInfo.name}, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">2. Services</h2>
                            <p>
                                We provide professional flooring installation and supply services. All estimates and quotes are subject to site inspection and availability of materials. We reserve the right to refuse service to anyone for any reason at any time.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">3. Quotations and Payments</h2>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Quotes are valid for 30 days from the date of issue unless stated otherwise.</li>
                                <li>A deposit may be required to secure your booking and materials.</li>
                                <li>Full payment is due upon completion of the work, unless alternative arrangements have been agreed upon in writing.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">4. Cancellations and Refunds</h2>
                            <p>
                                Cancellations made less than 48 hours before the scheduled start time may incur a cancellation fee. Refunds for materials are subject to the return policies of our suppliers and may incur a restocking fee.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">5. Liability</h2>
                            <p>
                                While we take utmost care in our work, {companyInfo.name} shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services, except where such liability cannot be excluded by law.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">6. Contact Information</h2>
                            <p>
                                Questions about the Terms of Service should be sent to us at:
                            </p>
                            <address className="not-italic mt-4 p-6 bg-white/5 border border-white/10 rounded-xl">
                                <strong className="text-white block mb-2">{companyInfo.name}</strong>
                                <span className="block mt-2">Email: <a href={`mailto:${companyInfo.email}`} className="text-accent hover:text-accent-light transition-colors">{companyInfo.email}</a></span>
                            </address>
                        </section>
                    </div>
                </div>
            </Container>
        </main>
    );
}
