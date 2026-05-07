"use client";

import {Search} from "lucide-react";
import Button from "../ui/Button";
import {DateRangePopover} from "../overlays/DateRangePopover";
import {NumberRangePopover} from "../overlays/NumberRangePopover";
import {Input} from "../form/base/Input";
import {Select} from "../form/base/Select";

type BaseField = {
  key: string;
  label: string;
  className?: string;
  placeholder?: string;
  helperText?: string;
  hidden?: boolean;
  disabled?: boolean;
  title?: string;
};

export type ToolbarActionField = {
  type: "action";
  key: string;
  label: string;
  hidden?: boolean;
  onClick: () => void;
  variant?: "primary" | "outline" | "ghost";
};

export type ToolbarField =
  | (BaseField & {
      type: "text";
    })
  | (BaseField & {
      type: "select";
      options: {label: string; value: string}[];
      emptyLabel?: string;
    })
  | (BaseField & {
      type: "date";
    })
  | (BaseField & {
      type: "number";
      min?: number;
      max?: number;
      step?: number;
      inputMode?: "numeric" | "decimal";
    })
  | (BaseField & {
      type: "dateRange";
      fromKey: string;
      toKey: string;
      placeholder?: string;
    })
  | (BaseField & {
      type: "numberRange";
      minKey: string;
      maxKey: string;
      placeholderMin?: string;
      placeholderMax?: string;
    })
  | ToolbarActionField;

type Props = {
  title?: string;
  subtitle?: string;
  fields: ToolbarField[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
  handleChangeHidden?: () => void;
  onSubmit?: () => void;
  onClear?: () => void;
  actions?: React.ReactNode;
};

export default function ListToolbar({
  fields,
  values,
  onChange,
  onSubmit,
  onClear,
  title,
}: Props) {
  function handleInternalSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit?.();
  }

  const textFields = fields.filter((f) => f.type === "text");
  const nonTextFields = fields.filter((f) => f.type !== "text");

  return (
    <form
      onSubmit={handleInternalSubmit}
      className="mb-0 flex flex-col flex-wrap  justify-between bg-white px-6 sm:flex-col md:flex-col lg:flex-row">
      <h3 className="font-semibold">{title}</h3>

      <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
        {textFields.map((f) => {
          const v = values[f.key] ?? "";

          return (
            <div
              key={f.key}
              className={`relative flex w-full max-w-md items-center  ${f.hidden ? "hidden" : ""}`}>
              <span className="absolute flex items-center justify-center pl-2 text-slate-400 ">
                <Search className="h-4 w-4" />
              </span>

              <Input
                type="text"
                value={v}
                disabled={f.disabled}
                onChange={(e) => onChange(f.key, e.target.value)}
                placeholder={f.placeholder}
                className=" bg-slate-100 pl-10 pr-4  shadow-sm"
              />

              {f.helperText ? (
                <p className="mt-1 text-[11px] text-neutral-500 ">
                  {f.helperText}
                </p>
              ) : null}
            </div>
          );
        })}

        <div className="flex flex-wrap items-center gap-2">
          {nonTextFields.map((f) => {
            const v = values[f.key] ?? "";
            const wrapperClass = `min-w-0 ${f.hidden ? "hidden" : ""}`;

            if (f.type === "select") {
              return (
                <div key={f.key} className={wrapperClass}>
                  <Select
                    value={v}
                    title={f.title}
                    disabled={f.disabled}
                    onChange={(e) => onChange(f.key, e.target.value)}
                    options={[
                      {label: f.emptyLabel ?? "Todos", value: ""},
                      ...f.options,
                    ]}
                    placeholder={f.emptyLabel ?? "Todos"}
                  />
                </div>
              );
            }

            if (f.type === "dateRange") {
              const from = values[f.fromKey] ?? "";
              const to = values[f.toKey] ?? "";

              return (
                <div key={f.key} className={wrapperClass}>
                  <DateRangePopover
                    value={{from: from || undefined, to: to || undefined}}
                    onChange={({from, to}) => {
                      onChange(f.fromKey, from ?? "");
                      onChange(f.toKey, to ?? "");
                    }}
                  />
                </div>
              );
            }

            if (f.type === "date") {
              return (
                <div key={f.key} className={wrapperClass}>
                  <Input
                    type="date"
                    value={v}
                    disabled={f.disabled}
                    onChange={(e) => onChange(f.key, e.target.value)}
                    className="rounded-lg bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600 shadow-sm "
                  />
                </div>
              );
            }

            if (f.type === "number") {
              return (
                <div key={f.key} className={wrapperClass}>
                  <input
                    type="number"
                    value={v}
                    disabled={f.disabled}
                    onChange={(e) => onChange(f.key, e.target.value)}
                    min={f.min}
                    max={f.max}
                    step={f.step ?? 1}
                    inputMode={f.inputMode ?? "numeric"}
                  />{" "}
                </div>
              );
            }

            if (f.type === "numberRange") {
              const min = values[f.minKey] ?? "";
              const max = values[f.maxKey] ?? "";

              return (
                <div key={f.key} className={wrapperClass}>
                  <NumberRangePopover
                    label={f.label}
                    value={{min: min || undefined, max: max || undefined}}
                    placeholderMin={f.placeholderMin}
                    placeholderMax={f.placeholderMax}
                    onChange={({min, max}) => {
                      onChange(f.minKey, min ?? "");
                      onChange(f.maxKey, max ?? "");
                    }}
                  />
                  {f.helperText ? (
                    <p className="mt-1 text-[11px] text-neutral-500 ">
                      {f.helperText}
                    </p>
                  ) : null}
                </div>
              );
            }

            if (f.type === "action") {
              if (f.hidden) return null;

              return (
                <Button
                  key={f.key}
                  type="button"
                  onClick={f.onClick}
                  variant={"outline"}>
                  {f.label}
                </Button>
              );
            }

            return null;
          })}
        </div>

        {onSubmit || onClear ? (
          <div className="flex flex-row gap-2 sm:flex-row sm:items-center sm:justify-end">
            {onClear ? (
              <Button type="button" variant="outline" onClick={onClear}>
                Limpiar
              </Button>
            ) : null}

            {onSubmit ? (
              <Button type="submit" variant="primary">
                Buscar
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
    </form>
  );
}
