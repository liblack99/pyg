"use client";

import React from "react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  error?: boolean;
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      options,
      error = false,
      disabled = false,
      placeholder = "Seleccione una opción",
      className = "",
      ...props
    },
    ref,
  ) => {
    const classes = `rounded-md border bg-white px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/30
      ${
        error
          ? "border-red-500 focus:ring-2 focus:ring-red-500/30"
          : "border-slate-300 focus:border-[#0A3D91] focus:ring-2 focus:ring-[#0A3D91]/30"
      }
      ${disabled ? "bg-slate-100 text-slate-400 cursor-not-allowed" : ""}
      ${className}
    `;

    return (
      <select ref={ref} disabled={disabled} className={classes} {...props}>
        <option value="" disabled>
          {placeholder}
        </option>

        {options.map((opt) => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  },
);

Select.displayName = "Select";
