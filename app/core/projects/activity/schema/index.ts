import {z} from "zod";
import {
  PROJECT_ACTIVITY_MODULES,
  PROJECT_ALERT_SEVERITIES,
  PROJECT_ALERT_STATUSES,
  PROJECT_ALERT_TYPES,
  PROJECT_EVENT_TYPES,
} from "../dto";

const metadataSchema = z.record(z.string(), z.unknown()).nullable().optional();

export const createProjectEventSchema = z.object({
  type: z.enum(PROJECT_EVENT_TYPES),
  module: z.enum(PROJECT_ACTIVITY_MODULES),
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().max(500).nullable().optional(),
  entityId: z.string().trim().nullable().optional(),
  metadata: metadataSchema,
  createdById: z.string().trim().nullable().optional(),
});

export const createProjectAlertSchema = z.object({
  type: z.enum(PROJECT_ALERT_TYPES),
  module: z.enum(PROJECT_ACTIVITY_MODULES),
  severity: z.enum(PROJECT_ALERT_SEVERITIES),
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().max(500).nullable().optional(),
  entityId: z.string().trim().nullable().optional(),
  metadata: metadataSchema,
  createdById: z.string().trim().nullable().optional(),
});

export const listProjectActivityQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).optional(),
});

export const listProjectAlertsQuerySchema = listProjectActivityQuerySchema.extend({
  status: z.enum(PROJECT_ALERT_STATUSES).optional(),
});
