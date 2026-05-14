import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface ConfirmRemoveModalProps {
  gameName: string
  onConfirm: () => void
  onCancel: () => void
  isPending: boolean
}

export function ConfirmRemoveModal({ gameName, onConfirm, onCancel, isPending }: ConfirmRemoveModalProps) {
  return (
    <Dialog open onOpenChange={open => { if (!open) onCancel() }}>
      <DialogContent
        className="max-w-sm text-center bg-bg-1 border border-border rounded-xl shadow-panel"
      >
        <div className="flex flex-col items-center gap-3">
          <div
            className="size-12 flex items-center justify-center rounded-full text-[22px] bg-[oklch(0.3_0.1_25/0.3)] text-chart-5"
          >
            ⚠
          </div>
          <DialogTitle className="text-[18px] text-text-hi">
            Remover jogo?
          </DialogTitle>
          <DialogDescription className="text-text-md text-[13.5px] leading-relaxed max-w-[34ch]">
            <strong className="text-text-hi">{gameName}</strong> será removido permanentemente da sua biblioteca.
          </DialogDescription>
        </div>

        <DialogFooter className="flex-row justify-center gap-2.5 sm:justify-center">
          <Button
            variant="ghost"
            onClick={onCancel}
            className="h-9 border border-border text-text-md rounded-[8px]"
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            disabled={isPending}
            className="h-9 rounded-[8px]"
          >
            {isPending ? 'Removendo...' : 'Remover'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
