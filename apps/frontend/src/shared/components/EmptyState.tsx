import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon: ReactNode
  title: string
  body: string
  action?: ReactNode
}

export function EmptyState({ icon, title, body, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 px-5 py-20 text-center bg-bg-1 border border-dashed border-border rounded-lg">
      <div className="size-14 flex items-center justify-center bg-accent-soft rounded-full text-accent-bright">
        {icon}
      </div>
      <p className="text-[17px] font-semibold text-text-hi m-0">{title}</p>
      <p className="text-text-md text-[13.5px] max-w-[42ch] m-0">{body}</p>
      {action}
    </div>
  )
}
