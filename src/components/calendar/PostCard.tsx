import { CalendarPost } from '@/types/calendar';
import { PLATFORM_COLORS } from '@/lib/constants';

interface PostCardProps {
  post: CalendarPost;
  onClick: () => void;
  compact?: boolean;
}

export function PostCard({ post, onClick, compact = false }: PostCardProps) {
  const platformColor = PLATFORM_COLORS[post.platform];

  if (compact) {
    return (
      <button
        onClick={onClick}
        className={`w-full text-left px-1.5 py-0.5 rounded text-[10px] font-medium truncate border-l-2 ${platformColor.border} bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors`}
      >
        <span className={platformColor.text}>{post.title}</span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-2 rounded-lg border-l-2 ${platformColor.border} bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors`}
    >
      <p className="text-xs font-medium text-zinc-200 truncate">{post.title}</p>
      {post.scheduledTime && <p className="text-[10px] text-zinc-500 mt-0.5">{post.scheduledTime}</p>}
    </button>
  );
}
