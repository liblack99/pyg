import React from "react";
import {Section} from "@/app/components/layout/Section";
import PageHeader from "@/app/components/layout/PageHeader";
import {can} from "@/app/lib/auth.types";
import type {Me} from "@/app/lib/auth.types";
import ProductsTable from "./ProductsTable";
import ProductsToolbar from "./ProductsToolBar";
import ProductSummary from "./ProductSummary";
import type {ProductDashboardStats} from "@/app/core/products/dto";
import type {ProductListItem} from "@/app/core/products/dto";
import type {CursorPage} from "@/app/core/shared/types/pagination.types";

interface Props {
  me: Me;
  summary: ProductDashboardStats;
  page1: CursorPage<ProductListItem>;
  search: string;
}

export default function PageContentProduct({
  me,
  summary,
  page1,
  search,
}: Props) {
  return (
    <Section>
      <PageHeader
        title="Productos"
        subtitle="Gestiona tus productos"
        href="/dashboard/products/new"
        textButton="Nuevo producto"
      />
      <ProductSummary data={summary} />
      <div className=" flex flex-col gap-6 bg-white pt-6 rounded-xl shadow-sm overflow-hidden ">
        <ProductsToolbar
          values={{search}}
          canManage={can(me, "products:manage")}
        />

        <ProductsTable
          initialItems={page1.items}
          initialNextCursor={page1.nextCursor}
          canManage={can(me, "products:manage")}
        />
      </div>
    </Section>
  );
}
