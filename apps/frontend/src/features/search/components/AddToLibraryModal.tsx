import { useState } from 'react'
import type { GameSearchResult, GameStatus } from '@/types/api'
import { STATUSES } from '@/shared/constants/statuses'
import { Cover } from '@/shared/components/Cover'
import { useAddToLibrary } from '@/features/library/hooks/useLibrary'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface AddToLibraryModalProps {
  game: GameSearchResult
  onClose: () => void
  onAdded: (igdbId: number) => void
}

export function AddToLibraryModal({ game, onClose, onAdded }: AddToLibraryModalProps) {
  const [status, setStatus] = useState<GameStatus>('BACKLOG')
  const [platform, setPlatform] = useState(game.platforms[0] ?? '')
  const addMutation = useAddToLibrary()

  const confirm = async () => {
    await addMutation.mutateAsync({ igdbId: game.igdbId, status, userPlatform: platform })
    onAdded(game.igdbId)
  }

  return (
    <Dialog open onOpenChange={open => { if (!open) onClose() }}>
      <DialogContent
        className="p-0 overflow-hidden gap-0 max-w-180 bg-bg-1 border border-border rounded-xl"
        style={{ boxShadow: '0 1px 0 oklch(1 0 0 / 0.06) inset, 0 24px 60px oklch(0 0 0 / 0.55)' }}
      >
        <DialogHeader className="px-4.5 py-3.5 border-b border-border-soft">
          <DialogTitle className="text-[14px] text-text-hi">
            Adicionar à biblioteca
          </DialogTitle>
        </DialogHeader>

        <div
          className="grid gap-7 p-6"
          style={{ gridTemplateColumns: '200px 1fr' }}
        >
          {/* Cover */}
          <div className="aspect-3/4 rounded-md overflow-hidden">
            <Cover
              game={{
                name: game.name,
                year: game.releaseYear,
                platforms: game.platforms,
                cover: { hue: 295, scheme: 'duotone', glyph: game.name[0] },
                coverUrl: game.coverUrl,
              }}
              size="lg"
            />
          </div>

          {/* Form */}
          <div className="flex flex-col gap-4">
            <div>
              <div className="mono-label text-accent-bright">
                {game.genres.slice(0, 2).join(' · ')}
              </div>
              <h2 className="text-[22px] font-semibold tracking-tight mt-1 mb-0 text-text-hi">
                {game.name}
              </h2>
              <div className="text-[12.5px] text-text-md font-mono mt-0.5">
                {game.releaseYear ?? 'TBA'} · {game.platforms.slice(0, 3).join(', ')}
              </div>
            </div>

            {/* Status picker */}
            <div>
              <Label className="mono-label block mb-2">Status</Label>
              <div className="grid grid-cols-3 gap-1.5">
                {STATUSES.map(s => (
                  <button
                    key={s.key}
                    onClick={() => setStatus(s.key)}
                    className="flex items-center gap-2 h-8 px-2.5 rounded-[7px] cursor-pointer text-[12px] font-medium border-0"
                    style={{
                      background: status === s.key ? `oklch(0.3 0.06 ${s.hue} / 0.35)` : 'oklch(0.19 0.008 280)',
                      border: `1px solid ${status === s.key ? `oklch(0.6 0.15 ${s.hue} / 0.5)` : 'oklch(0.22 0.008 280)'}`,
                      color: status === s.key ? `oklch(0.92 0.05 ${s.hue})` : 'oklch(0.72 0.010 280)',
                      fontFamily: 'inherit',
                    }}
                  >
                    <div className="size-1.5 rounded-full shrink-0" style={{ background: s.color }} />
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Platform */}
            <div>
              <Label className="mono-label block mb-1.5">Plataforma</Label>
              <Input
                value={platform}
                onChange={e => setPlatform(e.target.value)}
                placeholder="ex: PC, PS5, Switch..."
                list="platforms-list"
                className="bg-bg-2 border-border text-text-hi placeholder:text-text-lo h-9.5"
              />
              <datalist id="platforms-list">
                {game.platforms.map(p => <option key={p} value={p} />)}
              </datalist>
            </div>

            <div className="flex gap-2.5 justify-end mt-2">
              <Button
                variant="ghost"
                onClick={onClose}
                className="h-9 border border-border text-text-md rounded-[8px]"
              >
                Cancelar
              </Button>
              <Button
                variant="accent"
                onClick={confirm}
                disabled={addMutation.isPending}
                className="h-9 rounded-[8px]"
              >
                {addMutation.isPending ? 'Adicionando...' : 'Adicionar'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
