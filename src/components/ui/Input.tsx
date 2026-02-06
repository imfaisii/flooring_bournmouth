import { cn } from "@/lib/utils/cn";
import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

    return (
      <div>
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-neutral-300 mb-1.5"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full px-4 py-2.5 rounded-lg border border-white/10 bg-white/5 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors",
            error && "border-red-500 focus:ring-red-500/50 focus:border-red-500",
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
