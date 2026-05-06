"use client";

import React from "react";
import {
  Controller,
  type Control,
  type FieldError,
  type FieldValues,
  type Path,
} from "react-hook-form";

import {FormFieldBase} from "../base/FormFieldBase";
import {CurrencyInput} from "../base/CurrencyInput";

interface CurrencyInputFormProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  control: Control<T>;
  error?: FieldError;
  disabled?: boolean;
  placeholder?: string;
  locale?: string;
  allowNegative?: boolean;
}

export function CurrencyInputForm<T extends FieldValues>({
  label,
  name,
  control,
  error,
  disabled = false,
  placeholder,
  locale = "es-CO",
  allowNegative = false,
}: CurrencyInputFormProps<T>) {
  return (
    <FormFieldBase label={label} error={error?.message}>
      <Controller
        name={name}
        control={control}
        render={({field}) => (
          <CurrencyInput
            ref={field.ref}
            name={field.name}
            value={
              typeof field.value === "number" && Number.isFinite(field.value)
                ? field.value
                : 0
            }
            onChange={(value) => {
              field.onChange(value);
            }}
            onBlur={field.onBlur}
            disabled={disabled}
            placeholder={placeholder}
            error={!!error}
            locale={locale}
            allowNegative={allowNegative}
          />
        )}
      />
    </FormFieldBase>
  );
}
