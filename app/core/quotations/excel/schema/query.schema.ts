import {z} from "zod";
const StatusSchema = z.enum([
  "DRAFT",
  "SENT",
  "APPROVED",
  "REJECTED",
  "EXPIRED",
  "CANCELLED",
]);

const DateFieldSchema = z.enum([
  "createdAt",
  "date",
  "sentAt",
  "approvedAt",
  "rejectedAt",
  "cancelledAt",
  "expiredAt",
]);

export const QuerySchema = z.object({
  // búsqueda
  search: z.string().trim().min(1).optional(),
  numberQuotation: z.string().trim().optional(),
  clientId: z.string().optional(),
  createdById: z.string().optional(),
  status: StatusSchema.optional(),
  dateField: DateFieldSchema.optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
  totalMin: z.coerce.number().nonnegative().optional(),
  totalMax: z.coerce.number().nonnegative().optional(),
  hasClient: z.coerce.boolean().optional(),
});
