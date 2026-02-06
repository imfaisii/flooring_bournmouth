import { cn } from "@/lib/utils/cn";
import { type TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const textareaId = id || label.toLowerCase().replace(/\s+/g, "-");

    return (
      <div>
        <label
          htmlFor={textareaId}
          className="block text-sm font-medium text-neutral-300 mb-1.5"
        >
          {label}
        </label>
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            "w-full px-4 py-2.5 rounded-lg border border-white/10 bg-white/5 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors resize-vertical min-h-[120px]",
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

Textarea.displayName = "Textarea";
