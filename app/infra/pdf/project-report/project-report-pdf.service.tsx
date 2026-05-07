import "server-only";

import {renderToBuffer} from "@react-pdf/renderer";
import {publicImageToDataUri} from "@/app/lib/server/publicImageDataUri";
import type {ProjectReportDto} from "@/app/core/projects/report/dto/project-report.dto";
import {ProjectReportPdf} from "./ProjectReportPdf";

export type ProjectReportPdfResult = {
  buffer: Uint8Array;
  filename: string;
};

function sanitizeFilenamePart(value: string): string {
  return value
    .trim()
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function renderProjectReportPdf(
  report: ProjectReportDto,
): Promise<ProjectReportPdfResult> {
  const brandLogoSrc = await publicImageToDataUri("parque_y_grama.png");
  const buffer = await renderToBuffer(
    <ProjectReportPdf report={report} brandLogoSrc={brandLogoSrc} />,
  );
  const projectCode = sanitizeFilenamePart(report.header.projectCode) || "proyecto";

  return {
    buffer: new Uint8Array(buffer),
    filename: `reporte-proyecto-${projectCode}.pdf`,
  };
}
