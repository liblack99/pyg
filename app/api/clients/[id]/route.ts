import {NextResponse} from "next/server";
import {requireAuth} from "@/app/api/_shared/auth";
import {assertHasPermission} from "@/app/api/_shared/auth-dev";
import {handleHttpError} from "@/app/api/_shared/http-error";
import {makeClientUseCases} from "@/app/core/clients/usecases";
import {clientRepo} from "@/app/infra/repositories/client/client.prisma.repo";
import {ClientSchema} from "@/app/core/clients/schema/client.schema";

export async function GET(
  req: Request,
  {params}: {params: Promise<{id: string}>},
) {
  const {id} = await params;
  try {
    const me = await requireAuth();
    if (!me) return NextResponse.json({error: "Unauthorized"}, {status: 401});
    assertHasPermission(me.role.permissions, "clients:manage");

    const uc = makeClientUseCases(clientRepo);
    const client = await uc.getClientById.execute({id});
    return NextResponse.json(client, {status: 200});
  } catch (e: unknown) {
    return handleHttpError(e);
  }
}

export async function PUT(
  req: Request,
  {params}: {params: Promise<{id: string}>},
) {
  const {id} = await params;
  try {
    const me = await requireAuth();
    if (!me) return NextResponse.json({error: "Unauthorized"}, {status: 401});
    assertHasPermission(me.role.permissions, "clients:manage");

    const body = ClientSchema.parse(await req.json());
    const uc = makeClientUseCases(clientRepo);
    const updated = await uc.updateClient.execute(id, body);
    return NextResponse.json(updated, {status: 200});
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
    assertHasPermission(me.role.permissions, "clients:manage");

    const uc = makeClientUseCases(clientRepo);
    await uc.deleteClient.execute(id);
    return NextResponse.json({ok: true}, {status: 200});
  } catch (e: unknown) {
    return handleHttpError(e);
  }
}
