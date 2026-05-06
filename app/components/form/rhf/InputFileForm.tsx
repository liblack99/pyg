"use client";

import {
  Controller,
  type Control,
  type FieldError,
  type FieldValues,
  type Path,
} from "react-hook-form";
import {FileUploadField} from "../base/FileUploadField";

interface FileUploadFieldFormProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  control: Control<T>;
  error?: FieldError;
  disabled?: boolean;
  accept?: string;
  helperText?: string;
  recommendedMaxText?: string;
}

export function InputFileForm<T extends FieldValues>({
  label,
  name,
  control,
  error,
  disabled = false,
  accept,
  helperText,
  recommendedMaxText,
}: FileUploadFieldFormProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({field}) => (
        <FileUploadField
          label={label}
          name={field.name}
          value={(field.value as File | null) ?? null}
          onBlur={field.onBlur}
          onChange={(file) => {
            field.onChange(file as T[typeof name]);
          }}
          error={error?.message}
          disabled={disabled}
          accept={accept}
          helperText={helperText}
          recommendedMaxText={recommendedMaxText}
        />
      )}
    />
  );
}
