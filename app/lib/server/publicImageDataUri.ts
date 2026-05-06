import "server-only";

import {readFile} from "node:fs/promises";
import path from "node:path";

function mimeTypeFor(fileName: string): string {
  const lower = fileName.toLowerCase();
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".webp")) return "image/webp";
  return "application/octet-stream";
}

export async function publicImageToDataUri(
  fileName: string,
): Promise<string | null> {
  try {
    const filePath = path.join(process.cwd(), "public", fileName);
    const bytes = await readFile(filePath);
    const mime = mimeTypeFor(fileName);
    return `data:${mime};base64,${bytes.toString("base64")}`;
  } catch {
    return null;
  }
}

