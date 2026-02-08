import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="bg-dark-bg min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[80px] pointer-events-none -translate-x-1/2 translate-y-1/2" />

      <Container>
        <div className="max-w-2xl mx-auto text-center space-y-8 relative z-10">
          <div className="space-y-4">
            <h1 className="text-[10rem] font-bold font-heading text-transparent bg-clip-text bg-gradient-to-br from-white/20 to-white/5 leading-none select-none">
              404
            </h1>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Page Not Found
            </h2>
            <p className="text-lg text-neutral-400 max-w-md mx-auto">
              Oops! It looks like you've taken a wrong turn. The page you are looking for might have been moved or doesn't exist.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button size="lg" className="w-full sm:w-auto">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}
