import { useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { LibraryEntry, LibraryStats, GameStatus } from '@/types/api'
import { StatTiles } from './StatTiles'
import { ActivityRibbon } from './ActivityRibbon'
import { PlayingList } from './PlayingList'
import { BacklogList } from './BacklogList'
import { RecentList } from './RecentList'
import { StatusBarsCard } from './StatusBarsCard'
import { useSearchModal } from '@/shared/hooks/useSearchModal'
import { Button } from '@/components/ui/button'

function computeStats(library: LibraryEntry[]): LibraryStats {
  const countByStatus = {} as Record<GameStatus, number>
  for (const s of ['WISHLIST', 'BACKLOG', 'PLAYING', 'PAUSED', 'COMPLETED', 'DROPPED'] as GameStatus[]) {
    countByStatus[s] = library.filter(g => g.status === s).length
  }

  const genreMap = new Map<string, number>()
  const platformMap = new Map<string, number>()
  const ratingMap = new Map<number, number>()
  const timelineMap = new Map<string, number>()

  let totalHours = 0
  for (const g of library) {
    if (g.hoursPlayed) totalHours += g.hoursPlayed
    for (const genre of g.genres) genreMap.set(genre, (genreMap.get(genre) ?? 0) + 1)
    const plat = g.userPlatform ?? g.platforms[0]
    if (plat) platformMap.set(plat, (platformMap.get(plat) ?? 0) + 1)
    if (g.rating != null) {
      const r = Math.round(g.rating)
      ratingMap.set(r, (ratingMap.get(r) ?? 0) + 1)
    }
    if (g.completedAt) {
      const month = g.completedAt.slice(0, 7)
      timelineMap.set(month, (timelineMap.get(month) ?? 0) + 1)
    }
  }

  return {
    totalGames: library.length,
    totalHours,
    countByStatus,
    topGenres: [...genreMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([genre, count]) => ({ genre, count })),
    topPlatforms: [...platformMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([platform, count]) => ({ platform, count })),
    ratingDistribution: [...ratingMap.entries()].sort((a, b) => a[0] - b[0]).map(([rating, count]) => ({ rating, count })),
    completedTimeline: [...timelineMap.entries()].sort().map(([month, count]) => ({ month, count })),
  }
}

export function DashboardScreen() {
  const navigate = useNavigate()
  const { setOpen } = useSearchModal()

  const { data: library = [], isLoading } = useQuery<LibraryEntry[]>({
    queryKey: ['library'],
    queryFn: () => api.get('/library'),
  })

  const stats = useMemo(() => computeStats(library), [library])

  const playing = library.filter(g => g.status === 'PLAYING')
  const backlog = library.filter(g => g.status === 'BACKLOG')
  const recent = library.filter(g => g.status === 'COMPLETED').sort(
    (a, b) => (b.completedAt ?? '').localeCompare(a.completedAt ?? '')
  )

  if (isLoading) {
    return (
      <div className="px-5.5 pt-7">
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-bg-1 rounded-lg animate-pulse" />
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
          <div className="page-overline">Início</div>
          <h1 className="text-[28px] font-semibold tracking-tight m-0 text-text-hi">Dashboard</h1>
          <p className="text-text-md text-[13.5px] mt-1.5 mb-0">Visão geral da sua biblioteca</p>
        </div>
        <Button variant="accent" size="sm" onClick={() => setOpen(true)} className="rounded-[8px]">
          + Adicionar jogo
        </Button>
      </div>

      {/* Grid */}
      <div className="flex flex-col gap-4.5">
        <StatTiles stats={stats} />
        <ActivityRibbon library={library} />
        <div className="grid grid-cols-2 gap-4.5">
          <PlayingList games={playing} />
          <BacklogList games={backlog} />
        </div>
        <div className="grid gap-4.5" style={{ gridTemplateColumns: '7fr 5fr' }}>
          <RecentList games={recent} />
          <StatusBarsCard stats={stats} />
        </div>
      </div>
    </div>
  )
}

export { computeStats }
