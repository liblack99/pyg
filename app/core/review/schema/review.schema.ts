import z from "zod";

export const ReviewSchema = z.object({
  title: z.string().max(120),
  details: z.string().max(1000).optional().nullable(),
});

export type ReviewSchemaForm = z.infer<typeof ReviewSchema>;
