import {NextResponse} from "next/server";
import {requireAuth} from "@/app/api/_shared/auth";
import {assertHasPermission} from "../_shared/auth-dev";
import {handleHttpError} from "../_shared/http-error";
import {makeClientUseCases} from "../../core/clients/usecases";
import {clientRepo} from "@/app/infra/repositories/client/client.prisma.repo";
import {ClientSchema} from "@/app/core/clients/schema/client.schema";
import {QuerySchema} from "@/app/core/clients/schema/query.schema";

export async function GET(req: Request) {
  try {
    const me = await requireAuth();
    if (!me) return NextResponse.json({error: "Unauthorized"}, {status: 401});

    assertHasPermission(me.role.permissions, "clients:manage");

    const url = new URL(req.url);

    const query = QuerySchema.parse({
      search: url.searchParams.get("search") ?? undefined,
      limit: url.searchParams.get("limit") ?? undefined,
      cursor: url.searchParams.get("cursor") ?? undefined,
    });

    const uc = makeClientUseCases(clientRepo);

    const result = await uc.listClients.execute({
      search: query.search,
      limit: query.limit,
      cursor: query.cursor,
    });

    return NextResponse.json(result, {status: 200});
  } catch (e: unknown) {
    return handleHttpError(e);
  }
}
export async function POST(req: Request) {
  try {
    const me = await requireAuth();
    if (!me) {
      return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    assertHasPermission(me.role.permissions, "clients:manage");

    const body = await req.json();
    const data = ClientSchema.parse(body);

    const uc = makeClientUseCases(clientRepo);

    const client = await uc.createClient.execute({...data, createdById: me.id});

    return NextResponse.json(client, {status: 201});
  } catch (e: unknown) {
    return handleHttpError(e);
  }
}
