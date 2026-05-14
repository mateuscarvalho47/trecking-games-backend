import type { GameStatus } from '@/types/api'
import { STATUS_BY_KEY } from '@/shared/constants/statuses'
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: GameStatus
  size?: 'sm' | 'md'
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const def = STATUS_BY_KEY[status]
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 font-semibold tracking-[0.01em] rounded-[5px] whitespace-nowrap',
        size === 'sm' ? 'h-5 text-[10px]' : 'h-[22px] text-[11px]',
      )}
      style={{
        border: `1px solid ${def.borderColor}`,
        color: def.color,
        background: def.bgColor,
      }}
    >
      {def.label}
    </span>
  )
}
