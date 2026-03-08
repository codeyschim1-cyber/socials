import { Badge } from '@/components/ui/Badge';
import { STATUS_COLORS, STATUS_LABELS } from '@/lib/constants';
import { PostStatus } from '@/types/calendar';

export function PostStatusBadge({ status }: { status: PostStatus }) {
  const colors = STATUS_COLORS[status];
  return (
    <Badge className={`${colors.bg} ${colors.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot} mr-1.5`} />
      {STATUS_LABELS[status]}
    </Badge>
  );
}
