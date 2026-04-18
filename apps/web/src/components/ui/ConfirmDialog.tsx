import * as Dialog from '@radix-ui/react-dialog';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={open => { if (!open) onCancel(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 z-50" />
        <Dialog.Content
          className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-dfa-surface border border-dfa-border rounded-xl p-6 shadow-2xl space-y-4"
          onOpenAutoFocus={e => e.preventDefault()}
        >
          <div className="flex items-start gap-3">
            {destructive && (
              <AlertTriangle size={18} className="text-red-400 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1 min-w-0">
              <Dialog.Title className="font-display text-dfa-text font-bold text-base uppercase tracking-wide">
                {title}
              </Dialog.Title>
              <Dialog.Description className="text-dfa-text-muted text-sm leading-relaxed">
                {description}
              </Dialog.Description>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-dfa-border text-dfa-text-muted hover:text-dfa-text text-sm rounded transition-colors"
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 text-sm font-bold rounded transition-colors ${
                destructive
                  ? 'bg-red-600 hover:bg-red-500 text-white'
                  : 'bg-dfa-red hover:bg-dfa-red-bright text-white'
              }`}
            >
              {confirmLabel}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
