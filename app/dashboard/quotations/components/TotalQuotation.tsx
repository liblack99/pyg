import {UseFormWatch} from "react-hook-form";

import {QuotationFormData} from "../../../core/quotations/schemas/quotation.schema";

type Props = {
  Watch: UseFormWatch<QuotationFormData>;
};

export default function TotalQuotation({Watch}: Props) {
  const watch = Watch;
  return (
    <div className="rounded-md bg-linear-to-br from-blue-900 to-blue-700 p-6 shadow-xl">
      <h3 className="text-xl font-bold text-blue-100 mb-4">
        Totales de la cotización
      </h3>

      <div className="flex items-center justify-between rounded-xl bg-white/10 px-6 py-5">
        <span className="text-lg font-medium text-blue-100">Total general</span>
        <span className="text-3xl font-extrabold text-white">
          $
          {watch("totalGeneral")
            ? Number(watch("totalGeneral")).toLocaleString("es-CO")
            : "0"}
        </span>
      </div>
    </div>
  );
}
