import {NextResponse} from "next/server";
import {requireAuth} from "@/app/api/_shared/auth";
import {assertHasPermission} from "@/app/api/_shared/auth-dev";
import {handleHttpError} from "@/app/api/_shared/http-error";
import {makeQuotationQueryUseCases} from "@/app/core/quotations/usecases/queries";
import {makeQuotationSimpleActions} from "@/app/core/quotations/usecases/manage/action-simple";
import {quotationRepo} from "@/app/infra/repositories/quotation/quotation.prisma.repo";

export async function GET(req: Request, ctx: {params: Promise<{id: string}>}) {
  try {
    const me = await requireAuth();
    if (!me) return NextResponse.json({error: "Unauthorized"}, {status: 401});
    assertHasPermission(me.role.permissions, "quotation:read");

    const {id} = await ctx.params;

    const uc = makeQuotationQueryUseCases(quotationRepo);
    const q = await uc.getById.execute({id});

    return NextResponse.json(q, {status: 200});
  } catch (e: unknown) {
    return handleHttpError(e);
  }
}

export async function PUT(req: Request, ctx: {params: Promise<{id: string}>}) {
  try {
    const me = await requireAuth();
    if (!me) return NextResponse.json({error: "Unauthorized"}, {status: 401});
    assertHasPermission(me.role.permissions, "quotation:update");

    const {id} = await ctx.params;
    const body = await req.json().catch(() => ({}));

    const uc = makeQuotationSimpleActions(quotationRepo);
    const updated = await uc.update.execute({id, ...body});

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
    assertHasPermission(me.role.permissions, "quotation:delete");

    const {id} = await ctx.params;

    const uc = makeQuotationSimpleActions(quotationRepo);
    const deleted = await uc.delete.execute(id);

    return NextResponse.json(deleted, {status: 200});
  } catch (e: unknown) {
    return handleHttpError(e);
  }
}
