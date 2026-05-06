// app/api/users/[id]/route.ts
import {NextResponse} from "next/server";
import {z} from "zod";
import {requireAuth} from "@/app/api/_shared/auth";
import {assertHasPermission} from "@/app/api/_shared/auth-dev";
import {userRepo} from "@/app/infra/repositories/user/user.prisma.repo";
import {roleRepo} from "@/app/infra/repositories/role/role.prisma.repo";
import {makeUserUseCases} from "@/app/core/users/usecases";
import {handleHttpError} from "@/app/api/_shared/http-error";

const UpdateUserSchema = z.object({
  name: z.string().min(1).optional(),
  roleId: z.string().min(1).optional(),
});

export async function PUT(req: Request, ctx: {params: Promise<{id: string}>}) {
  try {
    const me = await requireAuth();
    if (!me) return NextResponse.json({error: "Unauthorized"}, {status: 401});

    assertHasPermission(me.role.permissions, "users:manage");

    const {id} = await ctx.params;
    const body = UpdateUserSchema.parse(await req.json());

    const uc = makeUserUseCases(userRepo, roleRepo);
    const updated = await uc.updateUser.execute(id, body);

    return NextResponse.json(updated);
  } catch (e: unknown) {
    return handleHttpError(e);
  }
}

export async function DELETE(
  req: Request,
  {params}: {params: Promise<{id: string}>},
) {
  const {id} = await params;

  try {
    const me = await requireAuth();
    if (!me) return NextResponse.json({error: "Unauthorized"}, {status: 401});

    assertHasPermission(me.role.permissions, "users:manage");

    const uc = makeUserUseCases(userRepo, roleRepo);
    await uc.deleteUser.execute(id);

    return NextResponse.json({ok: true}, {status: 200});
  } catch (e: unknown) {
    return handleHttpError(e);
  }
}

export async function GET(
  req: Request,
  {params}: {params: Promise<{id: string}>},
) {
  const {id} = await params;
  console.log("API GET /api/users/[id] params.id =", id);
  console.log("API GET url =", req.url);
  try {
    const me = await requireAuth();
    if (!me) return NextResponse.json({error: "Unauthorized"}, {status: 401});

    assertHasPermission(me.role.permissions, "users:manage");

    const uc = makeUserUseCases(userRepo, roleRepo);
    const user = await uc.getUserById.execute({id});

    return NextResponse.json(user, {status: 200});
  } catch (e: unknown) {
    return handleHttpError(e);
  }
}
