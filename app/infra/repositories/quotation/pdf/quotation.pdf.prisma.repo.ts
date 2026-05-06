import "server-only";
import React from "react";

import type {Quotation} from "@/app/core/quotations/dto";
import type {QuotationPdfRepo} from "@/app/core/quotations/pdf/port/quotationPdf.port";
import {QuotationInvoicePdf} from "@/app/core/quotations/pdf/react-pdf/QuotationInvoicePdf";
import {publicImageToDataUri} from "@/app/lib/server/publicImageDataUri";

export const quotationPdfExporter: QuotationPdfRepo = {
  async quotationToPdfBuffer(quotation: Quotation): Promise<Uint8Array> {
    const {Document, renderToBuffer} = await import("@react-pdf/renderer");
    const [brandLogoSrc] = await Promise.all([
      publicImageToDataUri("parque_y_grama.png"),
    ]);
    const doc = React.createElement(
      Document,
      null,
      React.createElement(QuotationInvoicePdf, {
        q: quotation,
        brandLogoSrc,
      }),
    );
    const buffer = await renderToBuffer(doc);
    return new Uint8Array(buffer);
  },
};
