import type { LibraryStats } from '@/types/api'

interface StatTilesProps {
  stats: LibraryStats
}

export function StatTiles({ stats }: StatTilesProps) {
  const tiles = [
    { label: 'Total de jogos', value: stats.totalGames, unit: '', sub: 'na biblioteca', accent: true },
    { label: 'Horas registradas', value: Math.round(stats.totalHours), unit: 'h', sub: 'tempo total' },
    { label: 'Completos', value: stats.countByStatus.COMPLETED ?? 0, unit: '', sub: 'jogos finalizados' },
    { label: 'Jogando agora', value: stats.countByStatus.PLAYING ?? 0, unit: '', sub: 'em andamento' },
  ]

  return (
    <div className="grid grid-cols-4 bg-bg-1 border border-border-soft rounded-lg overflow-hidden">
      {tiles.map((t, i) => (
        <div
          key={i}
          className="flex flex-col gap-2 p-5 px-5.5 relative"
          style={{
            borderRight: i < 3 ? '1px solid oklch(0.22 0.008 280)' : undefined,
            background: t.accent ? 'linear-gradient(180deg, transparent, oklch(0.4 0.1 295 / 0.08))' : undefined,
          }}
        >
          {t.accent && (
            <div
              className="absolute top-0 left-0 right-0 h-0.5"
              style={{ background: 'linear-gradient(90deg, transparent, oklch(0.72 0.19 295), transparent)' }}
            />
          )}
          <div className="mono-label">{t.label}</div>
          <div className="flex items-baseline gap-1">
            <span className="text-[32px] font-bold tracking-[-0.03em] text-text-hi">{t.value}</span>
            {t.unit && (
              <span className="text-[16px] font-medium text-text-lo font-mono">{t.unit}</span>
            )}
          </div>
          <div className="text-[11.5px] text-text-md font-mono">{t.sub}</div>
        </div>
      ))}
    </div>
  )
}
