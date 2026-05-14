import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { LibraryEntry } from '@/types/api'

export function useLibrary() {
  return useQuery<LibraryEntry[]>({
    queryKey: ['library'],
    queryFn: () => api.get('/library'),
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
