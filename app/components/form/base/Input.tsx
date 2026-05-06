"use client";

import * as React from "react";

type TextLikeType =
  | "text"
  | "email"
  | "password"
  | "search"
  | "tel"
  | "url"
  | "date";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: TextLikeType;
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {type = "text", error = false, disabled = false, className = "", ...props},
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
        type={type}
        disabled={disabled}
        className={baseFieldClasses}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
