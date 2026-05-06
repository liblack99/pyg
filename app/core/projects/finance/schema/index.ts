import {z} from "zod";
import {
  PROJECT_FINANCE_ENTRY_CATEGORIES,
  PROJECT_FINANCE_ENTRY_STATUSES,
  PROJECT_FINANCE_ENTRY_TYPES,
} from "../dto";

const nullableTrimmedString = z.string().trim().nullable().optional();

export const createProjectFinanceEntrySchema = z.object({
  type: z.enum(PROJECT_FINANCE_ENTRY_TYPES),
  category: z.enum(PROJECT_FINANCE_ENTRY_CATEGORIES),
  amount: z.coerce.number().positive("El valor debe ser mayor a cero"),
  date: z.string().trim().min(1, "La fecha es obligatoria"),
  description: z.string().trim().min(1, "La descripción es obligatoria"),
  notes: nullableTrimmedString,
  documentId: z.string().trim().nullable().optional(),
  createdById: z.string().trim().nullable().optional(),
});

export type CreateProjectFinanceEntrySchemaInput = z.infer<
  typeof createProjectFinanceEntrySchema
>;

export const updateProjectFinanceEntrySchema = z.object({
  type: z.enum(PROJECT_FINANCE_ENTRY_TYPES).optional(),
  category: z.enum(PROJECT_FINANCE_ENTRY_CATEGORIES).optional(),
  amount: z.coerce.number().positive("El valor debe ser mayor a cero").optional(),
  date: z.string().trim().min(1).optional(),
  description: z.string().trim().min(1).optional(),
  notes: nullableTrimmedString,
  documentId: z.string().trim().nullable().optional(),
  status: z.enum(PROJECT_FINANCE_ENTRY_STATUSES).optional(),
});

export type UpdateProjectFinanceEntrySchemaInput = z.infer<
  typeof updateProjectFinanceEntrySchema
>;

export const projectFinanceEntryFormSchema = z.object({
  type: z.enum(PROJECT_FINANCE_ENTRY_TYPES),
  category: z.enum(PROJECT_FINANCE_ENTRY_CATEGORIES),
  amount: z.number().positive("El valor debe ser mayor a cero"),
  date: z.string().trim().min(1, "La fecha es obligatoria"),
  description: z.string().trim().min(1, "La descripción es obligatoria"),
  notes: nullableTrimmedString,
  documentId: z.string().trim().nullable().optional(),
});

export type ProjectFinanceEntryFormValues = z.infer<
  typeof projectFinanceEntryFormSchema
>;
