// app/api/roles/route.ts
import {NextResponse} from "next/server";
import {assertHasPermission} from "../_shared/auth-dev";
import {roleRepo} from "@/app/infra/repositories/role/role.prisma.repo";
import {userRepo} from "@/app/infra/repositories/user/user.prisma.repo";
import {makeUserUseCases} from "../../core/users/usecases";
import {handleHttpError} from "../_shared/http-error";
import {requireAuth} from "@/app/api/_shared/auth";

export async function GET() {
  try {
    const me = await requireAuth();
    if (!me) return NextResponse.json({error: "Unauthorized"}, {status: 401});

    assertHasPermission(me.role.permissions, "roles:manage");

    // Usecases (inyección)
    const uc = makeUserUseCases(userRepo, roleRepo);
    const roles = await uc.roles.list();

    return NextResponse.json(roles);
  } catch (e: unknown) {
    return handleHttpError(e, {
      route: "/api/roles",
      method: "GET",
      step: "listRoles",
    });
  }
}
