// app/dashboard/products/ProductsToolbar.tsx
"use client";

import Link from "next/link";
import {useRouter} from "next/navigation";
import {useState} from "react";
import ListToolbar, {
  type ToolbarField,
} from "@/app/components/toolbar/ListToolbar";

type Props = {
  values: {search: string};
  canManage: boolean;
};

export default function ProductsToolbar({values, canManage}: Props) {
  const router = useRouter();

  const [search, setSearch] = useState(values.search ?? "");

  const fields: ToolbarField[] = [
    {
      type: "text",
      key: "search",
      label: "Buscar",
      placeholder: "Nombre o código...",
    },
  ];

  function onChange(key: string, value: string) {
    if (key === "search") setSearch(value);
  }

  function submit() {
    const s = search.trim();
    const qs = new URLSearchParams();
    if (s) qs.set("search", s);

    const query = qs.toString();
    router.push(query ? `/dashboard/products?${query}` : `/dashboard/products`);
  }

  function clear() {
    setSearch("");
    router.push("/dashboard/products");
  }

  return (
    <ListToolbar
      title="Listado de productos"
      fields={fields}
      values={{search}}
      onChange={onChange}
      onSubmit={submit}
      onClear={clear}
      actions={
        canManage ? (
          <Link
            href="/dashboard/products/new"
            className="rounded border bg-white px-3 py-2 text-sm hover:bg-neutral-50">
            Nuevo producto
          </Link>
        ) : null
      }
    />
  );
}
