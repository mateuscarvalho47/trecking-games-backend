import { useState } from 'react'
import { LayoutGrid, List, Search, BookMarked } from 'lucide-react'
import { useLibrary } from '../hooks/useLibrary'
import { useLibraryFilters } from '../hooks/useLibraryFilters'
import { StatusPills } from './StatusPills'
import { LibraryGrid } from './LibraryGrid'
import { LibraryList } from './LibraryList'
import { EmptyState } from '@/shared/components/EmptyState'
import { useSearchModal } from '@/shared/hooks/useSearchModal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: 'createdAt', label: 'Data de adição' },
  { value: 'name', label: 'Nome' },
  { value: 'rating', label: 'Avaliação' },
  { value: 'hoursPlayed', label: 'Horas jogadas' },
]

export function LibraryScreen() {
  const { data: library = [], isLoading } = useLibrary()
  const filters = useLibraryFilters(library)
  const { setOpen } = useSearchModal()
  const [sortMenuOpen, setSortMenuOpen] = useState(false)

  const currentSortLabel = SORT_OPTIONS.find(o => o.value === filters.sort)?.label ?? 'Ordenar'

  if (isLoading) {
    return (
      <div className="px-5.5 pt-7">
        <div className="grid gap-4.5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-3/4 bg-bg-1 rounded-sm animate-pulse" />
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
          <div className="page-overline">Coleção</div>
          <h1 className="text-[28px] font-semibold tracking-tight m-0 text-text-hi">Biblioteca</h1>
          <p className="text-text-md text-[13.5px] mt-1.5 mb-0">
            {library.length} jogo{library.length !== 1 ? 's' : ''} na coleção
          </p>
        </div>
        <Button variant="accent" size="sm" onClick={() => setOpen(true)} className="rounded-[8px]">
          + Adicionar jogo
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 mb-4.5">
        <div className="overflow-x-auto -mx-5.5 px-5.5">
          <div className="flex min-w-max">
            <StatusPills library={library} active={filters.statusFilter} onChange={filters.setStatusFilter} />
          </div>
        </div>

        <div className="flex gap-2 items-center">
          {/* Search */}
          <div className="relative flex items-center gap-2 h-9 px-3 bg-bg-2 border border-border rounded-[8px] flex-1 sm:w-55 sm:flex-none text-text-lo">
            <Search size={13} className="shrink-0" />
            <Input
              value={filters.search}
              onChange={e => filters.setSearch(e.target.value)}
              placeholder="Filtrar..."
              className="flex-1 h-full p-0 min-w-0 bg-transparent border-0 shadow-none text-text-hi text-[13px] placeholder:text-text-lo focus-visible:ring-0"
            />
          </div>

          {/* Sort */}
          <div className="relative">
            <button
              onClick={() => setSortMenuOpen(o => !o)}
              className="inline-flex items-center gap-1.5 h-8 px-2.5 bg-bg-2 border border-border rounded-[7px] text-text-md cursor-pointer text-[12.5px] font-medium"
              style={{ fontFamily: 'inherit' }}
            >
              {currentSortLabel} ↕
            </button>
            {sortMenuOpen && (
              <div
                className="absolute right-0 top-[calc(100%+4px)] bg-bg-2 border border-border rounded-[8px] p-1 min-w-40 z-10"
                style={{ boxShadow: '0 6px 24px oklch(0 0 0 / 0.4)' }}
              >
                {SORT_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => { filters.setSort(opt.value as typeof filters.sort); setSortMenuOpen(false) }}
                    className="flex items-center justify-between w-full px-2.5 py-1.5 bg-transparent border-0 text-[12.5px] cursor-pointer rounded-[5px] text-left"
                    style={{
                      color: filters.sort === opt.value ? 'oklch(0.92 0.19 295)' : 'oklch(0.72 0.010 280)',
                      fontFamily: 'inherit',
                    }}
                  >
                    {opt.label}
                    {filters.sort === opt.value && <span>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* View toggle */}
          <div className="flex p-0.5 bg-bg-2 border border-border rounded-[8px]">
            {(['grid', 'list'] as const).map(v => (
              <button
                key={v}
                onClick={() => filters.setView(v)}
                className={cn(
                  'flex items-center justify-center size-7.5 rounded-[5px] cursor-pointer border-0 transition-all',
                  filters.view === v ? 'bg-bg-3 text-text-hi' : 'bg-transparent text-text-lo',
                )}
                style={{ fontFamily: 'inherit' }}
              >
                {v === 'grid' ? <LayoutGrid size={14} /> : <List size={14} />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      {filters.filtered.length === 0 ? (
        <EmptyState
          icon={<BookMarked size={28} />}
          title="Biblioteca vazia"
          body="Adicione seu primeiro jogo usando o botão acima ou pressione ⌘K."
          action={
            <Button variant="accent" size="sm" onClick={() => setOpen(true)} className="rounded-[8px]">
              Buscar jogo
            </Button>
          }
        />
      ) : filters.view === 'grid' ? (
        <LibraryGrid games={filters.filtered} />
      ) : (
        <LibraryList games={filters.filtered} />
      )}
    </div>
  )
}
