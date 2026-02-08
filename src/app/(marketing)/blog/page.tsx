import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

// Enable ISR with 1-hour revalidation (for future blog posts)
export const revalidate = 3600; // Revalidate every 1 hour

export default function BlogPage() {
    return (
        <div className="pt-32 pb-20 bg-dark-bg min-h-screen">
            <Container>
                <SectionHeading
                    title="Latest News & Insights"
                    subtitle="Stay updated with the latest trends, tips, and company news from QCF Bespoke Flooring."
                />

                <div className="mt-12 text-center py-20 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-xl text-neutral-400">Our blog details are coming soon.</p>
                </div>
            </Container>
        </div>
    );
}
