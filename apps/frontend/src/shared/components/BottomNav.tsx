import { useNavigate, useRouterState } from '@tanstack/react-router'
import { Home, BookMarked, BarChart3, Search } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'

const NAV_ITEMS = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/library', label: 'Biblioteca', icon: BookMarked },
  { to: '/stats', label: 'Estatísticas', icon: BarChart3 },
] as const

export function BottomNav({ libraryCount: _libraryCount }: { libraryCount?: number }) {
  const navigate = useNavigate()
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname
  const setSearchOpen = useAppStore((s) => s.setSearchOpen)

  const isActive = (to: string) =>
    to === '/' ? currentPath === '/' : currentPath.startsWith(to)

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-border-soft"
      style={{ background: 'oklch(0.16 0.006 280)', height: 56 }}
    >
      {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
        const active = isActive(to)
        return (
          <button
            key={to}
            onClick={() => navigate({ to })}
            className="flex flex-col items-center gap-1 flex-1 py-2 border-0 bg-transparent cursor-pointer"
            style={{
              color: active ? 'oklch(0.92 0.19 295)' : 'oklch(0.54 0.012 280)',
              fontFamily: 'inherit',
            }}
          >
            <Icon size={20} />
            <span style={{ fontSize: 10 }}>{label}</span>
          </button>
        )
      })}
      <button
        onClick={() => setSearchOpen(true)}
        className="flex flex-col items-center gap-1 flex-1 py-2 border-0 bg-transparent cursor-pointer"
        style={{ color: 'oklch(0.54 0.012 280)', fontFamily: 'inherit' }}
      >
        <Search size={20} />
        <span style={{ fontSize: 10 }}>Buscar</span>
      </button>
    </nav>
  )
}
