import { cn } from "@/lib/utils/cn";
import { type SelectHTMLAttributes, forwardRef } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className, id, ...props }, ref) => {
    const selectId = id || label.toLowerCase().replace(/\s+/g, "-");

    return (
      <div>
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-neutral-300 mb-1.5"
        >
          {label}
        </label>
        <select
          ref={ref}
          id={selectId}
          className={cn(
            "w-full px-4 py-2.5 rounded-lg border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors [&>option]:bg-dark-bg [&>option]:text-white",
            error && "border-red-500 focus:ring-red-500/50 focus:border-red-500",
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled className="text-neutral-500">
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
