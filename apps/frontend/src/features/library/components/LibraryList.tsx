import { useNavigate } from '@tanstack/react-router'
import type { LibraryEntry } from '@/types/api'
import { Cover } from '@/shared/components/Cover'
import { StatusBadge } from '@/shared/components/StatusBadge'

interface LibraryListProps {
  games: LibraryEntry[]
}

const COLS = ['Jogo', 'Status', 'Plataforma', 'Avaliação', 'Horas', 'Adicionado']
const GRID = '48px 2.2fr 1.1fr 1fr 0.9fr 0.7fr'

export function LibraryList({ games }: LibraryListProps) {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col bg-bg-1 border border-border-soft rounded-lg overflow-hidden">
      {/* Header */}
      <div
        className="grid gap-3.5 items-center px-4 py-3 font-mono text-[10.5px] uppercase tracking-[0.06em] text-text-lo border-b border-border-soft bg-bg-2"
        style={{ gridTemplateColumns: GRID }}
      >
        <div />
        {COLS.map(c => <div key={c}>{c}</div>)}
      </div>

      {/* Rows */}
      {games.map((game, idx) => (
        <button
          key={game.igdbId}
          onClick={() => navigate({ to: '/library/$igdbId', params: { igdbId: String(game.igdbId) } })}
          className="grid gap-3.5 items-center px-4 py-2.5 bg-transparent border-0 cursor-pointer text-left text-[13px] transition-[background] w-full hover:bg-bg-2"
          style={{
            gridTemplateColumns: GRID,
            borderBottom: idx < games.length - 1 ? '1px solid oklch(0.22 0.008 280)' : undefined,
            fontFamily: 'inherit',
          }}
        >
          <div className="w-9 h-12 rounded-[3px] overflow-hidden">
            <Cover
              game={{
                name: game.name,
                platforms: game.platforms,
                cover: { hue: 280, scheme: 'duotone', glyph: game.name[0] },
                coverUrl: game.coverUrl,
              }}
              size="xs"
              withTitle={false}
            />
          </div>
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-text-hi font-medium truncate">{game.name}</span>
            {game.genres.length > 0 && (
              <span className="text-[11px] font-mono text-text-lo truncate">
                {game.genres.slice(0, 2).join(' · ')}
              </span>
            )}
          </div>
          <div><StatusBadge status={game.status} size="sm" /></div>
          <div className="text-text-md text-[12px]">
            {game.userPlatform ?? game.platforms[0] ?? '—'}
          </div>
          <div className="font-mono font-semibold text-text-hi">
            {game.rating != null ? (
              <>{game.rating}<span className="text-[10px] text-text-lo">/10</span></>
            ) : (
              <span className="text-text-dim">—</span>
            )}
          </div>
          <div className="font-mono text-text-md text-[12px]">
            {game.hoursPlayed != null ? `${game.hoursPlayed}h` : '—'}
          </div>
        </button>
      ))}
    </div>
  )
}
