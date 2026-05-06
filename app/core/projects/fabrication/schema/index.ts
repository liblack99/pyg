import {z} from "zod";
import {FABRICATION_ITEM_STATUSES, PROJECT_FABRICATION_STATUSES} from "../dto";
const nullableTrimmedString = z.string().trim().nullable().optional();
const nullableDateString = z.string().nullable().optional();

export const updateProjectFabricationSchema = z.object({
  title: nullableTrimmedString,
  description: nullableTrimmedString,
  notes: nullableTrimmedString,
  status: z.enum(PROJECT_FABRICATION_STATUSES).optional(),
  plannedStartAt: nullableDateString,
  plannedEndAt: nullableDateString,
  actualStartAt: nullableDateString,
  actualEndAt: nullableDateString,
  progressPercent: z.number().int().min(0).max(100).optional(),
  updatedById: z.string().trim().nullable().optional(),
});

export type UpdateProjectFabricationSchemaInput = z.infer<
  typeof updateProjectFabricationSchema
>;

export const createProjectFabricationItemSchema = z.object({
  fabricationId: z.string().trim().min(1),
  name: z.string().trim().min(1, "El nombre es obligatorio"),
  description: nullableTrimmedString,
  unit: nullableTrimmedString,
  quantity: z.string().trim().nullable().optional(),
  status: z.enum(FABRICATION_ITEM_STATUSES).optional(),
  plannedStartAt: nullableDateString,
  plannedEndAt: nullableDateString,
  actualStartAt: nullableDateString,
  actualEndAt: nullableDateString,
  orderIndex: z.number().int().min(0).optional(),
  notes: nullableTrimmedString,
});

export type CreateProjectFabricationItemSchemaInput = z.infer<
  typeof createProjectFabricationItemSchema
>;

export const updateProjectFabricationItemSchema = z.object({
  name: z.string().trim().min(1).optional(),
  description: nullableTrimmedString,
  unit: nullableTrimmedString,
  quantity: z.string().trim().nullable().optional(),
  status: z.enum(FABRICATION_ITEM_STATUSES).optional(),
  plannedStartAt: nullableDateString,
  plannedEndAt: nullableDateString,
  actualStartAt: nullableDateString,
  actualEndAt: nullableDateString,
  orderIndex: z.number().int().min(0).optional(),
  notes: nullableTrimmedString,
});

export type UpdateProjectFabricationItemSchemaInput = z.infer<
  typeof updateProjectFabricationItemSchema
>;

export const projectFabricationItemFormSchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio"),
  description: nullableTrimmedString,
  unit: nullableTrimmedString,
  quantity: z.string().trim().nullable().optional(),
  status: z.enum(FABRICATION_ITEM_STATUSES).optional(),
  plannedStartAt: nullableDateString,
  plannedEndAt: nullableDateString,
  actualStartAt: nullableDateString,
  actualEndAt: nullableDateString,
  orderIndex: z.number().int().min(0).optional(),
  notes: nullableTrimmedString,
});

export type ProjectFabricationItemFormValues = z.infer<
  typeof projectFabricationItemFormSchema
>;
