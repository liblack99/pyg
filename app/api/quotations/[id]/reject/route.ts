import {NextResponse} from "next/server";
import {requireAuth} from "@/app/api/_shared/auth";
import {assertHasPermission} from "@/app/api/_shared/auth-dev";
import {handleHttpError} from "@/app/api/_shared/http-error";
import {makeQuotationSimpleActions} from "@/app/core/quotations/usecases/manage/action-simple";
import {quotationRepo} from "@/app/infra/repositories/quotation/quotation.prisma.repo";

export async function POST(req: Request, ctx: {params: Promise<{id: string}>}) {
  try {
    const me = await requireAuth();
    if (!me) return NextResponse.json({error: "Unauthorized"}, {status: 401});
    assertHasPermission(me.role.permissions, "quotation:reject"); // o "quotation:approve" / "quotation:reject" según definas

    const {id} = await ctx.params;
    const body = await req.json().catch(() => ({}));

    const uc = makeQuotationSimpleActions(quotationRepo);
    const result = await uc.reject.execute({id, reason: body.reason});

    return NextResponse.json(result, {status: 200});
  } catch (e: unknown) {
    return handleHttpError(e);
  }
}
