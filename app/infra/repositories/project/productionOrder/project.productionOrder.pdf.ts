import "server-only";

import type {ProductionOrder} from "@/app/core/projects/orderPdf/dto";
import React from "react";
import {ProductionOrderRepoPort} from "@/app/core/projects/orderPdf/port/project.productionOrder.repo.port";
import {ProductionOrderPdf} from "@/app/core/projects/orderPdf/rect-pdf/ProductionOrderPdf";
import {publicImageToDataUri} from "@/app/lib/server/publicImageDataUri";

export const projectProductionOrderPdf: ProductionOrderRepoPort = {
  async productionOrderPdfToPdfBuffer(
    item: ProductionOrder,
  ): Promise<Uint8Array> {
    const {Document, renderToBuffer} = await import("@react-pdf/renderer");
    const [brandLogoSrc] = await Promise.all([
      publicImageToDataUri("parque_y_grama.png"),
    ]);
    const doc = React.createElement(
      Document,
      null,
      React.createElement(ProductionOrderPdf, {
        op: item,
        brandLogoSrc,
      }),
    );
    const buffer = await renderToBuffer(doc);
    return new Uint8Array(buffer);
  },
};
