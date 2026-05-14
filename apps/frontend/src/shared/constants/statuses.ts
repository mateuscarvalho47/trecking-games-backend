import type { GameStatus } from '@/types/api'

export interface StatusDef {
  key: GameStatus
  label: string
  hue: number
  color: string
  bgColor: string
  borderColor: string
}

export const STATUSES: StatusDef[] = [
  {
    key: 'WISHLIST',
    label: 'Wishlist',
    hue: 75,
    color: 'oklch(0.88 0.18 75)',
    bgColor: 'oklch(0.3 0.08 75 / 0.3)',
    borderColor: 'oklch(0.5 0.15 75 / 0.5)',
  },
  {
    key: 'BACKLOG',
    label: 'Fila',
    hue: 260,
    color: 'oklch(0.88 0.18 260)',
    bgColor: 'oklch(0.3 0.08 260 / 0.3)',
    borderColor: 'oklch(0.5 0.15 260 / 0.5)',
  },
  {
    key: 'PLAYING',
    label: 'Jogando',
    hue: 295,
    color: 'oklch(0.88 0.18 295)',
    bgColor: 'oklch(0.3 0.08 295 / 0.3)',
    borderColor: 'oklch(0.5 0.15 295 / 0.5)',
  },
  {
    key: 'PAUSED',
    label: 'Pausado',
    hue: 200,
    color: 'oklch(0.88 0.18 200)',
    bgColor: 'oklch(0.3 0.08 200 / 0.3)',
    borderColor: 'oklch(0.5 0.15 200 / 0.5)',
  },
  {
    key: 'COMPLETED',
    label: 'Completo',
    hue: 145,
    color: 'oklch(0.88 0.18 145)',
    bgColor: 'oklch(0.3 0.08 145 / 0.3)',
    borderColor: 'oklch(0.5 0.15 145 / 0.5)',
  },
  {
    key: 'DROPPED',
    label: 'Abandonado',
    hue: 25,
    color: 'oklch(0.88 0.18 25)',
    bgColor: 'oklch(0.3 0.08 25 / 0.3)',
    borderColor: 'oklch(0.5 0.15 25 / 0.5)',
  },
]

export const STATUS_BY_KEY = Object.fromEntries(
  STATUSES.map((s) => [s.key, s]),
) as Record<GameStatus, StatusDef>
