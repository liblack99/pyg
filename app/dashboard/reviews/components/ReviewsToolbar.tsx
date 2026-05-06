// app/dashboard/clients/components/ClientsToolbar.tsx
"use client";

import Link from "next/link";
import {useRouter} from "next/navigation";
import ListToolbar, {
  type ToolbarField,
} from "@/app/components/toolbar/ListToolbar";
import {useState} from "react";

export default function ReviewsToolbar({
  values,
  canManage,
}: {
  values: {title: string};
  canManage: boolean;
}) {
  const router = useRouter();

  // estado local para escribir sin recargar en cada tecla
  const [title, setTitle] = useState(values.title);

  const fields: ToolbarField[] = [
    {
      type: "text",
      key: "title",
      label: "Title",
      placeholder: "Buscar por titulo",
    },
  ];

  function setField(key: string, value: string) {
    if (key === "title") setTitle(value);
  }

  function submit() {
    const qs = new URLSearchParams();
    if (title.trim()) qs.set("title", title.trim());

    const query = qs.toString();
    router.push(query ? `/dashboard/reviews?${query}` : `/dashboard/reviews`);
  }

  function clear() {
    setTitle("");

    router.push("/dashboard/reviews");
  }

  return (
    <ListToolbar
      title="Reseñas"
      fields={fields}
      values={{title}}
      onChange={setField}
      onSubmit={submit}
      onClear={clear}
      actions={
        canManage ? (
          <Link
            href="/dashboard/reviews/new"
            className="rounded border bg-white px-3 py-2 text-sm hover:bg-neutral-50">
            Nuevo reseña
          </Link>
        ) : null
      }
    />
  );
}
