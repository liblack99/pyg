import z from "zod";

export const ProjectBaseSchema = z.object({
  status: z.string().optional(),
  kind: z.string().optional(),

  procurementDueAt: z.date().nullable().optional(),
  procurementDoneAt: z.date().nullable().optional(),

  fabricationDueAt: z.date().nullable().optional(),
  fabricationDoneAt: z.date().nullable().optional(),

  installationDueAt: z.date().nullable().optional(),
  installationDoneAt: z.date().nullable().optional(),

  deliveryDueAt: z.date().nullable().optional(),
  deliveryDoneAt: z.date().nullable().optional(),
});

export const ProjectUpdateSchema = ProjectBaseSchema;

export type ProjectUpdateValues = z.infer<typeof ProjectUpdateSchema>;

export const ProjectCreateSchema = ProjectBaseSchema.extend({
  quotationId: z.string().min(1, "La cotización es requerida"),
});

export type ProjectCreateValues = z.infer<typeof ProjectCreateSchema>;
