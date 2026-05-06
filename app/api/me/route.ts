import {NextResponse} from "next/server";
import {getCurrentUser} from "@/app/api/_shared/auth";
import {handleHttpError} from "@/app/api/_shared/http-error";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    return NextResponse.json(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.name,
        permissions: user.role.permissions,
      },
      {status: 200},
    );
  } catch (e: unknown) {
    return handleHttpError(e);
  }
}
