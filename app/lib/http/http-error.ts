import {ApiError, type ApiErrorShape} from "./api-error";
export function getErrorMessage(
  status: number,
  body: unknown,
  statusText?: string,
): string {
  if (body && typeof body === "object") {
    const err = body as ApiErrorShape;

    if (err.message) return err.message;
    if (err.error) return err.error;
  }

  if (typeof body === "string" && body) {
    return body;
  }

  return `Request failed (${status}${statusText ? `, ${statusText}` : ""})`;
}

export function toApiError(res: Response, body: unknown) {
  return new ApiError(
    res.status,
    getErrorMessage(res.status, body, res.statusText),
    typeof body === "object" && body !== null
      ? (body as ApiErrorShape)
      : undefined,
  );
}
