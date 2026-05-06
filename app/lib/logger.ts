type LogLevel = "info" | "warn" | "error";

type LogMeta = Record<string, unknown> | undefined;

function write(level: LogLevel, scope: string, message: string, meta?: LogMeta) {
  const payload = {
    level,
    scope,
    message,
    ...(meta ? {meta} : {}),
  };

  if (level === "error") {
    console.error(payload);
    return;
  }

  if (level === "warn") {
    console.warn(payload);
    return;
  }

  console.info(payload);
}

export const logger = {
  info(scope: string, message: string, meta?: LogMeta) {
    write("info", scope, message, meta);
  },
  warn(scope: string, message: string, meta?: LogMeta) {
    write("warn", scope, message, meta);
  },
  error(scope: string, message: string, meta?: LogMeta) {
    write("error", scope, message, meta);
  },
};
