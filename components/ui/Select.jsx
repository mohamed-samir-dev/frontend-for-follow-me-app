import { cn } from "@/lib/utils";

export function Select({ label, error, options, className, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <select
        className={cn(
          "w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-900",
          "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all",
          error && "border-red-300",
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
