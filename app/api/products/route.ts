// app/api/products/route.ts
import {NextResponse} from "next/server";
import {requireAuth} from "@/app/api/_shared/auth";
import {assertHasPermission} from "@/app/api/_shared/auth-dev";
import {handleHttpError} from "@/app/api/_shared/http-error";
import {makeProductUseCases} from "@/app/core/products/usecases";
import {productRepo} from "@/app/infra/repositories/product/product.prisma.repo";
import {ProductSchema} from "@/app/core/products/schemas/product.schema";
import {QuerySchema} from "@/app/core/products/schemas/query.schema";

export async function GET(req: Request) {
  try {
    const me = await requireAuth();
    if (!me) return NextResponse.json({error: "Unauthorized"}, {status: 401});

    assertHasPermission(me.role.permissions, "products:read");

    const url = new URL(req.url);

    const query = QuerySchema.parse({
      search: url.searchParams.get("search") ?? undefined,
      limit: url.searchParams.get("limit") ?? undefined,
      cursor: url.searchParams.get("cursor") ?? undefined,
    });

    const uc = makeProductUseCases(productRepo);
    const result = await uc.listProducts.execute(query);

    return NextResponse.json(result, {status: 200});
  } catch (e: unknown) {
    return handleHttpError(e);
  }
}

export async function POST(req: Request) {
  try {
    const me = await requireAuth();
    if (!me) return NextResponse.json({error: "Unauthorized"}, {status: 401});

    assertHasPermission(me.role.permissions, "products:create");

    const body = ProductSchema.parse(await req.json().catch(() => ({})));

    const uc = makeProductUseCases(productRepo);
    const created = await uc.createProduct.execute({
      ...body,
      createdById: me.id,
    });

    return NextResponse.json(created, {status: 201});
  } catch (e: unknown) {
    return handleHttpError(e);
  }
}
