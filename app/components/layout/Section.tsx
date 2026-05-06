import React from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export function Section({children, className = ""}: Props) {
  return <div className={`p-4 space-y-4 ${className}`}>{children}</div>;
}
