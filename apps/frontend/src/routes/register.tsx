import { createFileRoute } from '@tanstack/react-router'
import { AuthShell } from '@/features/auth/components/AuthShell'

export const Route = createFileRoute('/register')({
  component: RegisterPage,
})

function RegisterPage() {
  return <AuthShell mode="register" />
}
