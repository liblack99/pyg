// app/api/quotations/draft/route.ts
import {NextResponse} from "next/server";
import {assertHasPermission} from "@/app/api/_shared/auth-dev";
import {handleHttpError} from "@/app/api/_shared/http-error";
import {requireAuth} from "@/app/api/_shared/auth";
import {makeQuotationCreationActions} from "@/app/core/quotations/usecases/manage/creation";
import {quotationRepo} from "../../../infra/repositories/quotation/quotation.prisma.repo";
import {quotationNumberingRepo} from "@/app/infra/repositories/quotation/numbering/quotationNumbering.prisma.repo";

export async function POST(req: Request) {
  try {
    const me = await requireAuth();
    if (!me) return NextResponse.json({error: "Unauthorized"}, {status: 401});

    console.log("body del request", req.body);

    assertHasPermission(me.role.permissions, "quotation:create");
    const body = await req.json();

    const uc = makeQuotationCreationActions(
      quotationRepo,
      quotationNumberingRepo,
    );

    const draft = await uc.create.execute({createdById: me.id, ...body});

    return NextResponse.json(draft, {status: 201});
  } catch (e: unknown) {
    return handleHttpError(e);
  }
}
