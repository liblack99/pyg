import {NextResponse} from "next/server";
import {requireAuth} from "@/app/api/_shared/auth";
import {assertHasPermission} from "@/app/api/_shared/auth-dev";
import {handleHttpError} from "@/app/api/_shared/http-error";

// Importamos los UseCases y el Repositorio de Proyectos
import {makeProjectsUseCases} from "@/app/core/projects/usecases";
import {projectRepo} from "@/app/infra/repositories/project/project.prisma.repo";

export async function GET() {
  console.log(" [PROJECT DASHBOARD DEBUG]: Start GET /api/projects/summary");

  try {
    // 1. Verificación de Autenticación
    const me = await requireAuth();
    if (!me) {
      console.warn(" [PROJECT DASHBOARD DEBUG]: Unauthorized access attempt");
      return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }
    assertHasPermission(me.role.permissions, "project:read");
    const uc = makeProjectsUseCases(projectRepo);

    console.log(
      " [PROJECT DASHBOARD DEBUG]: Executing Project Summary UseCase...",
    );

    const stats = await uc.Summary.execute();

    if (!stats) {
      console.error(" [PROJECT DASHBOARD DEBUG]: UseCase returned undefined");
      return NextResponse.json({error: "No project data found"}, {status: 500});
    }

    console.log(
      " [PROJECT DASHBOARD DEBUG]: Project stats successfully retrieved",
      stats,
    );

    return NextResponse.json(stats, {status: 200});
  } catch (e: unknown) {
    console.error(" [PROJECT DASHBOARD DEBUG]: Error caught in Route:", e);
    return handleHttpError(e);
  }
}
