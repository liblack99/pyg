import {NextResponse} from "next/server";
import {requireAuth} from "@/app/api/_shared/auth";
import {assertHasPermission} from "@/app/api/_shared/auth-dev";
import {handleHttpError} from "@/app/api/_shared/http-error";
import {makeProjectFinanceUseCases} from "@/app/core/projects/finance/usecases";
import {projectFinancePrismaRepo} from "@/app/infra/repositories/project/finance/project-finance.prisma.repo";

export async function GET(req: Request, ctx: {params: Promise<{id: string}>}) {
  try {
    const me = await requireAuth();
    if (!me) return NextResponse.json({error: "Unauthorized"}, {status: 401});

    const {id: projectId} = await ctx.params;

    assertHasPermission(me.role.permissions, "project:read");

    const uc = makeProjectFinanceUseCases(projectFinancePrismaRepo);
    const result = await uc.getProjectFinance.execute(projectId);

    return NextResponse.json(result, {status: 200});
  } catch (e: unknown) {
    return handleHttpError(e);
  }
}
