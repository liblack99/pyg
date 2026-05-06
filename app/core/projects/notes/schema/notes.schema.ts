import {z} from "zod";
import {ProjectNoteType, ProjectNoteLevel} from "@/app/generated/prisma/enums";

export const createProjectNoteSchema = z.object({
  content: z
    .string()
    .trim()
    .min(3, "La nota debe tener al menos 3 caracteres.")
    .max(2000, "La nota no puede superar 2000 caracteres."),
  type: z.enum(ProjectNoteType).optional().default("GENERAL"),
  level: z.enum(ProjectNoteLevel).optional().default("INFO"),
  pinned: z.boolean().optional().default(false),
});

export type CreateProjectNoteInput = z.infer<typeof createProjectNoteSchema>;

export const createProjectNoteReplySchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "La respuesta no puede estar vacía.")
    .max(1000, "La respuesta no puede superar 1000 caracteres."),
});

export type CreateProjectNoteReplyInput = z.infer<
  typeof createProjectNoteReplySchema
>;
