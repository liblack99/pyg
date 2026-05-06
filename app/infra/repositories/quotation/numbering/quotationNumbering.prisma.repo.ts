import type {QuotationNumberingPort} from "@/app/core/quotations/port/quotation.numbering.port";
import {prisma} from "@/app/lib/prisma";

function formatQuotationNumber(n: number) {
  return `COTIZ-${String(n).padStart(3, "0")}`;
}

export const quotationNumberingRepo: QuotationNumberingPort = {
  async nextNumberQuotation(): Promise<string> {
    return prisma.$transaction(async (tx) => {
      const rows = await tx.$queryRaw<Array<{lastnumber: number}>>`
        SELECT "lastNumber" as lastnumber
        FROM "QuotationSequence"
        WHERE "id" = 1
        FOR UPDATE
      `;

      const current = rows[0]?.lastnumber;
      if (typeof current !== "number") {
        throw new Error("QuotationSequence row (id=1) not found. Run seed.");
      }

      const next = current + 1;

      await tx.quotationSequence.update({
        where: {id: 1},
        data: {lastNumber: next},
      });

      return formatQuotationNumber(next);
    });
  },
  async previewNextNumberQuotation(): Promise<string> {
    const row = await prisma.quotationSequence.findUnique({
      where: {id: 1},
      select: {lastNumber: true},
    });

    if (!row) throw new Error("QuotationSequence not found");

    return formatQuotationNumber(row.lastNumber + 1);
  },
};
