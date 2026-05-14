import { useNavigate } from '@tanstack/react-router'
import type { LibraryEntry } from '@/types/api'
import { Cover } from '@/shared/components/Cover'

interface BacklogListProps {
  games: LibraryEntry[]
}

export function BacklogList({ games }: BacklogListProps) {
  const navigate = useNavigate()
  const shown = games.slice(0, 5)

  return (
    <div className="bg-bg-1 border border-border-soft rounded-lg px-5.5 py-4.5">
      <div className="flex items-start justify-between mb-3.5">
        <div>
          <div className="text-[14.5px] font-semibold text-text-hi tracking-[-0.01em]">Próximos na fila</div>
          <div className="font-mono text-[11.5px] text-text-lo mt-0.5">{games.length} na fila</div>
        </div>
        {games.length > 5 && (
          <button
            onClick={() => navigate({ to: '/library' })}
            className="inline-flex items-center gap-1 bg-transparent border-0 text-text-md text-[11.5px] font-mono cursor-pointer px-1.5 py-1"
          >
            Ver todos →
          </button>
        )}
      </div>

      {shown.length === 0 ? (
        <div className="py-6 text-center text-text-lo text-[13px]">Fila vazia</div>
      ) : (
        <div className="flex flex-col">
          {shown.map((game, idx) => (
            <button
              key={game.igdbId}
              onClick={() => navigate({ to: '/library/$igdbId', params: { igdbId: String(game.igdbId) } })}
              className="grid gap-3 items-center px-2 py-2.5 bg-transparent border-0 cursor-pointer text-left w-full transition-[background] hover:bg-bg-2"
              style={{
                gridTemplateColumns: '32px 36px 1fr 14px',
                borderBottom: idx < shown.length - 1 ? '1px solid oklch(0.22 0.008 280)' : undefined,
                fontFamily: 'inherit',
              }}
            >
              <span className="text-[11px] text-text-dim font-medium">#{idx + 1}</span>
              <div className="w-9 h-12 rounded-[4px] overflow-hidden">
                <Cover
                  game={{
                    name: game.name,
                    platforms: game.platforms,
                    cover: { hue: 260, scheme: 'duotone', glyph: game.name[0] },
                    coverUrl: game.coverUrl,
                  }}
                  size="xs"
                  withTitle={false}
                />
              </div>
              <div>
                <div className="text-[13px] font-medium text-text-hi">{game.name}</div>
                <div className="text-[11.5px] font-mono text-text-lo mt-0.5">
                  {game.userPlatform ?? game.platforms[0] ?? '—'}
                </div>
              </div>
              <span className="text-text-dim text-[12px]">›</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
