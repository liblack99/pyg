import {cookies} from "next/headers";
import {jwtVerify, SignJWT} from "jose";
import {userRepo} from "@/app/infra/repositories/user/user.prisma.repo";
import {AppError} from "@/app/core/shared/errors/AppError";

const COOKIE_NAME = "pyg_auth";

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET is not configured");
  }
  return new TextEncoder().encode(secret);
}

type AuthPayload = {
  sub: string; // userId
  email: string;
  role: string;
};

export async function createAuthToken(payload: AuthPayload) {
  const secret = getSecret();

  return await new SignJWT({
    email: payload.email,
    role: payload.role,
  })
    .setProtectedHeader({alg: "HS256"})
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyAuthToken(token: string) {
  const secret = getSecret();

  const {payload} = await jwtVerify(token, secret);
  return payload;
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    console.log("🔍 [Auth] No se encontró la cookie:", COOKIE_NAME);
    return null;
  }

  try {
    console.log("🔍 [Auth] Token encontrado, verificando...");

    const payload = await verifyAuthToken(token);

    console.log("🔍 [Auth] Payload decodificado:", payload);

    const userId = payload.sub;

    if (!userId) {
      console.log("❌ [Auth] El payload no contiene 'sub' (userId)");
      return null;
    }

    console.log(`🔍 [Auth] Buscando usuario en DB con ID: ${userId}...`);
    const user = await userRepo.findByIdWithPerms(userId);

    if (!user) {
      console.log(
        `❌ [Auth] Usuario con ID ${userId} no existe en la base de datos.`,
      );
      return null;
    }

    console.log("✅ [Auth] Usuario recuperado con éxito:", user.email);
    return user;
  } catch (error) {
    console.error(
      "❌ [Auth] Error durante la verificación del token o DB:",
      error,
    );
    return null;
  }
}

export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    throw new AppError("UNAUTHORIZED", 401);
  }

  return user;
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 días
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
