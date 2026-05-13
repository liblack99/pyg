import React, {useState} from "react";
import {Trash2, Settings2, Calculator, Info} from "lucide-react";
import {calculateItemTotals} from "../../../utils/calculateItem";
import type {Item} from "../models/item.model";
import type {PresentationType} from "../models/presentation.model";

export interface QuotationItemRowProps {
  item: Item;
  presentationType: PresentationType;
  onItemChange: (updatedItem: Item) => void;
  onRemove?: () => void;
  readOnly?: boolean;
  reference: string;
}

export const QuotationItemRow = ({
  item,
  presentationType,
  onItemChange,
  onRemove,
  readOnly = false,
  reference,
}: QuotationItemRowProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const cal = calculateItemTotals(
    reference,
    item.quantity,
    item.unitPrice,
    item.adminPercent,
    item.imprPercent,
    item.utilPercent,
    item.ivaPercent,
  );

  const showDetailedAIU =
    presentationType === "Detalle por item con AIU detallado";
  const showAIUIncluded =
    presentationType === "Detalle por item con AIU incluído";

  return (
    <div className="group mb-3 overflow-hidden rounded-md border border-slate-200 bg-white hover:border-indigo-300 transition-all shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 p-4">
        {/* Identificación del Producto + Unidad */}
        <div className="flex flex-1 items-center gap-4">
          <div className="flex flex-col min-w-[80px]">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
              Código
            </span>
            <span className="text-xs font-bold text-indigo-700">
              {item.code}
            </span>
          </div>

          {/* Valor de Unidad (Solo lectura, viene del producto) */}
          <div className="flex flex-col min-w-[60px] px-3 border-x border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight text-center">
              Unidad
            </span>
            <span className="text-xs font-semibold text-slate-600 text-center capitalize">
              {item.unit || "und"}
            </span>
          </div>

          <div className="flex-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase mb-0.5 block">
              Descripción
            </label>
            <input
              type="text"
              disabled={readOnly}
              value={item.description as string}
              onChange={(e) =>
                onItemChange({...item, description: e.target.value})
              }
              className="w-full bg-transparent text-sm font-medium text-slate-700 focus:outline-none border-b border-transparent focus:border-indigo-200 transition-colors disabled:opacity-70"
            />
          </div>
        </div>

        {/* CÁLCULOS DINÁMICOS SEGÚN PRESENTACIÓN */}
        {showDetailedAIU && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 py-2 bg-slate-50 rounded-lg border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <DetailValue
              label={`Adm (${item.adminPercent || 0}%)`}
              value={cal.admin}
            />
            <DetailValue
              label={`Imp (${item.imprPercent || 0}%)`}
              value={cal.impr}
            />
            <DetailValue
              label={`Util (${item.utilPercent || 0}%)`}
              value={cal.util}
            />
            <DetailValue
              label={`IVA (${item.ivaPercent || 0}%)`}
              value={cal.iva}
            />
          </div>
        )}

        {showAIUIncluded && (
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-lg border border-emerald-100">
            <Calculator size={14} className="text-emerald-600" />
            <span className="text-[10px] font-bold text-emerald-700 uppercase leading-none">
              AIU Incluido
            </span>
          </div>
        )}

        {/* Inputs de Cantidad y Totales */}
        <div className="flex items-center gap-4 ml-auto border-t lg:border-t-0 pt-3 lg:pt-0 w-full lg:w-auto">
          <div className="w-16 lg:w-20">
            <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1 text-center">
              Cant.
            </span>
            <input
              type="number"
              disabled={readOnly}
              value={item.quantity}
              onChange={(e) =>
                onItemChange({...item, quantity: Number(e.target.value) || 0})
              }
              className="w-full text-center text-sm font-bold bg-slate-50 border border-slate-100 rounded-md p-1.5 focus:bg-white focus:border-indigo-400 transition-all"
            />
          </div>

          <div className="min-w-[120px] text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
              Total Ítem
            </span>
            <p className="text-base font-black text-slate-900 tracking-tight">
              ${cal.total.toLocaleString("es-CO", {minimumFractionDigits: 0})}
            </p>
          </div>

          {/* Acciones de Fila */}
          <div className="flex items-center gap-1 border-l pl-3">
            {showDetailedAIU && !readOnly && (
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className={`p-2 rounded-lg transition-all ${isExpanded ? "bg-blue-500 text-white shadow-md" : "text-slate-400 hover:bg-slate-100"}`}
                title="Editar porcentajes">
                <Settings2 size={16} />
              </button>
            )}

            {onRemove && (
              <button
                type="button"
                disabled={readOnly}
                onClick={onRemove}
                className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                title="Eliminar ítem">
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* PANEL DE EDICIÓN DE PORCENTAJES */}
      {isExpanded && showDetailedAIU && (
        <div className="p-4 bg-slate-50/50 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-4 animate-in slide-in-from-top-2 duration-200">
          <PctInput
            label="Administración %"
            value={item.adminPercent}
            onChange={(v) => onItemChange({...item, adminPercent: v})}
          />
          <PctInput
            label="Imprevistos %"
            value={item.imprPercent}
            onChange={(v) => onItemChange({...item, imprPercent: v})}
          />
          <PctInput
            label="Utilidad %"
            value={item.utilPercent}
            onChange={(v) => onItemChange({...item, utilPercent: v})}
          />
          <PctInput
            label="IVA %"
            value={item.ivaPercent}
            onChange={(v) => onItemChange({...item, ivaPercent: v})}
          />
        </div>
      )}

      {/* FOOTER PARA MODO GRUPAL */}
      {presentationType === "De forma grupal" && (
        <div className="bg-slate-50 px-4 py-1.5 border-t border-slate-100 flex items-center gap-2">
          <Info size={12} className="text-slate-400" />
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
            El desglose de AIU se mostrará de forma global al final de la
            cotización.
          </span>
        </div>
      )}
    </div>
  );
};

// ... Sub-componentes DetailValue y PctInput se mantienen igual
const DetailValue = ({label, value}: {label: string; value: number}) => (
  <div className="flex flex-col min-w-[75px]">
    <span className="text-[9px] font-bold text-slate-400 uppercase leading-tight">
      {label}
    </span>

    <span className="text-xs font-bold text-slate-700">
      ${value.toLocaleString("es-CO", {minimumFractionDigits: 0})}
    </span>
  </div>
);

const PctInput = ({
  label,

  value,

  onChange,
}: {
  label: string;

  value: number;

  onChange: (v: number) => void;
}) => (
  <div className="space-y-1">
    <label className="block text-[10px] font-bold text-slate-500 uppercase">
      {label}
    </label>

    <div className="relative">
      <input
        type="number"
        value={value || 0}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="w-full p-2 pr-7 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all shadow-sm"
      />

      <span className="absolute right-2.5 top-2 text-[10px] text-slate-400">
        %
      </span>
    </div>
  </div>
);
