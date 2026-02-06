import { cn } from "@/lib/utils/cn";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export function SectionHeading({
  title,
  subtitle,
  centered = true,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn(centered && "text-center", "mb-12", className)}>
      <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-heading">
        {title}
      </h2>
      <div
        className={cn(
          "w-16 h-1 bg-accent rounded-full mb-4",
          centered && "mx-auto"
        )}
      />
      {subtitle && (
        <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}
