// app/lib/api.client.ts

import {toApiError} from "./http/http-error";

async function parseResponseBody(res: Response) {
  const isJson = (res.headers.get("content-type") || "").includes(
    "application/json",
  );

  return isJson
    ? await res.json().catch(() => null)
    : await res.text().catch(() => null);
}

export async function apiGet<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    method: "GET",
    cache: "no-store",
    credentials: "include",
  });

  const body = await parseResponseBody(res);

  if (!res.ok) {
    throw toApiError(res, body);
  }

  return body as T;
}

export async function apiGetFile(url: string): Promise<{
  blob: Blob;
  filename?: string;
  contentType?: string;
}> {
  const res = await fetch(url, {
    method: "GET",
    cache: "no-store",
    credentials: "include",
  });

  if (!res.ok) {
    const body = await parseResponseBody(res);
    throw toApiError(res, body);
  }

  const blob = await res.blob();
  const contentType = res.headers.get("content-type") ?? undefined;

  const cd = res.headers.get("content-disposition") ?? "";
  const match = /filename\*?=(?:UTF-8'')?("?)([^";]+)\1/i.exec(cd);
  const filename = match?.[2] ? decodeURIComponent(match[2]) : undefined;

  return {blob, filename, contentType};
}

export async function apiPostFile<TBody>(
  url: string,
  body: TBody,
): Promise<{
  blob: Blob;
  filename?: string;
  contentType?: string;
}> {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
    credentials: "include",
  });

  if (!res.ok) {
    const responseBody = await parseResponseBody(res);
    throw toApiError(res, responseBody);
  }

  const blob = await res.blob();
  const contentType = res.headers.get("content-type") ?? undefined;

  const cd = res.headers.get("content-disposition") ?? "";
  const match = /filename\*?=(?:UTF-8'')?("?)([^";]+)\1/i.exec(cd);
  const filename = match?.[2] ? decodeURIComponent(match[2]) : undefined;

  return {blob, filename, contentType};
}

export async function apiPost<T>(url: string, data: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
  });

  const body = await parseResponseBody(res);

  if (!res.ok) {
    throw toApiError(res, body);
  }

  return body as T;
}

export async function apiPut<T>(url: string, data: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
  });

  const body = await parseResponseBody(res);

  if (!res.ok) {
    throw toApiError(res, body);
  }

  return body as T;
}

export async function apiPatch<T>(url: string, data: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
  });

  const body = await parseResponseBody(res);

  if (!res.ok) {
    throw toApiError(res, body);
  }

  return body as T;
}

export async function apiDelete(url: string): Promise<void> {
  const res = await fetch(url, {
    method: "DELETE",
    cache: "no-store",
    credentials: "include",
  });

  if (!res.ok) {
    const body = await parseResponseBody(res);
    throw toApiError(res, body);
  }
}
