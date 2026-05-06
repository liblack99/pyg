// app/api/_shared/auth-dev.ts
import {userRepo} from "@/app/infra/repositories/user/user.prisma.repo";
import {AppError} from "@/app/core/shared/errors/AppError";

export async function getMeFromDevHeader(req: Request) {
  const email = req.headers.get("x-user-email");
  if (!email) return null;

  return userRepo.findByEmailWithPerms(email);
}

/**
 * Verifica un permiso en base a los permisos que vienen del rol.
 * Ojo: esto NO "hardcodea" roles, solo checa una key de permiso.
 */
export function assertHasPermission(perms: string[], key: string) {
  if (!perms.includes(key)) {
    throw new AppError("FORBIDDEN", 403);
  }
}
