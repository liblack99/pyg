import {Package, Tag, Star, BarChart3} from "lucide-react";
import type {ProductDashboardStats} from "@/app/core/products/dto";
import CardDashboard from "@/app/components/ui/CardDashboard";
interface Props {
  data: ProductDashboardStats;
}

export default function ProductSummary({data}: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-6">
      <CardDashboard
        title="Productos en Catálogo"
        value={data.catalogSize.count}
        subtext={data.catalogSize.subtext}
        isPositive={data.catalogSize.isPositive}
        icon={<Package size={20} />}
      />

      <CardDashboard
        title="Precio Promedio"
        value={data.averagePrice.formatted}
        subtext={data.averagePrice.subtext}
        isPositive={true}
        icon={<Tag size={20} />}
      />

      <CardDashboard
        title="Producto Estrella"
        value={data.topProduct.name}
        subtext={data.topProduct.usage}
        isPositive={true}
        icon={<Star size={20} className="fill-yellow-400 text-yellow-400" />}
      />
    </div>
  );
}
