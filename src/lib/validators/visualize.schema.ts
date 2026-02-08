import { z } from "zod";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const flooringTypes = [
  "hardwood",
  "laminate",
  "vinyl",
  "marble",
  "tile",
] as const;

export type FlooringType = (typeof flooringTypes)[number];

export const flooringLabels: Record<FlooringType, string> = {
  hardwood: "Hardwood",
  laminate: "Laminate",
  vinyl: "Vinyl",
  marble: "Marble",
  tile: "Tile",
};

export const flooringColors: Record<FlooringType, string> = {
  hardwood: "#8B4513",
  laminate: "#D2B48C",
  vinyl: "#A0522D",
  marble: "#F5F5F5",
  tile: "#808080",
};

export const visualizeSchema = z.object({
  flooringType: z.enum(flooringTypes, {
    message: "Please select a valid flooring type",
  }),
  sessionId: z
    .string()
    .min(16, "Invalid session")
    .max(64, "Invalid session"),
});

export const imageValidation = {
  maxSize: MAX_IMAGE_SIZE,
  allowedTypes: ALLOWED_TYPES,
  validate: (file: { size: number; type: string }) => {
    if (file.size > MAX_IMAGE_SIZE) {
      return { valid: false, error: `Image must be less than ${MAX_IMAGE_SIZE / 1024 / 1024}MB` };
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return { valid: false, error: "Image must be JPEG, PNG, or WebP" };
    }
    return { valid: true, error: null };
  },
};

export type VisualizeFormData = z.infer<typeof visualizeSchema>;
