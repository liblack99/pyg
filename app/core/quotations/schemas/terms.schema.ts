import {z} from "zod";

export const termSchema = z.object({
  key: z.string(),
  text: z.string(),
  required: z.boolean(),
  accepted: z.boolean(),
});

export type Terms = z.infer<typeof termSchema>;
