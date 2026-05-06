// app/api/integrations/zoho/callback/route.ts
import {NextRequest, NextResponse} from "next/server";
import {ZohoOAuthService} from "@/app/infra/repositories/integrations/zoho/zoho-oauth.service";
import {handleHttpError, logRouteInfo} from "@/app/api/_shared/http-error";

export async function GET(req: NextRequest) {
  const startedAt = Date.now();
  const route = "/api/integrations/zoho/callback";
  const code = req.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json({error: "Missing code"}, {status: 400});
  }

  try {
    logRouteInfo("Starting Zoho OAuth callback", {
      route,
      method: "GET",
      query: {code: "[present]"},
      startedAt,
    });

    const tokens = await ZohoOAuthService.exchangeCodeForTokens(code);
    logRouteInfo("Zoho OAuth callback completed", {
      route,
      method: "GET",
      startedAt,
      meta: {
        accessToken: Boolean(tokens?.access_token),
        refreshToken: Boolean(tokens?.refresh_token),
      },
    });

    return NextResponse.json({
      message: "Zoho conectado correctamente",
      tokens,
    });
  } catch (err) {
    return handleHttpError(err, {
      route,
      method: "GET",
      query: {code: "[present]"},
      step: "exchangeCodeForTokens",
      startedAt,
    });
  }
}
