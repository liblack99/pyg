// app/dashboard/users/user.schemas.ts
import {z} from "zod";

export const CreateUserFormSchema = z.object({
  name: z.string().trim().min(1, "Nombre requerido"),
  email: z.email("Email inválido"),
  roleId: z.string().min(1, "Rol requerido"),
});

export type CreateUserFormValues = z.infer<typeof CreateUserFormSchema>;
