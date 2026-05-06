import React from "react";
import {calculateItemTotals} from "../../../utils/calculateItem";
import type {Item} from "../models/item.model";
import type {PresentationType} from "../models/presentation.model";

export interface QuotationItemCardProps {
  item: Item;
  presentationType: PresentationType;
  onItemChange: (updatedItem: Item) => void;
  onRemove?: () => void;
  readOnly?: boolean;
  errors?: {
    unit?: string;
    quantity?: string;
    unitPrice?: string;
  };
  reference: string;
}

export const QuotationItemCard = ({
  item,
  presentationType,
  onItemChange,
  onRemove,
  readOnly = false,
  errors,
  reference,
}: QuotationItemCardProps) => {
  const calculations = calculateItemTotals(
    reference,
    item.quantity,
    item.unitPrice,
    item.adminPercent,
    item.imprPercent,
    item.utilPercent,
    item.ivaPercent,
  );

  const handleFieldChange = (field: keyof Item, value: string | number) => {
    onItemChange({...item, [field]: value});
  };

  const showDetailedAIU =
    presentationType === "Detalle por item con AIU detallado";
  const showAIUIncluded =
    presentationType === "Detalle por item con AIU incluído";

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 space-y-6 transition-all duration-200 hover:shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-2 h-6 bg-[#0A3D91] rounded-full"></div>
          <h4 className="text-lg font-semibold text-slate-900">
            Producto:{" "}
            <span className="text-[#0A3D91] font-bold">{item.code}</span>
          </h4>
        </div>

        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            disabled={readOnly}
            className="p-1.5 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Descripción */}
      <div>
        <label className="block font-semibold text-sm text-[#0F172A] mb-2">
          Descripción
        </label>
        {readOnly ? (
          <p className="text-[#475569] p-3 bg-[#EFF4FF] rounded-lg border border-[#EFF4FF]">
            {item.description}
          </p>
        ) : (
          <input
            type="text"
            value={item.description as string}
            onChange={(e) => handleFieldChange("description", e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 focus:border-[#0A3D91] focus:ring-2 focus:ring-[#0A3D91]/20 transition-all duration-200 text-[#0F172A] placeholder-gray-400"
            placeholder="Ingrese descripción del producto"
          />
        )}
      </div>

      {/* Datos básicos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Unidad */}
        <div>
          <label className="block text-sm font-semibold text-[#475569] mb-2">
            Unidad
          </label>
          {readOnly ? (
            <div
              className={`w-full p-3 rounded-lg border transition-all ${
                errors?.unit
                  ? "border-red-500 focus:ring-red-500/30"
                  : "border-gray-300 focus:border-[#0A3D91] focus:ring-[#0A3D91]/20"
              }`}>
              {item.unit}
              {errors?.unit && (
                <p className="mt-1 text-xs text-red-600">{errors.unit}</p>
              )}
            </div>
          ) : (
            <select
              value={item.unit}
              onChange={(e) => handleFieldChange("unit", e.target.value)}
              className={`
              ${
                errors?.unit
                  ? "border-red-500 focus:ring-red-500/30"
                  : "border-gray-300 focus:border-[#0A3D91] focus:ring-[#0A3D91]/20"
              }
               w-full p-3 rounded-lg border border-gray-300 focus:border-[#0A3D91] focus:ring-2 focus:ring-[#0A3D91]/20 transition-all duration-200 text-[#0F172A] bg-white`}>
              <option value="und">Unidad (und)</option>
              <option value="glb">Galón (glb)</option>
              <option value="m2">Metro cuadrado (m²)</option>
              <option value="m">Metro lineal (m)</option>
              <option value="hr">Hora (hr)</option>
            </select>
          )}
        </div>

        {/* Cantidad */}
        <div>
          <label className="block text-sm font-semibold text-[#475569] mb-2">
            Cantidad
          </label>
          {readOnly ? (
            <div className="p-3 bg-[#EFF4FF] rounded-lg border border-[#EFF4FF] text-[#0F172A]">
              {item.quantity.toLocaleString()}
            </div>
          ) : (
            <input
              type="number"
              min="0"
              value={item.quantity}
              onChange={(e) =>
                handleFieldChange("quantity", Number(e.target.value) || 0)
              }
              className="w-full p-3 rounded-lg border border-gray-300 focus:border-[#0A3D91] focus:ring-2 focus:ring-[#0A3D91]/20 transition-all duration-200 text-[#0F172A]"
            />
          )}
        </div>

        {/* Precio unitario */}
        <div>
          <label className="block text-sm font-semibold text-[#475569] mb-2">
            Precio unitario
          </label>
          {readOnly ? (
            <div className="p-3 bg-[#EFF4FF] rounded-lg border border-[#EFF4FF] text-[#0F172A]">
              ${item.unitPrice.toLocaleString()}
            </div>
          ) : (
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">$</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={item.unitPrice}
                onChange={(e) =>
                  handleFieldChange("unitPrice", Number(e.target.value) || 0)
                }
                className="w-full pl-8 p-3 rounded-lg border border-gray-300 focus:border-[#0A3D91] focus:ring-2 focus:ring-[#0A3D91]/20 transition-all duration-200 text-[#0F172A]"
              />
            </div>
          )}
        </div>
      </div>

      {/* Cálculos */}
      <div className="rounded-xl bg-gradient-t-br from-[#EFF4FF] to-white p-5 space-y-3 text-sm border border-[#EFF4FF]">
        <Calculation
          label="Subtotal"
          value={calculations.subtotal}
          className="text-[#0F172A]"
        />

        {showDetailedAIU && (
          <>
            <Calculation
              label={`Administracion (${item.adminPercent || 2.5}%)`}
              value={calculations.admin}
              className="text-[#475569]"
            />
            <Calculation
              label={`Imprevistos (${item.imprPercent || 2.5}%)`}
              value={calculations.impr}
              className="text-[#475569]"
            />
            <Calculation
              label={`Utilidad (${item.utilPercent || 10}%)`}
              value={calculations.util}
              className="text-[#475569]"
            />
          </>
        )}

        <Calculation
          label={`IVA (${item.ivaPercent || 19}%)`}
          value={calculations.iva}
          className="text-[#475569]"
        />

        <div className="flex justify-between font-semibold text-base border-t border-gray-200 pt-3 mt-2">
          <span className="text-[#0F172A]">Total del ítem</span>
          <span className="text-[#0A3D91] text-lg">
            ${calculations.total.toLocaleString()}
          </span>
        </div>

        {showAIUIncluded && (
          <div className="flex items-center gap-2 text-xs text-[#475569] mt-3 pt-3 border-t border-gray-100">
            <div className="w-2 h-2 rounded-full bg-[#16A34A]"></div>
            <span>AIU incluído en el total (A + I + U)</span>
          </div>
        )}
      </div>

      {/* Edición de porcentajes */}
      {!readOnly && showDetailedAIU && (
        <div className="rounded-lg border border-gray-100 p-4 bg-white">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-4 bg-[#0E4DB3] rounded-full"></div>
            <h5 className="font-semibold text-[#0F172A]">Editar porcentajes</h5>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {field: "adminPercent", label: "Administrativo"},
              {field: "imprPercent", label: "Imprevistos"},
              {field: "utilPercent", label: "Utilidad"},
              {field: "ivaPercent", label: "IVA"},
            ].map(({field, label}) => (
              <div key={field} className="space-y-1">
                <label className="block text-xs font-medium text-[#475569]">
                  {label}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={(item[field as keyof Item] as number) || 0}
                    onChange={(e) =>
                      handleFieldChange(
                        field as keyof Item,
                        Number(e.target.value) || 0,
                      )
                    }
                    className="w-full p-2.5 pr-8 rounded-lg border border-gray-300 focus:border-[#0A3D91] focus:ring-2 focus:ring-[#0A3D91]/20 transition-all duration-200 text-[#0F172A]"
                  />
                  <span className="absolute right-3 top-2.5 text-sm text-gray-400">
                    %
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Calculation = ({
  label,
  value,
  className = "",
}: {
  label: string;
  value: number;
  className?: string;
}) => (
  <div className="flex justify-between items-center py-1.5">
    <span className={`text-sm font-medium ${className || "text-[#475569]"}`}>
      {label}
    </span>
    <span
      className={`font-semibold ${
        value >= 0 ? "text-[#0F172A]" : "text-red-500"
      }`}>
      $
      {value.toLocaleString("es-ES", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
    </span>
  </div>
);
