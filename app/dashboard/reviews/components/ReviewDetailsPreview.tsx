"use client";

import DOMPurify from "dompurify";

export function ReviewDetailsPreview({html}: {html: string | null}) {
  return (
    <div
      className="prose prose-sm max-w-none dark:prose-invert"
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(html ?? ""),
      }}
    />
  );
}
