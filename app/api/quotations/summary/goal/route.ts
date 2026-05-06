import {NextResponse} from "next/server";
import {z} from "zod";
import {assertHasPermission} from "@/app/api/_shared/auth-dev";
import {handleHttpError} from "@/app/api/_shared/http-error";
import {requireAuth} from "@/app/api/_shared/auth";
import {makeQuotationQueryUseCases} from "@/app/core/quotations/usecases/queries";
import {quotationRepo} from "@/app/infra/repositories/quotation/quotation.prisma.repo";
import {logger} from "@/app/lib/logger";

const GoalSchema = z.object({
  monthlySalesGoal: z.coerce.number().min(0),
});

export async function GET() {
  try {
    const me = await requireAuth();
    if (!me) {
      return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    assertHasPermission(me.role.permissions, "quotation:read");

    const uc = makeQuotationQueryUseCases(quotationRepo);
    const goal = await uc.getDashboardGoal.execute();

    return NextResponse.json(goal, {status: 200});
  } catch (e: unknown) {
    return handleHttpError(e);
  }
}

export async function PUT(req: Request) {
  try {
    const me = await requireAuth();
    if (!me) {
      return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    assertHasPermission(me.role.permissions, "quotation:update");

    const body = GoalSchema.parse(await req.json().catch(() => ({})));

    logger.info("api.quotations.summary.goal", "Updating monthly sales goal", {
      userId: me.id,
      monthlySalesGoal: body.monthlySalesGoal,
    });

    const uc = makeQuotationQueryUseCases(quotationRepo);
    const updated = await uc.updateDashboardGoal.execute(body);

    return NextResponse.json(updated, {status: 200});
  } catch (e: unknown) {
    return handleHttpError(e);
  }
}
