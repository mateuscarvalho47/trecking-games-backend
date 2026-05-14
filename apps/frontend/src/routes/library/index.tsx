import { createFileRoute } from '@tanstack/react-router'
import { LibraryScreen } from '@/features/library/components/LibraryScreen'

export const Route = createFileRoute('/library/')({
  component: LibraryScreen,
})
