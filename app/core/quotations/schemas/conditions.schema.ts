import {z} from "zod";

export const conditionsSchema = z.object({
  reviews: z.string().min(1, "Elegir una reseña"),
  reviewsDetails: z.string().optional().nullable(),
  guarantees: z.string().min(1, "Seleccione una garantía"),
  commercialCondition: z.string().min(1, "Seleccione una condición comercial"),

  paymentMethod: z.string().min(1, "El método de pago es obligatorio"),
});
