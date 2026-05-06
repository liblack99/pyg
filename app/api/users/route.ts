// app/api/users/route.ts
import {NextResponse} from "next/server";
import {assertHasPermission} from "@/app/api/_shared/auth-dev";
import {userRepo} from "@/app/infra/repositories/user/user.prisma.repo";
import {roleRepo} from "@/app/infra/repositories/role/role.prisma.repo";
import {makeUserUseCases} from "@/app/core/users/usecases";
import {handleHttpError} from "@/app/api/_shared/http-error";
import {CreateUserFormSchema} from "@/app/core/users/schemas/user.schemas";
import {requireAuth} from "@/app/api/_shared/auth";

export async function GET() {
  try {
    const me = await requireAuth();
    if (!me) return NextResponse.json({error: "Unauthorized"}, {status: 401});

    assertHasPermission(me.role.permissions, "users:manage");

    const uc = makeUserUseCases(userRepo, roleRepo);
    const users = await uc.listUsers.execute();

    return NextResponse.json(users);
  } catch (e: unknown) {
    return handleHttpError(e);
  }
}

export async function POST(req: Request) {
  try {
    const me = await requireAuth();
    if (!me) return NextResponse.json({error: "Unauthorized"}, {status: 401});

    assertHasPermission(me.role.permissions, "users:manage");

    const body = CreateUserFormSchema.parse(await req.json());

    const uc = makeUserUseCases(userRepo, roleRepo);
    const created = await uc.createUser.execute({
      email: body.email.toLowerCase(),
      name: body.name,
      roleId: body.roleId,
    });

    return NextResponse.json(created, {status: 201});
  } catch (e: unknown) {
    return handleHttpError(e);
  }
}
