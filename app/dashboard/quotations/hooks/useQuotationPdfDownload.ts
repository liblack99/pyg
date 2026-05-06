"use client";

import {useState} from "react";
import {apiGetFile} from "@/app/lib/api.client";
import {downloadBlob} from "@/app/lib/downloadBlob";

interface UseQuotationPdfDownloadResult {
  download: (id: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function useQuotationPdfDownload(): UseQuotationPdfDownloadResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const download = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const {blob, filename} = await apiGetFile(`/api/quotations/${id}/pdf`);
      downloadBlob({
        blob,
        filename:
          filename ?? `cotizacion-${new Date().toISOString().slice(0, 10)}.pdf`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsLoading(false);
    }
  };

  return {download, isLoading, error};
}
