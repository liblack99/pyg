// app/dashboard/quotations/components/QuotationToolbar.tsx
"use client";

import {useState} from "react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import ListToolbar, {
  type ToolbarField,
} from "@/app/components/toolbar/ListToolbar";
import type {QuotationListQuery} from "@/app/core/quotations/dto";
import {toQuotationSearchParams} from "@/app/utils/toQuotationSearchParams";

import {detailOptions} from "../constant/referenceDetailsOptions";

export type QuotationAdvisorOption = {
  id: string;
  name: string;
};

const STATUS_OPTIONS = [
  {label: "Borrador", value: "DRAFT"},
  {label: "Enviada", value: "SENT"},
  {label: "Aprobada", value: "APPROVED"},
  {label: "Rechazada", value: "REJECTED"},
  {label: "Vencida", value: "EXPIRED"},
  {label: "Cancelada", value: "CANCELLED"},
];

const REFERENCE_OPTIONS = detailOptions.map((r) => {
  return {
    label: r,
    value: r,
  };
});

type Props = {
  advisors: QuotationAdvisorOption[];
};

export default function QuotationToolbar({advisors}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const advisorOptions = advisors.map((advisor) => ({
    label: advisor.name,
    value: advisor.id,
  }));

  const fieldsList: ToolbarField[] = [
    {
      type: "text",
      key: "search",
      label: "Buscar",
      placeholder: "Número (COTIZ-001), cliente o documento",
      hidden: false,
    },

    {
      type: "dateRange",
      key: "dateRange",
      label: "Rango de fechas",
      fromKey: "dateFrom",
      toKey: "dateTo",
      hidden: false, // o true si quieres que sea “filtro”
    },
    {
      type: "numberRange",
      key: "totalRange",
      label: "Total",
      minKey: "totalMin",
      maxKey: "totalMax",
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
      key: "reference",
      label: "referencia",
      options: REFERENCE_OPTIONS,
      hidden: false,
      emptyLabel: "Referencia",
      title: "Filtrar por referencia",
    },
    {
      type: "select",
      key: "createdById",
      label: "Asesor",
      options: advisorOptions,
      hidden: false,
      emptyLabel: "Asesor",
      title: "Filtrar por asesor comercial",
    },
  ];

  const [fields, setFields] = useState(fieldsList);

  const [values, setValues] = useState<Record<string, string>>(() => ({
    search: sp.get("search") ?? "",
    status: sp.get("status") ?? "",
    createdById: sp.get("createdById") ?? "",
    dateField: sp.get("dateField") ?? "",
    dateFrom: sp.get("dateFrom") ?? "",
    dateTo: sp.get("dateTo") ?? "",
    totalMin: sp.get("totalMin") ?? "",
    totalMax: sp.get("totalMax") ?? "",
    reference: sp.get("reference") ?? "",
  }));

  function onChange(key: string, value: string) {
    setValues((prev) => ({...prev, [key]: value}));
  }

  const handleToggleHiddenTextFields = () => {
    setFields((prev) =>
      prev.map((field) =>
        field.type !== "text"
          ? {...field, hidden: !Boolean(field.hidden)}
          : field,
      ),
    );
  };

  function onSubmit() {
    const q: Partial<QuotationListQuery> = {
      search: values.search?.trim() || undefined,

      status: values.status as QuotationListQuery["status"] | undefined,
      createdById: values.createdById || undefined,
      dateField: values.dateField as
        | QuotationListQuery["dateField"]
        | undefined,
      dateFrom: values.dateFrom ? new Date(values.dateFrom) : undefined,
      dateTo: values.dateTo ? new Date(values.dateTo) : undefined,
      totalMin: values.totalMin ? Number(values.totalMin) : undefined,
      totalMax: values.totalMax ? Number(values.totalMax) : undefined,
      reference: values.reference || undefined,
      cursor: undefined,
    };

    const qs = toQuotationSearchParams(q);
    router.push(`${pathname}?${qs.toString()}`);
  }

  function onClear() {
    setValues({
      search: "",
      status: "",
      createdById: "",
      dateField: "",
      dateFrom: "",
      dateTo: "",
      totalMin: "",
      totalMax: "",
      reference: "",
    });

    router.push("/dashboard/quotations");
  }

  return (
    <ListToolbar
      title=" Listado de cotizaciones"
      fields={fields}
      values={values}
      onChange={onChange}
      onSubmit={onSubmit}
      onClear={onClear}
      handleChangeHidden={handleToggleHiddenTextFields}
    />
  );
}
