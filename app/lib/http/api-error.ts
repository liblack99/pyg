export type ApiErrorShape = {
  error?: string;
  message?: string;
  code?: string;
  details?: unknown;
};

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly data?: ApiErrorShape,
  ) {
    super(message);
  }
}
