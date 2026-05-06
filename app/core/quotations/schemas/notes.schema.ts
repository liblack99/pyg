import z from "zod";
export const BodySchema = z.object({
  note: z.string().trim().max(10000),
});
