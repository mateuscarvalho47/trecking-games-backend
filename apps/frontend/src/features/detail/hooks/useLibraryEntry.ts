import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { LibraryEntry } from '@/types/api'

export function useLibraryEntry(igdbId: number) {
  const qc = useQueryClient()
  return useQuery<LibraryEntry>({
    queryKey: ['library', igdbId],
    queryFn: async () => {
      const cached = qc.getQueryData<LibraryEntry[]>(['library'])
      const list = cached ?? await api.get<LibraryEntry[]>('/library')
      const entry = list.find(e => e.igdbId === igdbId)
      if (!entry) throw new Error('Jogo não encontrado na biblioteca')
      return entry
    },
    initialData: () => qc.getQueryData<LibraryEntry[]>(['library'])?.find(e => e.igdbId === igdbId),
    initialDataUpdatedAt: () => qc.getQueryState(['library'])?.dataUpdatedAt,
  })
}

export function useUpdateLibraryEntry(id: string, igdbId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<LibraryEntry>) =>
      api.patch<LibraryEntry>(`/library/${id}`, data),
    onSuccess: (updated) => {
      qc.setQueryData(['library', igdbId], updated)
      qc.invalidateQueries({ queryKey: ['library'] })
    },
  })
}

export function useRemoveLibraryEntry(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => api.delete(`/library/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['library'] })
    },
  })
}
