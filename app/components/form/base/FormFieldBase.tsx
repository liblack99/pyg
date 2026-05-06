interface FormFieldBaseProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

export function FormFieldBase({label, error, children}: FormFieldBaseProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-[#0F172A]">{label}</label>

      {children}

      {error && (
        <span className="text-xs font-medium text-red-600">{error}</span>
      )}
    </div>
  );
}
