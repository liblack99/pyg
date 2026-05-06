// app/lib/fetch.server.ts
import {cookies} from "next/headers";
import {toApiError} from "./http/http-error";

function getBaseUrl() {
  const envBase = process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL;
  if (envBase) return envBase.replace(/\/$/, "");
  return "http://localhost:3000";
}

type FetchServerOptions = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
};

async function parseResponseBody(res: Response): Promise<unknown> {
  const isJson = (res.headers.get("content-type") || "").includes(
    "application/json",
  );

  return isJson
    ? await res.json().catch(() => null)
    : await res.text().catch(() => null);
}

export async function fetchServer<T>(
  url: string,
  options?: FetchServerOptions,
): Promise<T> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const headers: Record<string, string> = {
    ...(options?.headers ?? {}),
  };

  if (cookieHeader) {
    headers.cookie = cookieHeader;
  }

  if (options?.body !== undefined && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const absoluteUrl = url.startsWith("http")
    ? url
    : `${getBaseUrl()}${url.startsWith("/") ? "" : "/"}${url}`;

  const res = await fetch(absoluteUrl, {
    method: options?.method ?? "GET",
    headers,
    cache: "no-store",
    body:
      options?.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  const body = await parseResponseBody(res);

  if (!res.ok) {
    throw toApiError(res, body);
  }

  return body as T;
}
