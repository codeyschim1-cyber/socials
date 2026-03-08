interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className = '', ...props }: InputProps) {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-zinc-600 mb-1.5">{label}</label>}
      <input
        className={`w-full bg-surface-elevated border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 transition-colors ${className}`}
        {...props}
      />
    </div>
  );
}
