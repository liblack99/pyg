import {NextResponse} from "next/server";
import {assertHasPermission} from "@/app/api/_shared/auth-dev";
import {handleHttpError} from "@/app/api/_shared/http-error";
import {requireAuth} from "@/app/api/_shared/auth";
import {makeQuotationQueryUseCases} from "@/app/core/quotations/usecases/queries";
import {quotationRepo} from "@/app/infra/repositories/quotation/quotation.prisma.repo";

export async function GET() {
  console.log(" [DASHBOARD DEBUG]: Start GET /api/quotations/stats");
  try {
    const me = await requireAuth();
    if (!me) {
      console.warn(" [DASHBOARD DEBUG]: Unauthorized access attempt");
      return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    assertHasPermission(me.role.permissions, "quotation:read");

    const uc = makeQuotationQueryUseCases(quotationRepo);

    console.log(" [DASHBOARD DEBUG]: Executing UseCase Summary...");
    const stats = await uc.summary.execute();

    // LOG CRÍTICO: Ver qué campos tiene el objeto antes de serializar
    console.log(
      " [DASHBOARD DEBUG]: Stats result received:",
      JSON.stringify(
        stats,
        (key, value) => (typeof value === "bigint" ? value.toString() : value), // Evita error de BigInt en console.log
        2,
      ),
    );

    return NextResponse.json(stats, {status: 200});
  } catch (e: unknown) {
    console.error(" [DASHBOARD DEBUG]: Error caught in Route:", e);
    return handleHttpError(e);
  }
}
