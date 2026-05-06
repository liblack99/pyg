import {z} from "zod";
import {
  INSTALLATION_ITEM_STATUSES,
  PROJECT_INSTALLATION_STATUSES,
} from "../dto";

const nullableTrimmedString = z.string().trim().nullable().optional();
const nullableDateString = z.string().nullable().optional();

export const updateProjectInstallationSchema = z.object({
  status: z.enum(PROJECT_INSTALLATION_STATUSES).optional(),
  responsible: nullableTrimmedString,
  summary: nullableTrimmedString,
  notes: nullableTrimmedString,
  plannedStartAt: nullableDateString,
  plannedEndAt: nullableDateString,
  actualStartAt: nullableDateString,
  actualEndAt: nullableDateString,
  progressPercent: z.number().int().min(0).max(100).optional(),
});

export type UpdateProjectInstallationSchemaInput = z.infer<
  typeof updateProjectInstallationSchema
>;

export const createProjectInstallationItemSchema = z.object({
  installationId: z.string().trim().min(1),
  name: z.string().trim().min(1, "El nombre es obligatorio"),
  description: nullableTrimmedString,
  status: z.enum(INSTALLATION_ITEM_STATUSES).optional(),
  responsible: nullableTrimmedString,
  plannedAt: nullableDateString,
  completedAt: nullableDateString,
  orderIndex: z.number().int().min(0).optional(),
  notes: nullableTrimmedString,
});

export type CreateProjectInstallationItemSchemaInput = z.infer<
  typeof createProjectInstallationItemSchema
>;

export const updateProjectInstallationItemSchema = z.object({
  name: z.string().trim().min(1).optional(),
  description: nullableTrimmedString,
  status: z.enum(INSTALLATION_ITEM_STATUSES).optional(),
  responsible: nullableTrimmedString,
  plannedAt: nullableDateString,
  completedAt: nullableDateString,
  orderIndex: z.number().int().min(0).optional(),
  notes: nullableTrimmedString,
});

export type UpdateProjectInstallationItemSchemaInput = z.infer<
  typeof updateProjectInstallationItemSchema
>;

export const projectInstallationItemFormSchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio"),
  description: nullableTrimmedString,
  status: z.enum(INSTALLATION_ITEM_STATUSES).optional(),
  responsible: nullableTrimmedString,
  plannedAt: nullableDateString,
  completedAt: nullableDateString,
  orderIndex: z.number().int().min(0).optional(),
  notes: nullableTrimmedString,
});

export type ProjectInstallationItemFormValues = z.infer<
  typeof projectInstallationItemFormSchema
>;
