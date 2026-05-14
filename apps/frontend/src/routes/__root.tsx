import { createRootRouteWithContext, Outlet, useNavigate, useLocation } from '@tanstack/react-router'
import { useEffect } from 'react'
import type { QueryClient } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import { Sidebar } from '@/shared/components/Sidebar'
import { SearchModal } from '@/features/search/components/SearchModal'
import { useMe } from '@/features/auth/hooks/useAuth'
import { api } from '@/lib/api'
import type { LibraryEntry } from '@/types/api'
import { useAppStore } from '@/store/useAppStore'

const PUBLIC_ROUTES = ['/', '/login', '/register']

interface RouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
})

function RootLayout() {
  const { searchOpen, setSearchOpen } = useAppStore()
  const { data: me, isLoading } = useMe()
  const navigate = useNavigate()
  const location = useLocation()
  const { data: library = [] } = useQuery<LibraryEntry[]>({
    queryKey: ['library'],
    queryFn: () => api.get('/library'),
    enabled: !!me,
  })

  useEffect(() => {
    if (!isLoading && !me && !PUBLIC_ROUTES.includes(location.pathname)) {
      navigate({ to: '/' })
    }
  }, [me, isLoading, location.pathname, navigate])

  // Cmd/Ctrl+K global handler
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setSearchOpen])

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'oklch(0.13 0.005 280)',
      }}>
        <span style={{ color: 'oklch(0.54 0.012 280)', fontFamily: "'Geist Mono', monospace", fontSize: 12 }}>
          carregando...
        </span>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'oklch(0.13 0.005 280)', color: 'oklch(0.96 0.005 280)' }}>
      {me ? (
        <div style={{ display: 'grid', gridTemplateColumns: '232px 1fr', minHeight: '100vh' }}>
          <Sidebar libraryCount={library.length} />
          <main style={{ minWidth: 0, paddingBottom: 60 }}>
            <Outlet />
          </main>
        </div>
      ) : (
        <Outlet />
      )}
      {me && (
        <SearchModal
          open={searchOpen}
          onClose={() => setSearchOpen(false)}
        />
      )}
    </div>
  )
}
