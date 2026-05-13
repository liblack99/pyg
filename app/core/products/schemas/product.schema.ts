import {z} from "zod";

export const ProductSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede superar los 100 caracteres"),

  code: z
    .string()
    .min(2, "El código debe tener al menos 2 caracteres")
    .max(40, "El código no puede superar los 40 caracteres"),

  unit: z.string().min(1, "La unidad es obligatoria").optional(),

  unitPrice: z.number().min(100, "Precio es obligatorio"),

  imageUrl: z.string().optional().nullable(),

  description: z
    .string()
    .max(500, "La descripción no puede superar los 500 caracteres")
    .optional()
    .nullable(),
});

export type ProductSchemaForm = z.infer<typeof ProductSchema>;
