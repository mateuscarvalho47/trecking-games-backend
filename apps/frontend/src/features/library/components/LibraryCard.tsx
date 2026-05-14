import { useNavigate } from '@tanstack/react-router'
import type { LibraryEntry } from '@/types/api'
import { Cover } from '@/shared/components/Cover'
import { StatusBadge } from '@/shared/components/StatusBadge'
import { STATUS_BY_KEY } from '@/shared/constants/statuses'

interface LibraryCardProps {
  game: LibraryEntry
}

const getCoverData = (game: LibraryEntry) => ({
  hue: STATUS_BY_KEY[game.status]?.hue ?? 280,
  scheme: 'duotone' as const,
  glyph: game.name[0],
})

export function LibraryCard({ game }: LibraryCardProps) {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate({ to: '/library/$igdbId', params: { igdbId: String(game.igdbId) } })}
      className="flex flex-col gap-2.5 bg-transparent border-0 p-0 cursor-pointer text-left"
      style={{ fontFamily: 'inherit' }}
    >
      <div className="relative aspect-3/4 rounded-sm overflow-hidden">
        <Cover
          game={{
            name: game.name,
            platforms: game.platforms,
            cover: getCoverData(game),
            coverUrl: game.coverUrl,
          }}
          size="md"
          hover
        />
        <div className="absolute top-2 left-2 right-2 flex justify-end items-start pointer-events-none">
          <StatusBadge status={game.status} size="sm" />
        </div>
      </div>
      <div className="flex flex-col gap-1 px-0.5">
        <span className="text-[13.5px] font-medium text-text-hi leading-[1.3] line-clamp-2">
          {game.name}
        </span>
        <div className="flex items-center justify-between">
          <span className="text-[11.5px] text-text-md">
            {game.userPlatform ?? game.platforms[0] ?? '—'}
          </span>
          {game.rating != null && (
            <span className="font-mono text-[12px] font-semibold text-text-hi">
              {game.rating}<span className="text-[9px] text-text-lo">/10</span>
            </span>
          )}
        </div>
        {game.hoursPlayed != null && (
          <span className="text-[11px] text-text-lo">{game.hoursPlayed}h jogadas</span>
        )}
      </div>
    </button>
  )
}
