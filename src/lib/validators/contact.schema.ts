import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(6, "Please enter a valid phone number")
    .max(20, "Phone number is too long"),
  service: z.string().min(1, "Please select a service"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message is too long"),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
