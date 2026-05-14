import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useLogin } from '../hooks/useAuth'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

const labelStyle: React.CSSProperties = {
  fontFamily: "'Geist Mono', monospace",
  fontSize: 10.5, letterSpacing: '0.06em',
  textTransform: 'uppercase', color: 'oklch(0.54 0.012 280)',
  fontWeight: 500,
}

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const login = useLogin()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    await login.mutateAsync({ email, password })
    navigate({ to: '/' })
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3.5">
      <div>
        <span className="font-mono text-[10.5px] tracking-widest uppercase text-accent-bright block mb-2">
          Bem-vindo de volta
        </span>
        <h1 className="text-2xl font-semibold tracking-tight m-0 mb-2 text-text-hi">
          Entrar na conta
        </h1>
        <p className="text-[13px] text-text-md leading-[1.55] mt-0 mb-6 max-w-[36ch]">
          Acesse sua biblioteca de jogos.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label style={labelStyle}>E-mail</Label>
        <Input
          type="email" required value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="seu@email.com"
          className="bg-bg-2 border-border text-text-hi placeholder:text-text-lo h-9.5"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label style={labelStyle}>Senha</Label>
        <Input
          type="password" required value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="••••••••"
          className="bg-bg-2 border-border text-text-hi placeholder:text-text-lo h-9.5"
        />
      </div>

      {login.error && (
        <p className="text-[11.5px] m-0" style={{ color: 'oklch(0.78 0.18 25)' }}>
          {login.error.message}
        </p>
      )}

      <Button variant="accent" type="submit" disabled={login.isPending} className="w-full h-10 rounded-[8px] mt-1.5">
        {login.isPending ? 'Entrando...' : 'Entrar'}
      </Button>

      <p className="text-center text-[12.5px] text-text-lo mt-1">
        Não tem conta?{' '}
        <a href="/register" className="text-accent-bright font-semibold no-underline">
          Criar conta
        </a>
      </p>
    </form>
  )
}
