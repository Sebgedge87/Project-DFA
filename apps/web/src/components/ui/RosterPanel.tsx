import { useEffect, useRef } from 'react';
import { X, Scroll } from 'lucide-react';

interface RosterPanelProps {
  open: boolean;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLElement>;
}

export function RosterPanel({ open, onClose, triggerRef }: RosterPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const headingId = 'roster-panel-heading';

  // Focus panel on open; return focus on close
  useEffect(() => {
    if (open) {
      panelRef.current?.focus();
    } else {
      triggerRef?.current?.focus();
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // Trap focus inside panel
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') { onClose(); return; }
    if (e.key !== 'Tab') return;

    const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    if (!focusable?.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className="fixed top-0 right-0 h-full z-50 flex flex-col bg-dfa-surface border-l border-dfa-border shadow-xl outline-none transition-transform duration-300"
        style={{
          width: 'min(90vw, 640px)',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
        }}
      >
        {/* Header */}
        <div className="shrink-0 flex items-center justify-between px-4 py-3 border-b border-dfa-border">
          <div className="flex items-center gap-2">
            <Scroll size={16} className="text-dfa-text-muted" />
            <h2 id={headingId} className="font-display text-dfa-text font-bold uppercase tracking-wide text-lg">
              Roster Reference
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close roster panel"
            className="text-dfa-text-muted hover:text-dfa-text transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* PDF iframe */}
        <iframe
          src="/roster.pdf#toolbar=0&navpanes=0&scrollbar=0"
          title="Death Fields Arena roster reference"
          sandbox="allow-scripts allow-same-origin"
          onContextMenu={e => e.preventDefault()}
          className="flex-1 w-full border-0"
        />
      </div>
    </>
  );
}
