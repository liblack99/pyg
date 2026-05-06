import {z} from "zod";
export const clientSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, "Nombre / empresa es obligatorio"),
  documentType: z.string(),
  documentNumber: z.string().min(5, "Número de documento inválido"),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  department: z.string().optional(),
  email: z.email("Correo electrónico inválido").optional(),
  contactName1: z.string().optional().nullable(),
  contactRole1: z.string().optional().nullable(),
  contactPhone1: z.string().optional().nullable(),
  contactName2: z.string().optional().nullable(),
  contactRole2: z.string().optional().nullable(),
  contactPhone2: z.string().optional().nullable(),
});
