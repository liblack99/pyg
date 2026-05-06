import type {DashboardChartPoint} from "@/app/core/dashboard/dto";
export function toChartData(points: DashboardChartPoint[]) {
  return points.map((point) => ({
    label: point.label,
    value: point.value,
  }));
}
