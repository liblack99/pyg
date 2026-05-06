"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";

type Props = {
  href: string;
  title: string;
  icon?: React.ReactNode;
};

export default function NavLink({href, title, icon}: Props) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <li className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors group">
      <Link
        href={href}
        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors
                ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}>
        {icon && (
          <span className="material-symbols-outlined text-xl font-variation-fill">
            {icon}
          </span>
        )}
        <span className="text-sm font-semibold">{title}</span>
      </Link>
    </li>
  );
}
