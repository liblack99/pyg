"use client";

import {useState} from "react";
import {Download} from "lucide-react";
import Button from "@/app/components/ui/Button";

type Props = {
  projectId: string;
  projectCode: string;
};

function parseFilename(contentDisposition: string | null, fallback: string): string {
  if (!contentDisposition) return fallback;
  const match = contentDisposition.match(/filename="([^"]+)"/);
  return match?.[1] ?? fallback;
}

export default function ProjectExportReportButton({
  projectId,
  projectCode,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleExport() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/projects/${projectId}/report`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("No se pudo exportar el reporte.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = parseFilename(
        response.headers.get("Content-Disposition"),
        `reporte-proyecto-${projectCode}.pdf`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "No se pudo exportar el reporte.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <Button variant="outline" onClick={handleExport} disabled={isLoading}>
        <Download className="h-4 w-4" aria-hidden="true" />
        {isLoading ? "Exportando..." : "Exportar reporte"}
      </Button>
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </div>
  );
}
