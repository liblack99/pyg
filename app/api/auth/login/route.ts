import {NextResponse} from "next/server";
import bcrypt from "bcryptjs";
import {z} from "zod";
import {userRepo} from "@/app/infra/repositories/user/user.prisma.repo";
import {createAuthToken, setAuthCookie} from "../../_shared/auth";
import {handleHttpError} from "../../_shared/http-error";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const input = LoginSchema.parse(body);

    const user = await userRepo.findByEmailWithPerms(input.email);

    if (!user || !user.passwordHash) {
      return NextResponse.json(
        {error: "Credenciales inválidas"},
        {status: 401},
      );
    }

    const ok = await bcrypt.compare(input.password, user.passwordHash);

    if (!ok) {
      return NextResponse.json(
        {error: "Credenciales inválidas"},
        {status: 401},
      );
    }

    const token = await createAuthToken({
      sub: user.id,
      email: user.email,
      role: user.role.name,
    });

    await setAuthCookie(token);
    await userRepo.updateLastLogin(user.id);

    return NextResponse.json(
      {
        ok: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role.name,
          permissions: user.role.permissions,
        },
      },
      {status: 200},
    );
  } catch (e: unknown) {
    return handleHttpError(e);
  }
}
