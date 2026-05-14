import { useNavigate } from '@tanstack/react-router'
import type { LibraryStats } from '@/types/api'
import { STATUSES } from '@/shared/constants/statuses'

interface StatusBarsCardProps {
  stats: LibraryStats
}

export function StatusBarsCard({ stats }: StatusBarsCardProps) {
  const navigate = useNavigate()
  const total = stats.totalGames || 1

  return (
    <div className="bg-bg-1 border border-border-soft rounded-lg px-5.5 py-4.5">
      <div className="text-[14.5px] font-semibold text-text-hi tracking-[-0.01em] mb-3.5">Por status</div>
      <div className="flex flex-col gap-1">
        {STATUSES.map(s => {
          const count = stats.countByStatus[s.key] ?? 0
          const pct = (count / total) * 100
          return (
            <button
              key={s.key}
              onClick={() => navigate({ to: '/library' })}
              className="grid grid-cols-[120px_1fr_32px] gap-3 items-center py-1.5 bg-transparent border-0 cursor-pointer text-left rounded-[4px] w-full transition-[background] hover:bg-bg-2 font-[inherit]"
            >
              <div className="flex items-center gap-2 text-[12.5px] text-text-md">
                <div className="size-2 rounded-full shrink-0" style={{ background: s.color }} />
                {s.label}
              </div>
              <div className="h-2 bg-bg-2 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-[width] duration-700 ease-out"
                  style={{ width: `${pct}%`, background: s.color }}
                />
              </div>
              <span className="text-[12px] text-text-hi text-right font-medium">{count}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
