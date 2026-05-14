import type { LibraryStats } from '@/types/api'
import { STATUSES } from '@/shared/constants/statuses'

interface DonutChartProps {
  stats: LibraryStats
}

export function DonutChart({ stats }: DonutChartProps) {
  const total = stats.totalGames || 1
  const r = 80
  const cx = 110
  const cy = 110
  const circumference = 2 * Math.PI * r

  let offset = 0
  const segments = STATUSES.map(s => {
    const count = stats.countByStatus[s.key] ?? 0
    const pct = count / total
    const dash = pct * circumference
    const gap = circumference - dash
    const seg = { key: s.key, label: s.label, count, color: s.color, dash, gap, offset }
    offset += dash
    return seg
  }).filter(s => s.count > 0)

  return (
    <div className="grid gap-7 items-center" style={{ gridTemplateColumns: '220px 1fr' }}>
      <div className="relative size-[220px]">
        <svg width="220" height="220" viewBox="0 0 220 220">
          {segments.map(seg => (
            <circle
              key={seg.key}
              cx={cx} cy={cy} r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth={20}
              strokeDasharray={`${seg.dash} ${seg.gap}`}
              strokeDashoffset={-seg.offset}
              transform={`rotate(-90 ${cx} ${cy})`}
              style={{ transition: 'stroke-dasharray 0.6s ease-out' }}
            />
          ))}
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="oklch(0.2 0.008 280)" strokeWidth={20} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[36px] font-bold tracking-tight text-text-hi leading-none">
            {stats.totalGames}
          </span>
          <span className="mono-label mt-1">jogos</span>
        </div>
      </div>

      <ul className="list-none m-0 p-0 flex flex-col gap-2">
        {STATUSES.map(s => {
          const count = stats.countByStatus[s.key] ?? 0
          const pct = (count / total) * 100
          return (
            <li
              key={s.key}
              className="grid gap-2.5 items-center text-[12.5px]"
              style={{ gridTemplateColumns: '12px 80px 1fr 28px' }}
            >
              <div className="size-2.5 rounded-full" style={{ background: s.color }} />
              <span className="text-text-md">{s.label}</span>
              <div className="h-1.5 bg-bg-2 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-[width] duration-700 ease-out"
                  style={{ width: `${pct}%`, background: s.color }}
                />
              </div>
              <span className="text-text-hi text-right">{count}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
