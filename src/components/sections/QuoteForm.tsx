"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Send, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { services } from "@/lib/constants/services";

const serviceOptions = services.map((s) => ({
  value: s.title,
  label: s.title,
}));

export function QuoteForm() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      address: formData.get("address") as string,
      service: formData.get("service") as string,
      message: formData.get("message") as string,
    };

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        if (result.details?.fieldErrors) {
          const fieldErrors: Record<string, string> = {};
          for (const [key, messages] of Object.entries(
            result.details.fieldErrors
          )) {
            if (Array.isArray(messages) && messages.length > 0) {
              fieldErrors[key] = messages[0] as string;
            }
          }
          setErrors(fieldErrors);
          toast.error("Please fix the errors below.");
        } else {
          toast.error(result.error || "Something went wrong.");
        }
        return;
      }

      toast.success(result.message);
      (e.target as HTMLFormElement).reset();
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative">
      {/* Decorative glow effects */}
      <div className="absolute -top-20 -left-20 w-40 h-40 bg-accent/20 rounded-full blur-[100px]" />
      <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-glow/10 rounded-full blur-[100px]" />

      <div className="relative bg-dark-card border border-white/10 rounded-2xl p-8 lg:p-12 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-1.5 mb-4">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-semibold text-accent">
              Free Quote Request
            </span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3 font-heading">
            Get Your <span className="text-accent">Free Estimate</span>
          </h2>
          <p className="text-neutral-400 max-w-lg mx-auto">
            Fill in the details below and we'll get back to you within 24 hours
            with a personalized quote for your flooring project.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              name="name"
              placeholder="John Smith"
              required
              error={errors.name}
            />
            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="john@example.com"
              required
              error={errors.email}
            />
          </div>

          {/* Phone & Service */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              placeholder="01202 000 000"
              required
              error={errors.phone}
            />
            <Select
              label="Service Type"
              name="service"
              options={serviceOptions}
              placeholder="Select flooring type..."
              defaultValue=""
              required
              error={errors.service}
            />
          </div>

          {/* Address */}
          <Input
            label="Property Address"
            name="address"
            placeholder="123 High Street, Bournemouth, BH1 1AA"
            required
            error={errors.address}
          />

          {/* Message */}
          <Textarea
            label="Additional Details (Optional)"
            name="message"
            placeholder="Tell us about your project — room dimensions, specific requirements, preferred timeline, or any questions you have..."
            error={errors.message}
          />

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="w-full group"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-dark-bg/30 border-t-dark-bg rounded-full animate-spin mr-3" />
                  Sending Request...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                  Request Free Quote
                </>
              )}
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4 text-sm text-neutral-500">
            <div className="flex items-center gap-1.5">
              <svg
                className="w-4 h-4 text-accent"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Free, no obligation
            </div>
            <div className="flex items-center gap-1.5">
              <svg
                className="w-4 h-4 text-accent"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              24-hour response
            </div>
            <div className="flex items-center gap-1.5">
              <svg
                className="w-4 h-4 text-accent"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Secure & confidential
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
