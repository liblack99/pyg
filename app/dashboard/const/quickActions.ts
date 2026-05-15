import {FileText, FolderOpen, Box, UserPlus} from "lucide-react";

import type {LucideIcon} from "lucide-react";

export type QuickActionItem = {
  key: string;
  label: string;
  description?: string;
  href: string;
  icon: LucideIcon;
  permission?: string;
  iconWrapperClass: string;
  iconClass: string;
};

export const DASHBOARD_QUICK_ACTIONS: QuickActionItem[] = [
  {
    key: "new-quotation",
    label: "Nueva cotización",
    description: "Crear una nueva cotización para un cliente.",
    href: "/dashboard/quotations/new",
    icon: FileText,
    permission: "quotation:create",
    iconWrapperClass: "bg-sky-50 border-sky-200",
    iconClass: "text-sky-600",
  },
  {
    key: "new-client",
    label: "Nuevo cliente",
    description: "Registrar un nuevo cliente en el sistema.",
    href: "/dashboard/clients/new",
    icon: UserPlus,
    permission: "clients:create",
    iconWrapperClass: "bg-[#00be6a1a] border-[#00be6a1a]",
    iconClass: "text-[#00be6a]",
  },
  {
    key: "new-product",
    label: "Nuevo producto",
    description: "Registrar una nuevo producto en el sistema.",
    href: "/dashboard/products/new",
    icon: Box,
    permission: "products:create",
    iconWrapperClass: "bg-[#ffc2001a] border-[#ffc2001a]",
    iconClass: "text-[#ffc200]",
  },
  {
    key: "new-project",
    label: "ver proyectos",
    description: "Ver los proyectos",
    href: "/dashboard/projects",
    icon: FolderOpen,
    permission: "project:create",
    iconWrapperClass: "bg-[#6e69f31a] border-[#6e69f31a]",
    iconClass: "text-[#6e69f3]",
  },
];
