import { z } from "zod";

export const quoteSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  address: z.string().min(5, "Please enter your full address"),
  service: z.string().min(1, "Please select a service"),
  message: z.string().optional(),
});

export type QuoteFormData = z.infer<typeof quoteSchema>;
