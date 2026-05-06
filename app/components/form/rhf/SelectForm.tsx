"use client";

import React from "react";
import {
  Controller,
  type Control,
  type FieldError,
  type FieldValues,
  type Path,
} from "react-hook-form";

import {FormFieldBase} from "../base";
import {Select, type SelectOption} from "../base";

interface SelectFormProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  control: Control<T>;
  options: SelectOption[];
  error?: FieldError;
  placeholder?: string;
  disabled?: boolean;
  valueAsNumber?: boolean;
}

export function SelectForm<T extends FieldValues>({
  label,
  name,
  control,
  options,
  error,
  placeholder = "Seleccione una opción",
  disabled = false,
  valueAsNumber = false,
}: SelectFormProps<T>) {
  return (
    <FormFieldBase label={label} error={error?.message}>
      <Controller
        name={name}
        control={control}
        render={({field}) => {
          const currentValue =
            field.value === null || field.value === undefined
              ? ""
              : String(field.value);

          return (
            <Select
              name={field.name}
              ref={field.ref}
              disabled={disabled}
              value={currentValue}
              onBlur={field.onBlur}
              options={options}
              placeholder={placeholder}
              error={!!error}
              onChange={(e) => {
                const v = e.target.value;

                if (v === "") {
                  field.onChange("");
                  return;
                }

                field.onChange(valueAsNumber ? Number(v) : v);
              }}
            />
          );
        }}
      />
    </FormFieldBase>
  );
}
