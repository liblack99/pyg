// app/api/products/[id]/route.ts
import {NextResponse} from "next/server";
import {requireAuth} from "@/app/api/_shared/auth";
import {assertHasPermission} from "@/app/api/_shared/auth-dev";
import {handleHttpError} from "@/app/api/_shared/http-error";
import {makeProductUseCases} from "@/app/core/products/usecases";
import {productRepo} from "@/app/infra/repositories/product/product.prisma.repo";
import {ProductSchema} from "@/app/core/products/schemas/product.schema";

export async function GET(req: Request, ctx: {params: Promise<{id: string}>}) {
  try {
    const me = await requireAuth();
    if (!me) return NextResponse.json({error: "Unauthorized"}, {status: 401});

    assertHasPermission(me.role.permissions, "products:read");

    const {id} = await ctx.params;

    const uc = makeProductUseCases(productRepo);
    const product = await uc.getProductById.execute(id);

    if (!product) return NextResponse.json({error: "Not found"}, {status: 404});

    return NextResponse.json(product, {status: 200});
  } catch (e: unknown) {
    return handleHttpError(e);
  }
}

export async function PUT(req: Request, ctx: {params: Promise<{id: string}>}) {
  try {
    const me = await requireAuth();
    if (!me) return NextResponse.json({error: "Unauthorized"}, {status: 401});

    assertHasPermission(me.role.permissions, "products:update");

    const {id} = await ctx.params;
    const body = ProductSchema.parse(await req.json().catch(() => ({})));

    const uc = makeProductUseCases(productRepo);
    const updated = await uc.updateProduct.execute(id, body);

    return NextResponse.json(updated, {status: 200});
  } catch (e: unknown) {
    return handleHttpError(e);
  }
}

export async function DELETE(
  req: Request,
  ctx: {params: Promise<{id: string}>},
) {
  try {
    const me = await requireAuth();
    if (!me) return NextResponse.json({error: "Unauthorized"}, {status: 401});

    assertHasPermission(me.role.permissions, "products:delete");

    const {id} = await ctx.params;

    const uc = makeProductUseCases(productRepo);
    await uc.deleteProduct.execute(id);

    return NextResponse.json({ok: true}, {status: 200});
  } catch (e: unknown) {
    return handleHttpError(e);
  }
}
