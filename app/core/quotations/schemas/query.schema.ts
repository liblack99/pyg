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

  // relaciones
  clientId: z.string().optional(),
  createdById: z.string().optional(),

  // estado
  status: StatusSchema.optional(),

  // fechas
  dateField: DateFieldSchema.optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),

  // montos
  totalMin: z.coerce.number().nonnegative().optional(),
  totalMax: z.coerce.number().nonnegative().optional(),
  reference: z.string().trim().optional(),

  // flags
  hasClient: z.coerce.boolean().optional(),

  // paginación
  limit: z.coerce.number().int().min(1).max(50).optional(),
  cursor: z.string().optional(),
});
