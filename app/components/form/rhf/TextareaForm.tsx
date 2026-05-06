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
import {Textarea} from "../base/Textarea";

interface TextareaFormProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  control: Control<T>;
  error?: FieldError;
  disabled?: boolean;
  rows?: number;
  placeholder?: string;
}

export function TextareaForm<T extends FieldValues>({
  label,
  name,
  control,
  error,
  disabled = false,
  rows = 4,
  placeholder,
}: TextareaFormProps<T>) {
  return (
    <FormFieldBase label={label} error={error?.message}>
      <Controller
        name={name}
        control={control}
        render={({field}) => (
          <Textarea
            name={field.name}
            ref={field.ref}
            value={(field.value ?? "") as string}
            onChange={field.onChange}
            onBlur={field.onBlur}
            disabled={disabled}
            rows={rows}
            placeholder={placeholder}
            error={!!error}
          />
        )}
      />
    </FormFieldBase>
  );
}
