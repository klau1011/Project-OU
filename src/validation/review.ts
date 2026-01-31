import { z } from "zod";

export const TIP_CATEGORIES = [
  { value: "general", label: "General Advice" },
  { value: "applications", label: "Applications" },
  { value: "academics", label: "Academics" },
  { value: "admissions", label: "Admissions" },
  { value: "scholarships", label: "Scholarships" },
  { value: "interviews", label: "Interviews" },
] as const;

export type TipCategory = typeof TIP_CATEGORIES[number]["value"];

export const createTipSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be under 100 characters"),
  content: z
    .string()
    .min(10, "Content must be at least 10 characters")
    .max(2000, "Content must be under 2000 characters"),
  category: z
    .enum(["general", "applications", "academics", "admissions", "scholarships", "interviews"])
    .default("general"),
  attachmentFile: z.any().optional(),
});
export type CreateTipSchema = z.infer<typeof createTipSchema>;

export const updateTipSchema = createTipSchema.extend({
  id: z.string().min(1),
});

export const deleteTipSchema = z.object({
  id: z.string().min(1),
});
