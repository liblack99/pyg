import {z} from "zod";

export const itemSchema = z.object({
  code: z.string().min(1, "Código requerido"),
  productId: z.string().min(1, "Producto requerido"),
  productName: z.string().min(1, "Producto requerido"),
  description: z.string().optional().nullable(),
  unit: z.string().min(1, "Unidad requerida"),
  quantity: z.number().min(0, "Cantidad debe ser positiva"),
  unitPrice: z.number().min(0, "Precio debe ser positivo"),
  adminPercent: z.number().min(0).max(100),
  imprPercent: z.number().min(0).max(100),
  utilPercent: z.number().min(0).max(100),
  ivaPercent: z.number().min(0).max(100),
});

export type Item = z.infer<typeof itemSchema>;
