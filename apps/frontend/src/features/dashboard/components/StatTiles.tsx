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
          className={`flex flex-col gap-2 p-5 px-5.5 relative${i < 3 ? ' border-r border-border-soft' : ''}${t.accent ? ' bg-[linear-gradient(180deg,transparent,oklch(0.4_0.1_295/0.08))]' : ''}`}
        >
          {t.accent && (
            <div
              className="absolute top-0 left-0 right-0 h-0.5 bg-[linear-gradient(90deg,transparent,oklch(0.72_0.19_295),transparent)]"
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
