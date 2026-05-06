import {NextResponse} from "next/server";

import {quotationRepo} from "@/app/infra/repositories/quotation/quotation.prisma.repo";
import {handleHttpError} from "@/app/api/_shared/http-error";
import {assertHasPermission} from "@/app/api/_shared/auth-dev";
import {requireAuth} from "@/app/api/_shared/auth";
import {BodySchema} from "@/app/core/quotations/schemas/notes.schema";

import {makeQuotationSimpleActions} from "@/app/core/quotations/usecases/manage/action-simple";

export async function PUT(req: Request, ctx: {params: Promise<{id: string}>}) {
  try {
    const me = await requireAuth();
    if (!me) return NextResponse.json({error: "Unauthorized"}, {status: 401});

    assertHasPermission(me.role.permissions, "quotation:update");

    const {id} = await ctx.params;

    const body = BodySchema.parse(await req.json());

    const uc = await makeQuotationSimpleActions(quotationRepo);

    const addNote = uc.addNote.execute(id, body.note);

    return NextResponse.json(addNote);
  } catch (error) {
    return handleHttpError(error);
  }
}
