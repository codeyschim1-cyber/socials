interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-surface-card border border-zinc-800 rounded-xl p-4 ${onClick ? 'cursor-pointer hover:border-zinc-700 transition-colors' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
