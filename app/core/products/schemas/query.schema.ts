import z from "zod";

export const QuerySchema = z.object({
  search: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(50).optional(),
  cursor: z.string().optional(),
});
