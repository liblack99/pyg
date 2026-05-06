"use client";

import React from "react";

export interface CurrencyInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "onChange"
> {
  value?: number | null;
  onChange?: (value: number) => void;
  error?: boolean;
  locale?: string;
  allowNegative?: boolean;
}

// Límite de miles de millones (999.999.999.999)
const MAX_VALUE = 999_999_999_999;

function formatCurrencyValue(value: number, locale = "es-CO") {
  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

  return `$ ${formatted}`;
}

export const CurrencyInput = React.forwardRef<
  HTMLInputElement,
  CurrencyInputProps
>(
  (
    {
      value = 0,
      onChange,
      onBlur,
      disabled = false,
      placeholder,
      error = false,
      locale = "es-CO",
      allowNegative = false,
      className = "",
      name,
      ...props
    },
    ref,
  ) => {
    const safeNumber =
      typeof value === "number" && Number.isFinite(value) ? value : 0;

    const display = formatCurrencyValue(safeNumber, locale);

    const classes = ` 
      w-full
      rounded-lg
      border
      px-3
      py-1.5
      text-sm
      text-[#0F172A]
      placeholder:text-slate-400
      transition
      focus:outline-none
      ${
        error
          ? "border-red-500 focus:ring-2 focus:ring-red-500/30"
          : "border-slate-300 focus:border-[#0A3D91] focus:ring-2 focus:ring-[#0A3D91]/30"
      }
      ${disabled ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-white"}
      ${className}
    `;

    return (
      <input
        {...props}
        ref={ref}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        name={name}
        value={display}
        disabled={disabled}
        placeholder={placeholder}
        onBlur={onBlur}
        onChange={(e) => {
          const input = e.target.value;
          const sign = allowNegative && input.trim().startsWith("-") ? -1 : 1;

          // Extraer solo dígitos
          const digitsOnly = input.replace(/[^\d]/g, "");

          if (!digitsOnly) {
            onChange?.(0);
            return;
          }

          const nextValue = Number(digitsOnly) * sign;

          // VALIDACIÓN: Solo ejecutar onChange si el valor absoluto es menor al límite
          if (Math.abs(nextValue) <= MAX_VALUE) {
            onChange?.(nextValue);
          }
        }}
        className={classes}
      />
    );
  },
);

CurrencyInput.displayName = "CurrencyInput";
