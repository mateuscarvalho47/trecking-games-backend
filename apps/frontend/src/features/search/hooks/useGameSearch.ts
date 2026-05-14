import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { GameSearchResult } from '@/types/api'

export function useGameSearch(query: string) {
  return useQuery<GameSearchResult[]>({
    queryKey: ['search', query],
    queryFn: () => api.get(`/games/search?q=${encodeURIComponent(query)}`),
    enabled: query.trim().length >= 2,
    staleTime: 1000 * 30,
  })
}
