"use client";

import React from "react";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({error = false, disabled = false, className = "", ...props}, ref) => {
    const classes = `
      w-full
      rounded-lg
      border
      px-3
      py-2
      text-sm
      text-[#0F172A]
      placeholder:text-slate-400
      transition
      focus:outline-none
      resize-y
      ${
        error
          ? "border-red-500 focus:ring-2 focus:ring-red-500/30"
          : "border-slate-300 focus:border-[#0A3D91] focus:ring-2 focus:ring-[#0A3D91]/30"
      }
      ${disabled ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-white"}
      ${className}
    `;

    return (
      <textarea ref={ref} disabled={disabled} className={classes} {...props} />
    );
  },
);

Textarea.displayName = "Textarea";
