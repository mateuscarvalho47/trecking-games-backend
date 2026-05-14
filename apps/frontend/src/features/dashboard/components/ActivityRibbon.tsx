import type { LibraryEntry } from '@/types/api'
import { useMemo } from 'react'

interface ActivityRibbonProps {
  library: LibraryEntry[]
}

function getWeekActivity(library: LibraryEntry[], weeks: number): number[] {
  const now = new Date()
  const cells: number[] = new Array(weeks).fill(0)

  for (const entry of library) {
    const updated = new Date(entry.updatedAt)
    const diffDays = Math.floor((now.getTime() - updated.getTime()) / (1000 * 60 * 60 * 24))
    const weekIndex = Math.floor(diffDays / 7)
    if (weekIndex >= 0 && weekIndex < weeks) {
      cells[weeks - 1 - weekIndex] += 1
    }
  }

  return cells
}

function levelFromCount(n: number): 0 | 1 | 2 | 3 {
  if (n === 0) return 0
  if (n === 1) return 1
  if (n <= 3) return 2
  return 3
}

const CELL_COLORS = [
  'oklch(0.22 0.008 280)',
  'oklch(0.4 0.1 295 / 0.4)',
  'oklch(0.55 0.15 295 / 0.7)',
  'oklch(0.72 0.19 295)',
]

export function ActivityRibbon({ library }: ActivityRibbonProps) {
  const WEEKS = 20
  const cells = useMemo(() => getWeekActivity(library, WEEKS), [library])

  return (
    <div className="bg-bg-1 border border-border-soft rounded-lg px-5.5 py-4.5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[14.5px] font-semibold text-text-hi tracking-[-0.01em]">
          Atividade recente
        </span>
        <span className="font-mono text-[10.5px] text-text-lo">{WEEKS} semanas</span>
      </div>

      {/* Grid — dynamic column count stays inline */}
      <div
        className="gap-1 py-1.5"
        style={{ display: 'grid', gridTemplateColumns: `repeat(${WEEKS}, 1fr)` }}
      >
        {cells.map((count, i) => (
          <div
            key={i}
            title={`${count} atualizações`}
            className="aspect-square min-h-4 rounded-[3px] transition-transform cursor-default"
            style={{ background: CELL_COLORS[levelFromCount(count)] }}
          />
        ))}
      </div>

      <div className="flex items-center gap-1.5 mt-2.5 font-mono text-[10px] text-text-lo">
        <span>Menos</span>
        {([0, 1, 2, 3] as const).map(l => (
          <div key={l} className="size-3.5 rounded-[3px]" style={{ background: CELL_COLORS[l] }} />
        ))}
        <span>Mais</span>
      </div>
    </div>
  )
}
