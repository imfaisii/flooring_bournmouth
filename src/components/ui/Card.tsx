import { cn } from "@/lib/utils/cn";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        "bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 shadow-lg text-white",
        hover && "hover:border-accent/50 hover:shadow-[0_0_20px_rgba(230,170,104,0.2)] hover:-translate-y-1 transition-all duration-300",
        className
      )}
    >
      {children}
    </div>
  );
}
