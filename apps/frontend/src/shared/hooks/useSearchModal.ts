import { useAppStore } from '@/store/useAppStore'

export function useSearchModal() {
  const open = useAppStore((s) => s.searchOpen)
  const setOpen = useAppStore((s) => s.setSearchOpen)
  return { open, setOpen }
}
