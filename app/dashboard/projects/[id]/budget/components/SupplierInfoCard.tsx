import type {Supplier} from "@/app/core/supplier/dto";
import {
  MapPin,
  User,
  Phone,
  FileText,
  ClipboardList,
  StickyNote,
  Info,
} from "lucide-react";

export function SupplierInfoCard({supplier}: {supplier: Supplier}) {
  return (
    <div className="absolute w-72 bg-white rounded-xl shadow-2xl border border-slate-200 animate-in fade-in slide-in-from-bottom-2 duration-200 pointer-events-none">
      <div className="p-4">
        {/* Header - Altura fija para consistencia */}
        <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-100 h-11">
          <div className="p-1.5 bg-blue-50 rounded-lg shrink-0">
            <Info className="w-4 h-4 text-blue-600" />
          </div>
          <h4 className="font-bold text-slate-800 text-sm leading-tight truncate">
            {supplier.name}
          </h4>
        </div>

        {/* Cuerpo de detalles */}
        <div className="space-y-2">
          {/* Ciudad */}
          <div className="flex items-center gap-2 text-xs h-5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-600 truncate">
              <span className="font-medium text-slate-800">Ciudad:</span>{" "}
              {supplier.city || "No definida"}
            </span>
          </div>

          {/* Contacto */}
          <div className="flex items-center gap-2 text-xs h-5">
            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-600 truncate">
              <span className="font-medium text-slate-800">Contacto:</span>{" "}
              {supplier.contactName || "Sin asignar"}
            </span>
          </div>

          {/* Teléfono */}
          <div className="flex items-center gap-2 text-xs h-5">
            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-600">
              <span className="font-medium text-slate-800">Tel:</span>{" "}
              {supplier.phone || "N/A"}
            </span>
          </div>

          {/* Badges - Altura mínima reservada para que no salte si no hay badges */}
          <div className="pt-1 flex flex-wrap gap-2 min-h-[28px]">
            {supplier.invoiceRequired ? (
              <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 border border-amber-100 rounded-md text-[10px] font-medium">
                <FileText className="w-3 h-3" />
                Factura
              </div>
            ) : (
              <div className="px-2 py-1 border border-transparent text-[10px] opacity-0 text-white select-none">
                Spacer
              </div>
            )}

            {supplier.requiresProductionOrder && (
              <div className="flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 border border-purple-100 rounded-md text-[10px] font-medium">
                <ClipboardList className="w-3 h-3" />
                Orden Prod.
              </div>
            )}
          </div>

          {/* Notas - Tamaño controlado con line-clamp */}
          <div className="mt-2 flex gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100 h-16 overflow-hidden">
            <StickyNote className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-500 leading-tight italic line-clamp-3">
              {supplier.notes || "Sin notas adicionales."}
            </p>
          </div>
        </div>
      </div>

      {/* Triángulo decorativo - Posición absoluta fija respecto a la card */}
      <div className="absolute -bottom-1.5 left-6 w-3 h-3 bg-white border-r border-b border-slate-200 rotate-45" />
    </div>
  );
}
