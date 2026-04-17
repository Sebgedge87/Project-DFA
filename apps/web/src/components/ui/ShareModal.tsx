import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Share2, Copy, Check, X, Globe, Lock } from 'lucide-react';
interface ShareModalProps {
  listId: string;
  shareToken: string;
  isPublic: boolean;
  onTogglePublic: (isPublic: boolean) => Promise<void>;
}

export function ShareModal({ listId, shareToken, isPublic, onTogglePublic }: ShareModalProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toggling, setToggling] = useState(false);
  const shareUrl = `${window.location.origin}/share/${shareToken}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggle = async () => {
    setToggling(true);
    try {
      await onTogglePublic(!isPublic);
    } finally {
      setToggling(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="w-full flex items-center justify-center gap-2 py-2 border border-dfa-border text-dfa-text-muted hover:text-dfa-text text-sm rounded transition-colors">
          <Share2 size={15} />
          Share
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 z-40" />
        <Dialog.Content className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-dfa-surface border border-dfa-border rounded-lg p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <Dialog.Title className="font-display text-dfa-text text-xl font-bold">
              Share Army
            </Dialog.Title>
            <Dialog.Close className="text-dfa-text-muted hover:text-dfa-text transition-colors">
              <X size={18} />
            </Dialog.Close>
          </div>

          {/* Public toggle */}
          <div className="flex items-center justify-between p-3 bg-dfa-black rounded-lg">
            <div className="flex items-center gap-3">
              {isPublic ? (
                <Globe size={18} className="text-dfa-gold" />
              ) : (
                <Lock size={18} className="text-dfa-text-muted" />
              )}
              <div>
                <p className="text-sm text-dfa-text font-medium">
                  {isPublic ? 'Public' : 'Private'}
                </p>
                <p className="text-xs text-dfa-text-muted">
                  {isPublic ? 'Anyone with the link can view' : 'Only you can see this'}
                </p>
              </div>
            </div>
            <button
              onClick={handleToggle}
              disabled={toggling}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                isPublic ? 'bg-dfa-red' : 'bg-dfa-surface-raised'
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  isPublic ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Share link */}
          {isPublic && (
            <div className="space-y-2">
              <p className="text-xs text-dfa-text-muted uppercase tracking-wide font-medium">
                Share link
              </p>
              <div className="flex gap-2">
                <input
                  readOnly
                  value={shareUrl}
                  className="flex-1 bg-dfa-black border border-dfa-border rounded px-3 py-2 text-xs text-dfa-text-muted font-mono focus:outline-none select-all"
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-2 bg-dfa-red hover:bg-dfa-red-bright text-white text-xs font-bold rounded transition-colors shrink-0"
                >
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
