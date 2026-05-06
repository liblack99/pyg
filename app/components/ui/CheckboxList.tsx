export interface ChecklistItem {
  key: string;
  text: string;
  required: boolean;
  accepted: boolean;
}

interface CheckboxListProps {
  items: ChecklistItem[];
  label?: string;
  errorMessage?: string;
  onChange: (key: string, checked: boolean) => void;
}

export function CheckboxList({
  items,
  label,
  errorMessage,
  onChange,
}: CheckboxListProps) {
  return (
    <fieldset
      className={`rounded-xl border p-4 space-y-3 ${
        errorMessage
          ? "border-red-300 bg-red-50"
          : "border-slate-200 bg-slate-50"
      }`}>
      {label && (
        <legend className="px-1 text-sm font-semibold text-[#0F172A]">
          {label}
        </legend>
      )}

      {items.map((item) => (
        <label
          key={item.key}
          className="flex items-start gap-3 rounded-lg p-2 text-sm text-slate-700 cursor-pointer hover:bg-white transition">
          <input
            type="checkbox"
            value={item.text}
            defaultChecked={item.accepted}
            onChange={(e) => onChange(item.key, e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-slate-300 text-[#0A3D91] focus:ring-2 focus:ring-[#0A3D91]/30"
          />

          <span className="leading-snug">
            {item.text}
            {item.required && (
              <span className="ml-1 text-red-500 font-medium">*</span>
            )}
          </span>
        </label>
      ))}

      {errorMessage && (
        <p className="text-xs font-medium text-red-600">{errorMessage}</p>
      )}
    </fieldset>
  );
}
