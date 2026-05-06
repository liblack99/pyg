// app/dashboard/clients/components/ClientsToolbar.tsx
"use client";
import Link from "next/link";
import {useRouter} from "next/navigation";
import ListToolbar, {
  type ToolbarField,
} from "@/app/components/toolbar/ListToolbar";
import {useState} from "react";

export type ToolbarValues = {
  name: string;
  document: string;
};

type Props = {
  values: ToolbarValues;
  canManage: boolean;
};

export default function ClientsToolbar({values, canManage}: Props) {
  const router = useRouter();

  const [name, setName] = useState(values.name);

  const fields: ToolbarField[] = [
    {
      type: "text",
      key: "name",
      label: "Nombre",
      placeholder: "Buscar por nombre o numero de documento",
    },
  ];

  function setField(key: string, value: string) {
    if (key === "name") setName(value);
  }

  function submit() {
    const qs = new URLSearchParams();
    if (name.trim()) qs.set("name", name.trim());

    const query = qs.toString();
    router.push(query ? `/dashboard/clients?${query}` : `/dashboard/clients`);
  }

  function clear() {
    setName("");

    router.push("/dashboard/clients");
  }

  return (
    <ListToolbar
      title="Listado de clientes"
      fields={fields}
      values={{name}}
      onChange={setField}
      onSubmit={submit}
      onClear={clear}
      actions={
        canManage ? (
          <Link
            href="/dashboard/clients/new"
            className="rounded border bg-white px-3 py-2 text-sm hover:bg-neutral-50">
            Nuevo cliente
          </Link>
        ) : null
      }
    />
  );
}
