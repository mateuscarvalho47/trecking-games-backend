import { useState, useEffect, useRef } from 'react'
import { Search } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { useGameSearch } from '../hooks/useGameSearch'
import { useLibrary } from '@/features/library/hooks/useLibrary'
import { AddToLibraryModal } from './AddToLibraryModal'
import { Cover } from '@/shared/components/Cover'
import type { GameSearchResult } from '@/types/api'

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

interface SearchModalProps {
  open: boolean
  onClose: () => void
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [addGame, setAddGame] = useState<GameSearchResult | null>(null)
  const debouncedQuery = useDebounce(query, 300)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const { data: library = [] } = useLibrary()
  const { data: results = [], isFetching } = useGameSearch(debouncedQuery)

  useEffect(() => {
    if (open) {
      setQuery('')
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !addGame) onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, addGame, onClose])

  if (!open) return null

  const inLibrary = (igdbId: number) => library.some(g => g.igdbId === igdbId)

  const handleSelect = (game: GameSearchResult) => {
    if (inLibrary(game.igdbId)) {
      onClose()
      navigate({ to: '/library/$igdbId', params: { igdbId: String(game.igdbId) } })
    } else {
      setAddGame(game)
    }
  }

  return (
    <>
      <div
        className="fixed inset-0 z-1000 flex items-start justify-center px-4 pt-5 sm:pt-20"
        style={{
          display: addGame ? 'none' : undefined,
          background: 'oklch(0 0 0 / 0.6)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          animation: 'scrimIn 0.18s ease-out',
        }}
        onClick={onClose}
      >
        <style>{`
          @keyframes scrimIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes modalIn {
            from { opacity: 0; transform: translateY(-12px) scale(0.98); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}</style>

        <div
          className="w-full max-w-160 rounded-xl border border-border overflow-hidden bg-bg-1"
          style={{
            boxShadow: '0 1px 0 oklch(1 0 0 / 0.06) inset, 0 24px 60px oklch(0 0 0 / 0.55)',
            animation: 'modalIn 0.2s ease-out',
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center gap-2.5 px-4.5 py-3.5 text-text-md border-b border-border-soft">
            <Search size={16} className="shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Buscar jogos..."
              className="flex-1 h-7 bg-transparent border-0 outline-none text-text-hi text-[15.5px]"
              style={{ fontFamily: 'inherit' }}
            />
            <kbd
              className="font-mono text-[10px] font-medium h-4 px-1 text-text-md bg-bg-2 border border-border rounded-[4px] inline-flex items-center"
              style={{ boxShadow: '0 1px 0 oklch(0 0 0 / 0.5)' }}
            >
              Esc
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-90 overflow-y-auto p-1.5">
            {query.trim().length < 2 ? (
              <div className="py-10 px-5 text-center text-text-lo text-[13px]">
                Digite pelo menos 2 caracteres para buscar
              </div>
            ) : isFetching ? (
              <div className="py-10 px-5 text-center text-text-lo text-[13px]">Buscando...</div>
            ) : results.length === 0 ? (
              <div className="py-10 px-5 text-center text-text-lo text-[13px]">
                Nenhum resultado para "{query}"
              </div>
            ) : (
              <>
                <div className="font-mono text-[10.5px] tracking-[0.08em] uppercase text-text-dim px-3 pt-2.5 pb-1.5">
                  {results.length} resultado{results.length !== 1 ? 's' : ''}
                </div>
                {results.map(game => {
                  const owned = inLibrary(game.igdbId)
                  return (
                    <button
                      key={game.igdbId}
                      onClick={() => handleSelect(game)}
                      className="grid gap-3 items-center w-full px-3 py-2.5 bg-transparent border-0 rounded-[8px] cursor-pointer text-left transition-[background] hover:bg-bg-2"
                      style={{ gridTemplateColumns: '36px 1fr auto', fontFamily: 'inherit' }}
                    >
                      <div className="w-9 h-12 rounded-[4px] overflow-hidden">
                        <Cover
                          game={{
                            name: game.name,
                            year: game.releaseYear,
                            platforms: game.platforms,
                            cover: { hue: 295, scheme: 'duotone', glyph: game.name[0] },
                            coverUrl: game.coverUrl,
                          }}
                          size="xs"
                          withTitle={false}
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[13.5px] font-medium text-text-hi truncate">{game.name}</div>
                        <div className="text-[11.5px] font-mono text-text-lo mt-0.5">
                          {game.releaseYear ?? 'TBA'}{game.platforms.length ? ' · ' + game.platforms.slice(0, 2).join(', ') : ''}
                        </div>
                      </div>
                      <div className="text-[11.5px] font-mono">
                        {owned ? (
                          <span style={{ color: 'oklch(0.78 0.18 145)' }}>✓ Na biblioteca</span>
                        ) : (
                          <span className="text-text-lo">+ Adicionar</span>
                        )}
                      </div>
                    </button>
                  )
                })}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center gap-4 px-4 py-2.5 border-t border-border-soft font-mono text-[11px] text-text-lo bg-bg-2">
            <span>↵ selecionar</span>
            <span>Esc fechar</span>
          </div>
        </div>
      </div>

      {addGame && (
        <AddToLibraryModal
          game={addGame}
          onClose={() => setAddGame(null)}
          onAdded={(id) => {
            setAddGame(null)
            onClose()
            navigate({ to: '/library/$igdbId', params: { igdbId: String(id) } })
          }}
        />
      )}
    </>
  )
}
