import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-7xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-bold text-primary-dark mb-3">
          Page Not Found
        </h2>
        <p className="text-neutral-500 mb-8">
          Sorry, the page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-semibold transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
