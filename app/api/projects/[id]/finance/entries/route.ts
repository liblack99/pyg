import {NextResponse} from "next/server";
import {requireAuth} from "@/app/api/_shared/auth";
import {assertHasPermission} from "@/app/api/_shared/auth-dev";
import {handleHttpError} from "@/app/api/_shared/http-error";
import {createProjectFinanceEntrySchema} from "@/app/core/projects/finance/schema";
import {makeProjectFinanceUseCases} from "@/app/core/projects/finance/usecases";
import {projectFinancePrismaRepo} from "@/app/infra/repositories/project/finance/project-finance.prisma.repo";
import {makeProjectActivityUseCases} from "@/app/core/projects/activity/usecases";
import {projectActivityPrismaRepo} from "@/app/infra/repositories/project/activity/project-activity.prisma.repo";

export async function POST(req: Request, ctx: {params: Promise<{id: string}>}) {
  try {
    const me = await requireAuth();
    if (!me) return NextResponse.json({error: "Unauthorized"}, {status: 401});

    const {id: projectId} = await ctx.params;

    assertHasPermission(me.role.permissions, "project:update");

    const body = await req.json().catch(() => ({}));
    const input = createProjectFinanceEntrySchema.parse(body);

    const uc = makeProjectFinanceUseCases(projectFinancePrismaRepo);
    const result = await uc.createProjectFinanceEntry.execute(projectId, {
      ...input,
      createdById: me.id,
    });

    const activity = makeProjectActivityUseCases(projectActivityPrismaRepo);
    await activity.createProjectEvent.execute(projectId, {
      type: "FINANCE_ENTRY_CREATED",
      module: "FINANCE",
      title: "Movimiento financiero registrado",
      description: result.description,
      entityId: result.id,
      metadata: {
        type: result.type,
        category: result.category,
        amount: result.amount,
      },
      createdById: me.id,
    });
    await activity.syncProjectAlerts.execute(projectId);

    return NextResponse.json(result, {status: 201});
  } catch (e: unknown) {
    return handleHttpError(e);
  }
}
