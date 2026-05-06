import {Prisma} from "@/app/generated/prisma/client";

export const toNum = (
  value: Prisma.Decimal | number | string | null | undefined,
): number => {
  if (value === null || value === undefined) return 0;

  if (typeof value === "object" && "toNumber" in value) {
    return (value as Prisma.Decimal).toNumber();
  }

  const parsed = Number(value);
  return isNaN(parsed) ? 0 : parsed;
};
