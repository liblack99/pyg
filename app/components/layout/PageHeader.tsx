import {ReactNode} from "react";
import Button from "../ui/Button";
import Link from "next/link";
import {Plus} from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  href?: string;
  textButton?: string;
  isIcon?: boolean;
  variantButton?: "primary" | "secondary" | "outline";
}

export default function PageHeader({
  title,
  subtitle,
  children,
  href,
  textButton,
  isIcon = false,
  variantButton = "primary",
}: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-2">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        {children}
        {href && (
          <Button variant={variantButton}>
            <Link href={href} className="flex">
              {isIcon ? <Plus className="h-5 w-5 mr-1" /> : null}
              {textButton}
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
