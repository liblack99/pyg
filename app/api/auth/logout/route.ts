import {NextResponse} from "next/server";
import {clearAuthCookie} from "@/app/api/_shared/auth";

export async function POST() {
  await clearAuthCookie();

  return NextResponse.json({ok: true}, {status: 200});
}
