"use client";

import * as React from "react";

export interface DateInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "onChange"
> {
  value?: Date | string | null;
  error?: boolean;

  onChange?: (value: Date | null) => void;
}

function formatDate(value?: Date | string | null) {
  if (!value) return "";

  if (typeof value === "string") {
    return value.slice(0, 10);
  }

  return value.toISOString().split("T")[0];
}

function parseDate(value: string) {
  if (!value) return null;

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}

export const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
  (
    {
      error = false,
      disabled = false,
      className = "",
      value,
      onChange,
      ...props
    },
    ref,
  ) => {
    const baseFieldClasses = `
      w-full
      rounded-lg
      border
      px-3
      py-1.5
      text-sm
      text-[#0F172A]
      bg-white
      placeholder:text-slate-400
      transition
      focus:outline-none
      ${
        error
          ? "border-red-500 focus:ring-2 focus:ring-red-500/30"
          : "border-slate-300 focus:border-[#0A3D91] focus:ring-2 focus:ring-[#0A3D91]/30"
      }
      ${disabled ? "bg-slate-100 text-slate-400 cursor-not-allowed" : ""}
      ${className}
    `;

    return (
      <input
        ref={ref}
        type="date"
        disabled={disabled}
        value={formatDate(value)}
        className={baseFieldClasses}
        onChange={(e) => {
          onChange?.(parseDate(e.target.value));
        }}
        {...props}
      />
    );
  },
);

DateInput.displayName = "DateInput";
