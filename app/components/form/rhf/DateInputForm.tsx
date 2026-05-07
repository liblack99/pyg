"use client";

import {
  Controller,
  type Control,
  type FieldError,
  type FieldValues,
  type Path,
} from "react-hook-form";

import {FormFieldBase} from "../base";
import {DateInput} from "../base/DateInput";

interface DateInputFormProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  control: Control<T>;
  error?: FieldError;

  disabled?: boolean;
}

export function DateInputForm<T extends FieldValues>({
  label,
  name,
  control,
  error,
  disabled = false,
}: DateInputFormProps<T>) {
  return (
    <FormFieldBase label={label} error={error?.message}>
      <Controller
        name={name}
        control={control}
        render={({field}) => (
          <DateInput
            value={field.value}
            onChange={field.onChange}
            disabled={disabled}
            error={!!error}
          />
        )}
      />
    </FormFieldBase>
  );
}
