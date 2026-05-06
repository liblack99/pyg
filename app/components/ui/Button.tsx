import React from "react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "danger"
  | "success"
  | "icono";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  variant?: ButtonVariant;
  className?: string;
  disabled?: boolean;
}

function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  className = "",
  ...props
}: ButtonProps) {
  const styles: Record<ButtonVariant, string> = {
    primary: `
     flex items-center  gap-2 px-4 py-1.5 bg-[#137fec] text-white  text-sm font-bold shadow-sm transition-all
    `,
    secondary: `
      flex items-center gap-2 px-3 py-1.5 bg-slate-100  text-sm font-bold hover:bg-slate-200 transition-colors
    `,
    outline: `
      inline-flex items-center justify-center gap-2 border px-3 py-1.5 text-sm font-bold border-neutral-200 bg-white text-neutral-900 shadow-sm hover:bg-neutral-50 active:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/20 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    `,
    danger: `
      bg-red-600 text-white
      hover:bg-red-700
      focus:ring-2 focus:ring-red-500/40
    `,
    success: `
      bg-[#16A34A] text-white
      hover:bg-green-600
      focus:ring-2 focus:ring-green-500/40
    `,
    icono: `flex items-center justify-center p-2 bg-transparent text-slate-600  
      hover:bg-slate-100 dark:hover:bg-slate-800 transition-all rounded-full`,
  };

  return (
    <button
      {...props}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        cursor-pointer
        rounded-lg
        ${styles[variant]}
        ${className}
      `}>
      {children}
    </button>
  );
}

export default Button;
