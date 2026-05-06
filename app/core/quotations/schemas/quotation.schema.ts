import {z} from "zod";
import {clientSchema} from "./client.schema";
import {itemSchema} from "./item.schema";
import {termSchema} from "./terms.schema";
import {conditionsSchema} from "./conditions.schema";

export const quotationSchema = z.object({
  date: z.string().min(1, "La fecha es obligatoria"),
  numberQuotation: z.string(),
  validDays: z.number(),

  client: clientSchema,
  reference: z.string().min(1, "Seleccione un detalle de proyecto"),
  referenceDetail: z.string().optional(),
  presentation: z.string().min(1, "Seleccione una presentación"),

  items: z.array(itemSchema),

  terms: z
    .array(termSchema)
    .min(1)
    .refine(
      (terms) =>
        terms.filter((t) => t.required).every((t) => t.accepted === true),
      {
        message: "Debe aceptar todos los términos obligatorios para continuar",
      },
    ),

  timeDelivery: z.string().optional().nullable(),
  workLocation: z.string().optional().nullable(),
  specialConditions: z.string().optional().nullable(),
  conditions: conditionsSchema,
  installationSystem: z.string().optional().nullable(),
  totalGeneral: z.number().min(1),
});

export type QuotationFormData = z.infer<typeof quotationSchema>;
