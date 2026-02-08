import { Container } from "@/components/ui/Container";
import { companyInfo } from "@/lib/constants/company";

export default function PrivacyPolicyPage() {
    return (
        <main className="bg-dark-bg min-h-screen pt-24 pb-12">
            <Container>
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-8">
                        Privacy Policy
                    </h1>

                    <div className="prose prose-invert prose-lg max-w-none space-y-8 text-neutral-400">
                        <p>
                            Last updated: {new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
                            <p>
                                Welcome to {companyInfo.name} ("we," "our," or "us"). We are committed to protecting your privacy and ensuring your personal data is handled in compliance with the General Data Protection Regulation (GDPR) and the Data Protection Act 2018.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">2. Information We Collect</h2>
                            <p>We may collect and process the following data about you:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Personal identification information (Name, email address, phone number).</li>
                                <li>Property details and address for service delivery.</li>
                                <li>Payment information (processed securely by our payment providers).</li>
                                <li>Technical data (IP address, browser type, device info) when you visit our website.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Information</h2>
                            <p>We use your data to:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Provide our flooring services and customer support.</li>
                                <li>Process quotes and orders.</li>
                                <li>Communicate with you regarding appointments and updates.</li>
                                <li>Improve our website and services.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">4. Data Security</h2>
                            <p>
                                We implement appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way. We limit access to your personal data to those employees, agents, contractors, and other third parties who have a business need to know.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">5. Contact Us</h2>
                            <p>
                                If you have any questions about this privacy policy or our data practices, please contact us at:
                            </p>
                            <address className="not-italic mt-4 p-6 bg-white/5 border border-white/10 rounded-xl">
                                <strong className="text-white block mb-2">{companyInfo.name}</strong>
                                <span className="block">{companyInfo.address.full}</span>
                                <span className="block mt-2">Email: <a href={`mailto:${companyInfo.email}`} className="text-accent hover:text-accent-light transition-colors">{companyInfo.email}</a></span>
                                <span className="block">Phone: <a href={`tel:${companyInfo.phone}`} className="text-accent hover:text-accent-light transition-colors">{companyInfo.phone}</a></span>
                            </address>
                        </section>
                    </div>
                </div>
            </Container>
        </main>
    );
}
