import {NextResponse} from "next/server";
import {AppError} from "../../core/shared/errors/AppError";

type HttpErrorContext = {
  route?: string;
  method?: string;
  params?: unknown;
  query?: unknown;
  body?: unknown;
  step?: string;
  startedAt?: number;
  meta?: Record<string, unknown>;
};

function createErrorId() {
  return `api_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function detectCallerRoute() {
  const stack = new Error().stack ?? "";
  const line = stack
    .split("\n")
    .find((entry) => entry.includes("app\\api\\") && entry.includes("route."));

  if (!line) return null;

  const normalized = line.replace(/\//g, "\\");
  const match = normalized.match(/app\\api\\(.+?\\route)\.(ts|js)/i);

  if (!match) return null;

  return `/api/${match[1].replace(/\\route$/i, "").replace(/\\/g, "/")}`;
}

function serializeForLog(value: unknown, depth = 0): unknown {
  if (value === null || value === undefined) return value;
  if (depth > 3) return "[max-depth]";
  if (value instanceof Date) return value.toISOString();
  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
      stack: value.stack,
    };
  }
  if (Array.isArray(value)) {
    return value.map((item) => serializeForLog(item, depth + 1));
  }
  if (typeof value === "object") {
    const input = value as Record<string, unknown>;
    const output: Record<string, unknown> = {};

    for (const [key, raw] of Object.entries(input)) {
      const lowerKey = key.toLowerCase();

      if (
        lowerKey.includes("password") ||
        lowerKey.includes("token") ||
        lowerKey.includes("secret") ||
        lowerKey.includes("authorization") ||
        lowerKey.includes("cookie")
      ) {
        output[key] = "[redacted]";
        continue;
      }

      output[key] = serializeForLog(raw, depth + 1);
    }

    return output;
  }

  return value;
}

function getStatus(error: unknown) {
  if (error instanceof AppError) return error.status;
  if (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    typeof (error as {status?: unknown}).status === "number"
  ) {
    return (error as {status: number}).status;
  }
  return 500;
}

export function logRouteInfo(message: string, context?: HttpErrorContext) {
  console.info("[API INFO]", {
    route: context?.route ?? detectCallerRoute(),
    method: context?.method ?? "UNKNOWN",
    step: context?.step,
    params: serializeForLog(context?.params),
    query: serializeForLog(context?.query),
    meta: serializeForLog(context?.meta),
    message,
  });
}

export function handleHttpError(error: unknown, context?: HttpErrorContext) {
  const errorId = createErrorId();
  const status = getStatus(error);
  const route = context?.route ?? detectCallerRoute();
  const durationMs = context?.startedAt ? Date.now() - context.startedAt : undefined;

  const logPayload = {
    errorId,
    route,
    method: context?.method ?? "UNKNOWN",
    status,
    step: context?.step,
    durationMs,
    params: serializeForLog(context?.params),
    query: serializeForLog(context?.query),
    body: serializeForLog(context?.body),
    meta: serializeForLog(context?.meta),
    error: serializeForLog(error),
  };

  console.error("[API ERROR]", logPayload);

  if (error instanceof AppError) {
    return NextResponse.json(
      {error: error.message, errorId},
      {status: error.status},
    );
  }

  if (error instanceof Error) {
    return NextResponse.json(
      {error: error.message, errorId},
      {status},
    );
  }

  return NextResponse.json({error: "Unknown error", errorId}, {status});
}
