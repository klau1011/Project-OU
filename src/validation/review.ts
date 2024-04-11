import { z } from "zod";

export const createTipSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  content: z.string().min(1, { message: "Content is required" }),
  attachmentFile: z.any().optional(),
});

export type CreateTipSchema = z.infer<typeof createTipSchema>;

export const updateTipSchema = createTipSchema.extend({
  id: z.string().min(1),
});

export const deleteTipSchema = z.object({
  id: z.string().min(1),
});
