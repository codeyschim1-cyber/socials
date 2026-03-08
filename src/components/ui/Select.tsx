interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, options, className = '', ...props }: SelectProps) {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-zinc-600 mb-1.5">{label}</label>}
      <select
        className={`w-full bg-surface-elevated border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 transition-colors ${className}`}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
