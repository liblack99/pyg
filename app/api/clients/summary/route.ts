import {NextResponse} from "next/server";
import {requireAuth} from "@/app/api/_shared/auth";
import {assertHasPermission} from "@/app/api/_shared/auth-dev";
import {handleHttpError} from "@/app/api/_shared/http-error";
import {makeClientUseCases} from "@/app/core/clients/usecases/";
import {clientRepo} from "@/app/infra/repositories/client/client.prisma.repo";

export async function GET() {
  console.log(" [CLIENT DASHBOARD DEBUG]: Start GET /api/clients/summary");

  try {
    const me = await requireAuth();
    if (!me) {
      console.warn(" [CLIENT DASHBOARD DEBUG]: Unauthorized access attempt");
      return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    assertHasPermission(me.role.permissions, "clients:read");

    const uc = makeClientUseCases(clientRepo);

    console.log(
      " [CLIENT DASHBOARD DEBUG]: Executing Client Summary UseCase...",
    );

    const stats = await uc.summary.execute();

    if (!stats) {
      console.error(" [CLIENT DASHBOARD DEBUG]: UseCase returned undefined");
      return NextResponse.json({error: "No client data found"}, {status: 500});
    }

    console.log(
      " [CLIENT DASHBOARD DEBUG]: Client stats successfully retrieved",
    );

    return NextResponse.json(stats, {status: 200});
  } catch (e: unknown) {
    console.error(" [CLIENT DASHBOARD DEBUG]: Error caught in Route:", e);
    return handleHttpError(e);
  }
}
