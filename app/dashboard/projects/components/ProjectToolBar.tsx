"use client";
import {useState} from "react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import ListToolbar, {
  type ToolbarField,
} from "@/app/components/toolbar/ListToolbar";
import type {ProjectListQuery} from "@/app/core/projects/dto";

const STATUS_OPTIONS = [
  {label: "Activo", value: "ACTIVE"},
  {label: "Pausado", value: "PAUSED"},
  {label: "Cerrado", value: "CLOSED"},
  {label: "Cancelado", value: "CANCELLED"},
];

const KIND_OPTIONS = [
  {label: "Suministro", value: "SUPPLY_ONLY"},
  {label: "instalacion", value: "EXECUTION"},
  {label: "Suministro e instalacion", value: "MIXED"},
];

export default function ProjectToolbar() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const fieldsList: ToolbarField[] = [
    {
      type: "text",
      key: "search",
      label: "Buscar",
      placeholder: "Número (COTIZ-001), o Numero de projecto",
      hidden: false,
    },
    {
      type: "select",
      key: "status",
      label: "Estado",
      options: STATUS_OPTIONS,
      hidden: false,
      emptyLabel: "Estado",
      title: "Filtrar por estado",
    },
    {
      type: "select",
      key: "kind",
      label: "referencia",
      options: KIND_OPTIONS,
      hidden: false,
      emptyLabel: "Referencia",
      title: "Filtrar por referencia",
    },
  ];

  const [values, setValues] = useState<Record<string, string>>(() => ({
    search: sp.get("search") ?? "",
    status: sp.get("status") ?? "",
    kind: sp.get("kind") ?? "",
    attention: sp.get("attention") ?? "",
  }));

  function onChange(key: string, value: string) {
    setValues((prev) => ({...prev, [key]: value}));
  }

  function onSubmit() {
    const q: Partial<ProjectListQuery> = {
      search: values.search?.trim() || undefined,

      status: values.status as ProjectListQuery["status"] | undefined,
      kind: values.kind as ProjectListQuery["kind"] | undefined,
      attention: values.attention as ProjectListQuery["attention"] | undefined,
      cursor: undefined,
    };

    const qs = new URLSearchParams();

    Object.entries(q).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        qs.set(key, String(value));
      }
    });

    router.push(`${pathname}?${qs.toString()}`);
  }

  function onClear() {
    setValues({
      search: "",
      status: "",
      kind: "",
      attention: "",
    });

    router.push("/dashboard/projects");
  }

  return (
    <ListToolbar
      title="Lista de proyectos"
      fields={fieldsList}
      values={values}
      onChange={onChange}
      onSubmit={onSubmit}
      onClear={onClear}
    />
  );
}
