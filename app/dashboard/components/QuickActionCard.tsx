"use client";

import Link from "next/link";
import type {LucideIcon} from "lucide-react";

type QuickActionCardProps = {
  label: string;
  description?: string;
  href: string;
  icon: LucideIcon;
  iconWrapperClass: string;
  iconClass: string;
};

export default function QuickActionCard({
  label,
  description,
  href,
  icon: Icon,
  iconWrapperClass,
  iconClass,
}: QuickActionCardProps) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
      <div className="flex flex-col items-start gap-4">
        <div className={`rounded-xl border p-3 transition ${iconWrapperClass}`}>
          <Icon className={`h-5 w-5 ${iconClass}`} />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-slate-900">{label}</h3>

          {description && (
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
