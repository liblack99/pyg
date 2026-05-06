"use client";

import type {
  FieldErrors,
  Control,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

import {InputForm} from "../../../components/form/rhf/InputForm";
import type {QuotationFormData} from "../../../core/quotations/schemas/quotation.schema";
import type {ClientListItem} from "@/app/core/clients/dto";
import {apiGet} from "@/app/lib/api.client";
import {
  SearchAutocomplete,
  type CursorPage,
} from "@/app/components/search/SearchAutocomplete";
import {SelectForm} from "@/app/components/form/rhf/SelectForm";

interface Props {
  control: Control<QuotationFormData>;
  setValue: UseFormSetValue<QuotationFormData>;
  errors: FieldErrors<QuotationFormData>;
  watch: UseFormWatch<QuotationFormData>;
}

type ClientListResponse = CursorPage<ClientListItem>;

export function ClientFormSection({control, setValue, errors, watch}: Props) {
  const searchClients = async (term: string) => {
    const url = `/api/clients?search=${encodeURIComponent(term)}&limit=10`;
    const res = await apiGet<ClientListResponse>(url);
    return res;
  };

  const fillClientFields = (c: ClientListItem) => {
    setValue("client.id", c.id, {shouldDirty: true});
    setValue("client.name", c.name, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    setValue("client.documentType", c.documentType, {
      shouldDirty: true,
      shouldTouch: true,
    });
    setValue("client.documentNumber", c.documentNumber, {
      shouldDirty: true,
      shouldTouch: true,
    });
    setValue("client.email", c.email ?? "", {
      shouldDirty: true,
      shouldTouch: true,
    });
    setValue("client.phone", c.phone ?? "", {
      shouldDirty: true,
      shouldTouch: true,
    });
    setValue("client.department", c.department ?? "", {
      shouldDirty: true,
      shouldTouch: true,
    });
    setValue("client.city", c.city ?? "", {
      shouldDirty: true,
      shouldTouch: true,
    });
    setValue("client.address", c.address ?? "", {
      shouldDirty: true,
      shouldTouch: true,
    });
    setValue("client.contactName1", c.contactName1 ?? "", {
      shouldDirty: true,
      shouldTouch: true,
    });
    setValue("client.contactRole1", c.contactRole1 ?? "", {
      shouldDirty: true,
      shouldTouch: true,
    });
    setValue("client.contactPhone1", c.contactPhone1 ?? "", {
      shouldDirty: true,
      shouldTouch: true,
    });
    setValue("client.contactName2", c.contactName2 ?? "", {
      shouldDirty: true,
      shouldTouch: true,
    });
    setValue("client.contactRole2", c.contactRole2 ?? "", {
      shouldDirty: true,
      shouldTouch: true,
    });
    setValue("client.contactPhone2", c.contactPhone2 ?? "", {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const documentType = [
    {value: "RUT", label: "RUT"},
    {value: "NIT", label: "NIT"},
    {value: "C.C", label: "C.C"},
    {value: "C.E", label: "C.E"},
    {value: "PASAPORTE", label: "PASAPORTE"},
  ];

  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-xl font-bold text-slate-900 mb-4 border-l-4 border-blue-700 pl-3">
          Información del cliente
        </h3>
        <h2 className="text-xl font-bold mb-4">Datos del Cliente</h2>

        <div className="grid grid-cols-3 gap-4 mb-4">
          {/* Autocomplete en vez de InputForm para el nombre */}
          <div className="col-span-3 md:col-span-1">
            <SearchAutocomplete<ClientListItem>
              minChars={2}
              label="Nombre empresa o cliente "
              debounceMs={250}
              getKey={(c) => c.id}
              clearOnSelect={false}
              onChangeValue={(value) =>
                setValue("client.name", value, {
                  shouldDirty: true,
                  shouldTouch: true,
                })
              }
              searchFn={searchClients}
              onSelect={(c) => fillClientFields(c)}
              value={watch("client.name")}
              renderItem={(c, isHighlighted) => (
                <div
                  className={`px-4 py-3 ${isHighlighted ? "bg-blue-50" : ""}`}>
                  <div className="text-xs text-slate-500">
                    {c.documentType} {c.documentNumber}
                  </div>
                  <div className="font-medium text-slate-800">{c.name}</div>
                  <div className="text-xs text-slate-500">
                    {(c.city ?? "") + (c.department ? `, ${c.department}` : "")}
                  </div>
                </div>
              )}
            />

            {errors.client?.name?.message && (
              <p className="mt-1 text-xs text-red-600">
                {errors.client?.name?.message}
              </p>
            )}
          </div>

          <SelectForm
            control={control}
            name="client.documentType"
            label="Tipo de documento "
            options={documentType.map((r) => ({
              value: r.value,
              label: r.label,
            }))}
            error={errors.client?.documentType}
          />
          <InputForm<QuotationFormData>
            label="Número de Documento "
            name="client.documentNumber"
            control={control}
            error={errors.client?.documentNumber}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <InputForm<QuotationFormData>
            label="Correo Electrónico "
            name="client.email"
            control={control}
            error={errors.client?.email}
          />

          <InputForm<QuotationFormData>
            label="Teléfono "
            name="client.phone"
            control={control}
          />
        </div>
        <div className="grid sm:grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          <InputForm<QuotationFormData>
            label="Departamento "
            name="client.department"
            control={control}
          />

          <InputForm<QuotationFormData>
            label="Ciudad "
            name="client.city"
            control={control}
          />

          <InputForm<QuotationFormData>
            label="Dirección "
            name="client.address"
            control={control}
          />
        </div>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <InputForm
            label="Nombre contacto "
            control={control}
            name="client.contactName1"
            type="text"
            error={errors.client?.contactName1}
          />

          <InputForm
            label="Cargo del contacto "
            control={control}
            name="client.contactRole1"
            type="text"
            error={errors.client?.contactRole1}
          />

          <InputForm
            label="Telefono del contacto "
            control={control}
            name="client.contactPhone1"
            type="text"
            error={errors.client?.contactPhone1}
          />
        </div>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <InputForm
            label="Nombre contacto "
            control={control}
            name="client.contactName2"
            type="text"
            error={errors.client?.contactName2}
          />

          <InputForm
            label="Cargo del contacto "
            control={control}
            name="client.contactRole2"
            type="text"
            error={errors.client?.contactRole2}
          />

          <InputForm
            label="Telefono del contacto "
            control={control}
            name="client.contactPhone2"
            type="text"
            error={errors.client?.contactPhone2}
          />
        </div>
      </div>
    </section>
  );
}
