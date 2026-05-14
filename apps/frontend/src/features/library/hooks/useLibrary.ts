import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { LibraryEntry } from '@/types/api'

export function useLibrary(opts?: { enabled?: boolean }) {
  return useQuery<LibraryEntry[]>({
    queryKey: ['library'],
    queryFn: () => api.get('/library'),
    enabled: opts?.enabled,
  })
}

export function useAddToLibrary() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: {
      igdbId: number
      status: string
      userPlatform?: string
    }) => api.post<LibraryEntry>('/library', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['library'] })
    },
  })
}
