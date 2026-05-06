import z from "zod";

export const ClientSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  documentType: z.string(),
  documentNumber: z.string().min(1, "El número de documento es obligatorio"),
  email: z.email().optional().nullable(),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  department: z.string().optional().nullable(),
  contactName1: z.string().optional().nullable(),
  contactRole1: z.string().optional().nullable(),
  contactPhone1: z.string().optional().nullable(),
  contactName2: z.string().optional().nullable(),
  contactRole2: z.string().optional().nullable(),
  contactPhone2: z.string().optional().nullable(),
});

export type ClientSchemaForm = z.infer<typeof ClientSchema>;
