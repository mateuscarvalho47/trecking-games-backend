import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { DonutChart } from './DonutChart'
import { HBars } from './HBars'
import { Histogram } from './Histogram'
import { TimelineChart } from './TimelineChart'
import type { LibraryStats } from '@/types/api'

function Card({ children, title, sub }: { children: React.ReactNode; title?: string; sub?: React.ReactNode }) {
  return (
    <div className="bg-bg-1 border border-border-soft rounded-lg p-5.5">
      {(title || sub) && (
        <div className="flex items-start justify-between gap-4 mb-4.5">
          {title && <div className="text-[14.5px] font-semibold tracking-tight text-text-hi">{title}</div>}
          {sub && <div className="mono-label">{sub}</div>}
        </div>
      )}
      {children}
    </div>
  )
}

export function StatsScreen() {
  const { data: stats, isLoading } = useQuery<LibraryStats>({
    queryKey: ['stats'],
    queryFn: () => api.get('/library/stats'),
  })

  if (isLoading || !stats) {
    return (
      <div className="px-5.5 pt-7">
        <div className="flex flex-col gap-4.5">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-50 bg-bg-1 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="px-5.5 pt-7 pb-15">
      {/* Topbar */}
      <div className="flex items-end justify-between gap-6 pb-5.5 mb-5.5 border-b border-border-soft">
        <div>
          <div className="page-overline">Análise</div>
          <h1 className="text-[28px] font-semibold tracking-tight m-0 text-text-hi">Estatísticas</h1>
          <p className="text-text-md text-[13.5px] mt-1.5 mb-0">Insights da sua biblioteca</p>
        </div>
      </div>

      <div className="flex flex-col gap-4.5">
        {/* Big numbers */}
        <div className="grid grid-cols-4 bg-bg-1 border border-border-soft rounded-lg overflow-hidden">
          {[
            { label: 'Total de jogos', value: stats.totalGames, unit: '' },
            { label: 'Horas registradas', value: Math.round(stats.totalHours), unit: 'h' },
            { label: 'Jogos completos', value: stats.countByStatus.COMPLETED ?? 0, unit: '' },
            { label: 'Na wishlist', value: stats.countByStatus.WISHLIST ?? 0, unit: '' },
          ].map((b, i) => (
            <div
              key={i}
              className="flex flex-col gap-2.5 p-6.5"
              style={{ borderRight: i < 3 ? '1px solid oklch(0.22 0.008 280)' : undefined }}
            >
              <div className="mono-label">{b.label}</div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-[48px] font-bold leading-none text-text-hi" style={{ letterSpacing: '-0.04em' }}>
                  {b.value}
                </span>
                {b.unit && <span className="text-[20px] font-medium text-text-lo font-mono">{b.unit}</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Status donut + genre bars */}
        <div className="grid grid-cols-2 gap-4.5">
          <Card title="Por status"><DonutChart stats={stats} /></Card>
          <Card title="Top gêneros">
            <HBars items={stats.topGenres.map(g => ({ label: g.genre, count: g.count }))} color="oklch(0.72 0.19 295)" />
          </Card>
        </div>

        {/* Platform bars + rating histogram */}
        <div className="grid grid-cols-2 gap-4.5">
          <Card title="Top plataformas">
            <HBars items={stats.topPlatforms.map(p => ({ label: p.platform, count: p.count }))} color="oklch(0.78 0.18 145)" />
          </Card>
          <Card title="Distribuição de avaliações" sub="nota 0–10">
            <Histogram distribution={stats.ratingDistribution} />
          </Card>
        </div>

        {/* Timeline */}
        <Card title="Jogos completados por mês">
          <TimelineChart timeline={stats.completedTimeline} />
        </Card>
      </div>
    </div>
  )
}
