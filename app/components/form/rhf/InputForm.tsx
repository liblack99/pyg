"use client";

import {
  Controller,
  type Control,
  type FieldError,
  type FieldValues,
  type Path,
} from "react-hook-form";

import {Input} from "../base";
import {FormFieldBase} from "../base";

type TextLikeType =
  | "text"
  | "email"
  | "password"
  | "search"
  | "tel"
  | "url"
  | "date";

interface InputFormProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  control: Control<T>;
  error?: FieldError;

  type?: TextLikeType;
  disabled?: boolean;
  placeholder?: string;
  autoComplete?: string;
}

export function InputForm<T extends FieldValues>({
  label,
  name,
  control,
  error,
  type = "text",
  disabled = false,
  placeholder,
  autoComplete,
}: InputFormProps<T>) {
  return (
    <FormFieldBase label={label} error={error?.message}>
      <Controller
        name={name}
        control={control}
        render={({field}) => (
          <Input
            {...field}
            type={type}
            disabled={disabled}
            placeholder={placeholder}
            autoComplete={autoComplete}
            error={!!error}
          />
        )}
      />
    </FormFieldBase>
  );
}
