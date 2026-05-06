"use client";

import React, {useMemo} from "react";
import {usePathname, useRouter} from "next/navigation";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import Button from "@/app/components/ui/Button";
import {UniversalSearch} from "./UniversalSearch";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "danger"
  | "success"
  | "icono";

interface RouteAction {
  label: string;
  onClick: () => void;
  variant: ButtonVariant;
}

interface RouteConfig {
  path: string;
  title: string;
  href: string;
  action?: RouteAction;
  exact?: boolean;
}

const PROJECT_TAB_LABELS: Record<string, string> = {
  budget: "Presupuesto",
  purchases: "Compras",
  fabrication: "Fabricacion",
  installation: "Instalacion",
  finance: "Finanzas",
  documents: "Documentos",
  notes: "Anotaciones",
  warranty: "Garantias",
};

function getDynamicRouteConfig(
  pathname: string,
  router: AppRouterInstance,
): RouteConfig | null {
  const quotationDuplicateMatch = pathname.match(
    /^\/dashboard\/quotations\/([^/]+)\/duplicate$/,
  );
  if (quotationDuplicateMatch) {
    const quotationId = quotationDuplicateMatch[1];
    return {
      path: pathname,
      exact: true,
      title: "Duplicar Cotizacion",
      href: `Dashboard / Cotizaciones / ${quotationId} / Duplicar`,
      action: {
        label: "Volver",
        onClick: () => router.push(`/dashboard/quotations/${quotationId}`),
        variant: "outline",
      },
    };
  }

  const quotationDetailMatch = pathname.match(/^\/dashboard\/quotations\/([^/]+)$/);
  if (quotationDetailMatch) {
    const quotationId = quotationDetailMatch[1];
    return {
      path: pathname,
      exact: true,
      title: "Detalle de Cotizacion",
      href: `Dashboard / Cotizaciones / ${quotationId}`,
      action: {
        label: "Volver",
        onClick: () => router.push("/dashboard/quotations"),
        variant: "outline",
      },
    };
  }

  const clientDetailMatch = pathname.match(/^\/dashboard\/clients\/([^/]+)$/);
  if (clientDetailMatch) {
    const clientId = clientDetailMatch[1];
    return {
      path: pathname,
      exact: true,
      title: "Detalle de Cliente",
      href: `Dashboard / Clientes / ${clientId}`,
      action: {
        label: "Volver",
        onClick: () => router.push("/dashboard/clients"),
        variant: "outline",
      },
    };
  }

  const productDetailMatch = pathname.match(/^\/dashboard\/products\/([^/]+)$/);
  if (productDetailMatch) {
    const productId = productDetailMatch[1];
    return {
      path: pathname,
      exact: true,
      title: "Detalle de Producto",
      href: `Dashboard / Productos / ${productId}`,
      action: {
        label: "Volver",
        onClick: () => router.push("/dashboard/products"),
        variant: "outline",
      },
    };
  }

  const userDetailMatch = pathname.match(/^\/dashboard\/users\/([^/]+)$/);
  if (userDetailMatch) {
    const userId = userDetailMatch[1];
    return {
      path: pathname,
      exact: true,
      title: "Detalle de Usuario",
      href: `Dashboard / Usuarios / ${userId}`,
      action: {
        label: "Volver",
        onClick: () => router.push("/dashboard/users"),
        variant: "outline",
      },
    };
  }

  const reviewDetailMatch = pathname.match(/^\/dashboard\/reviews\/([^/]+)$/);
  if (reviewDetailMatch) {
    const reviewId = reviewDetailMatch[1];
    return {
      path: pathname,
      exact: true,
      title: "Detalle de Resena",
      href: `Dashboard / Resenas / ${reviewId}`,
      action: {
        label: "Volver",
        onClick: () => router.push("/dashboard/reviews"),
        variant: "outline",
      },
    };
  }

  const projectTabMatch = pathname.match(/^\/dashboard\/projects\/([^/]+)\/([^/]+)$/);
  if (projectTabMatch) {
    const projectId = projectTabMatch[1];
    const tab = projectTabMatch[2];
    const tabLabel = PROJECT_TAB_LABELS[tab];

    if (tabLabel) {
      return {
        path: pathname,
        exact: true,
        title: `${tabLabel} del Proyecto`,
        href: `Dashboard / Proyectos / ${projectId} / ${tabLabel}`,
        action: {
          label: "Ver proyecto",
          onClick: () => router.push(`/dashboard/projects/${projectId}`),
          variant: "outline",
        },
      };
    }
  }

  const projectDetailMatch = pathname.match(/^\/dashboard\/projects\/([^/]+)$/);
  if (projectDetailMatch) {
    const projectId = projectDetailMatch[1];
    return {
      path: pathname,
      exact: true,
      title: "Detalle del Proyecto",
      href: `Dashboard / Proyectos / ${projectId}`,
      action: {
        label: "Volver",
        onClick: () => router.push("/dashboard/projects"),
        variant: "outline",
      },
    };
  }

  return null;
}

const getRouteConfig = (pathname: string, router: AppRouterInstance) => {
  const dynamicRoute = getDynamicRouteConfig(pathname, router);

  if (dynamicRoute) {
    return dynamicRoute;
  }

  const routes: RouteConfig[] = [
    {
      path: "/dashboard/quotations/new",
      exact: true,
      title: "Nueva Cotizacion",
      href: "Dashboard / Cotizaciones / Nueva",
      action: {
        label: "Volver",
        onClick: () => router.push("/dashboard/quotations"),
        variant: "outline",
      },
    },
    {
      path: "/dashboard/quotations",
      title: "Administrador de Cotizaciones",
      href: "Dashboard / Cotizaciones",
      action: {
        label: "Nueva Cotizacion",
        onClick: () => router.push("/dashboard/quotations/new"),
        variant: "primary",
      },
    },
    {
      path: "/dashboard/clients/new",
      exact: true,
      title: "Nuevo Cliente",
      href: "Dashboard / Clientes / Nuevo",
      action: {
        label: "Volver",
        onClick: () => router.push("/dashboard/clients"),
        variant: "outline",
      },
    },
    {
      path: "/dashboard/clients",
      title: "Administrador de Clientes",
      href: "Dashboard / Clientes",
      action: {
        label: "Nuevo cliente",
        onClick: () => router.push("/dashboard/clients/new"),
        variant: "primary",
      },
    },
    {
      path: "/dashboard/products/new",
      exact: true,
      title: "Anadir Producto",
      href: "Dashboard / Productos / Nuevo",
      action: {
        label: "Volver",
        onClick: () => router.push("/dashboard/products"),
        variant: "outline",
      },
    },
    {
      path: "/dashboard/products",
      title: "Administrador de Productos",
      href: "Dashboard / Productos",
      action: {
        label: "Anadir producto",
        onClick: () => router.push("/dashboard/products/new"),
        variant: "primary",
      },
    },
    {
      path: "/dashboard",
      exact: true,
      title: "Panel Principal",
      href: "Dashboard",
    },
    {
      path: "/dashboard/projects",
      exact: true,
      title: "Administrador de Proyectos",
      href: "Dashboard / Proyectos",
    },
    {
      path: "/dashboard/users",
      exact: true,
      title: "Administrador de Usuarios",
      href: "Dashboard / Usuarios",
      action: {
        label: "Nuevo usuario",
        onClick: () => router.push("/dashboard/users/new"),
        variant: "primary",
      },
    },
    {
      path: "/dashboard/users/new",
      exact: true,
      title: "Anadir usuario",
      href: "Dashboard / Usuarios / Nuevo",
      action: {
        label: "Volver",
        onClick: () => router.push("/dashboard/users"),
        variant: "outline",
      },
    },
    {
      path: "/dashboard/reviews",
      exact: true,
      title: "Administrador de Resenas",
      href: "Dashboard / Resenas",
      action: {
        label: "Nueva resena",
        onClick: () => router.push("/dashboard/reviews/new"),
        variant: "primary",
      },
    },
    {
      path: "/dashboard/reviews/new",
      exact: true,
      title: "Anadir resena",
      href: "Dashboard / Resenas / Nueva",
      action: {
        label: "Volver",
        onClick: () => router.push("/dashboard/reviews"),
        variant: "outline",
      },
    },
  ];

  return (
    routes.find((route) =>
      route.exact ? pathname === route.path : pathname.startsWith(route.path),
    ) || {
      title: "Dashboard",
      href: "Dashboard",
      action: undefined,
    }
  );
};

interface HeaderProps {
  actions?: React.ReactNode;
  onToggleSidebar?: () => void;
}

export default function Header({actions, onToggleSidebar}: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();

  const config = useMemo(
    () => getRouteConfig(pathname, router),
    [pathname, router],
  );

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex min-h-16 w-full items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-4">
          {onToggleSidebar ? (
            <Button
              variant="outline"
              onClick={onToggleSidebar}
              className="lg:hidden">
              <span className="text-xl">&#9776;</span>
            </Button>
          ) : null}

          <div className="flex min-w-0 flex-col">
            <p className="truncate text-sm font-bold text-slate-900">
              {config.title}
            </p>
            <p className="mt-1 hidden truncate text-xs font-medium text-neutral-500 sm:block">
              {config.href}
            </p>
          </div>
        </div>
        <div className="flex flex-1 justify-center">
          <UniversalSearch />
        </div>

        <div className="flex items-center gap-3">
          {actions}

          <button
            type="button"
            className="flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 p-1 pr-3 text-sm transition-all hover:bg-neutral-100">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#023186] text-[10px] font-bold text-white">
              JD
            </div>
            <span className="hidden font-medium text-slate-700 md:inline">
              Mi Cuenta
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
