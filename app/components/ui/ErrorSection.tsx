"use client";

interface Props {
  title?: string;
  message: string;
}

export default function ErrorSection({title = "Error", message}: Props) {
  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6">
        <div className="text-sm font-semibold text-rose-700">{title}</div>

        <div className="mt-1 text-sm text-rose-700/90">{message}</div>
      </div>
    </section>
  );
}
