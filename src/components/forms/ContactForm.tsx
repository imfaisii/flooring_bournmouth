"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { services } from "@/lib/constants/services";

const serviceOptions = services.map((s) => ({
  value: s.title,
  label: s.title,
}));

export function ContactForm() {
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
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        if (result.details?.fieldErrors) {
          const fieldErrors: Record<string, string> = {};
          for (const [key, messages] of Object.entries(result.details.fieldErrors)) {
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
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input
          label="Phone Number"
          name="phone"
          type="tel"
          placeholder="01202 000 000"
          required
          error={errors.phone}
        />
        <Select
          label="Service Interested In"
          name="service"
          options={serviceOptions}
          placeholder="Select a service..."
          defaultValue=""
          required
          error={errors.service}
        />
      </div>

      <Input
        label="Address"
        name="address"
        placeholder="123 Main Street, Bournemouth, BH1 1AA"
        required
        error={errors.address}
      />

      <Textarea
        label="Your Message"
        name="message"
        placeholder="Tell us about your project — room sizes, flooring preferences, any specific requirements..."
        required
        error={errors.message}
      />

      <Button type="submit" size="lg" disabled={loading} className="w-full sm:w-auto">
        {loading ? "Sending..." : "Send Inquiry"}
      </Button>
    </form>
  );
}
