import {NextResponse} from "next/server";
import {requireAuth} from "@/app/api/_shared/auth";
import {assertHasPermission} from "@/app/api/_shared/auth-dev";
import {handleHttpError} from "@/app/api/_shared/http-error";
import {quotationNumberingRepo} from "@/app/infra/repositories/quotation/numbering/quotationNumbering.prisma.repo";

export async function GET() {
  try {
    const me = await requireAuth();
    if (!me) {
      return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    assertHasPermission(me.role.permissions, "quotation:create");

    const nextNumberQuotation =
      await quotationNumberingRepo.previewNextNumberQuotation();

    return NextResponse.json({nextNumberQuotation}, {status: 200});
  } catch (e: unknown) {
    return handleHttpError(e);
  }
}
