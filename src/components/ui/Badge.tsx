import { PLATFORM_COLORS, PLATFORM_SHORT_LABELS } from '@/lib/constants';
import { Platform } from '@/types/common';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function Badge({ children, className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${className}`}>
      {children}
    </span>
  );
}

export function PlatformBadge({ platform }: { platform: Platform }) {
  return (
    <Badge className={PLATFORM_COLORS[platform].badge}>
      {PLATFORM_SHORT_LABELS[platform]}
    </Badge>
  );
}
