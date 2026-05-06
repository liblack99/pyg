import {ReactNode} from "react";
import {LucideIcon} from "lucide-react";

type ColorVariant = "blue" | "emerald" | "amber" | "rose" | "indigo" | "slate";

interface DashboardStatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  variant?: ColorVariant;
  hint?: ReactNode; // Puede ser texto o un componente (como tus iconos pequeños + texto)
  progress?: {
    current: number;
    total: number;
  };
  className?: string;
}

const colorMap: Record<
  ColorVariant,
  {border: string; bg: string; text: string; bar: string} // Cambié iconBg por bar
> = {
  blue: {
    border: "border-l-blue-500",
    bg: "bg-blue-50",
    text: "text-blue-600",
    bar: "bg-blue-500",
  },
  emerald: {
    border: "border-l-emerald-500",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    bar: "bg-emerald-500",
  },
  amber: {
    border: "border-l-amber-500",
    bg: "bg-amber-50",
    text: "text-amber-600",
    bar: "bg-amber-500",
  },
  rose: {
    border: "border-l-rose-500",
    bg: "bg-rose-50",
    text: "text-rose-600",
    bar: "bg-rose-500",
  },
  indigo: {
    border: "border-l-indigo-500",
    bg: "bg-indigo-50",
    text: "text-indigo-600",
    bar: "bg-indigo-500",
  },
  slate: {
    border: "border-l-slate-400",
    bg: "bg-slate-50",
    text: "text-slate-600",
    bar: "bg-slate-500",
  },
};

export function DashboardStatCard({
  title,
  value,
  icon: Icon,
  variant = "blue",
  hint,
  progress,
  className = "",
}: DashboardStatCardProps) {
  const styles = colorMap[variant];

  return (
    <div
      className={`rounded-2xl  border-slate-200 bg-white p-4 shadow-sm border-l-4 transition-all w-full overflow-hidden hover:shadow-md ${styles.border} ${className}`}>
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`rounded-xl p-2.5 border border-white/50 ${styles.bg} ${styles.text}`}>
          <Icon size={18} strokeWidth={2.5} />
        </div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
          {title}
        </p>
      </div>

      <div className="space-y-1">
        <p className="text-xl font-bold tracking-tight text-slate-900 overflow-hidden">
          {value}
        </p>

        {hint && (
          <div className="flex items-center gap-1 text-[10px] font-bold uppercase truncate">
            {hint}
          </div>
        )}

        {progress && (
          <div className="mt-3 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${styles.bar}`} // <--- Usamos styles.bar directamente
              style={{
                width: `${Math.min(100, (progress.current / progress.total) * 100)}%`,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
