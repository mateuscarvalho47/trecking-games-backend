import type { LibraryStats } from '@/types/api'

interface HistogramProps {
  distribution: LibraryStats['ratingDistribution']
}

export function Histogram({ distribution }: HistogramProps) {
  const maxCount = Math.max(...distribution.map(d => d.count), 1)

  return (
    <div
      className="grid gap-2 h-50 items-end"
      style={{ gridTemplateColumns: 'repeat(11, 1fr)' }}
    >
      {Array.from({ length: 11 }, (_, i) => {
        const entry = distribution.find(d => d.rating === i)
        const count = entry?.count ?? 0
        const heightPct = (count / maxCount) * 100
        const isMode = count === maxCount && count > 0
        return (
          <div key={i} className="flex flex-col gap-1.5 h-full">
            <div className="flex-1 flex items-end justify-center">
              <div
                className="w-full min-h-1 rounded-t-sm flex items-start justify-center pt-1 transition-[height] duration-700 ease-out"
                style={{
                  height: `${heightPct}%`,
                  background: isMode
                    ? 'linear-gradient(180deg, oklch(0.92 0.19 295), oklch(0.72 0.19 295))'
                    : count > 0
                    ? 'oklch(0.5 0.08 295)'
                    : 'oklch(0.22 0.008 280)',
                }}
              >
                {count > 0 && (
                  <span className="text-[10px] text-text-hi font-semibold">{count}</span>
                )}
              </div>
            </div>
            <div className="text-center text-[10.5px] text-text-lo">{i}</div>
          </div>
        )
      })}
    </div>
  )
}
