import {NextResponse} from "next/server";
import {requireAuth} from "@/app/api/_shared/auth";
import {assertHasPermission} from "@/app/api/_shared/auth-dev";
import {handleHttpError} from "@/app/api/_shared/http-error";
import {makeQuotationCreationActions} from "@/app/core/quotations/usecases/manage/creation";
import {quotationRepo} from "@/app/infra/repositories/quotation/quotation.prisma.repo";
import {quotationNumberingRepo} from "@/app/infra/repositories/quotation/numbering/quotationNumbering.prisma.repo";

export async function POST(req: Request, ctx: {params: Promise<{id: string}>}) {
  try {
    const me = await requireAuth();
    if (!me) return NextResponse.json({error: "Unauthorized"}, {status: 401});

    assertHasPermission(me.role.permissions, "quotation:update");

    const {id} = await ctx.params;

    const uc = makeQuotationCreationActions(
      quotationRepo,
      quotationNumberingRepo,
    );
    const created = await uc.duplicate.execute({
      sourceId: id,
      createdById: me.id,
    });

    return NextResponse.json(created, {status: 201});
  } catch (e: unknown) {
    return handleHttpError(e);
  }
}
