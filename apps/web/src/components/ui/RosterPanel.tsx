import { useEffect, useRef, useState } from 'react';
import { X, Scroll, FileText, ExternalLink } from 'lucide-react';

const ROSTER_PDF_URL = import.meta.env.VITE_ROSTER_PDF_URL as string | undefined || '/roster.pdf';
const isSameOrigin = !ROSTER_PDF_URL.startsWith('http');

interface RosterPanelProps {
  open: boolean;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLElement>;
}

export function RosterPanel({ open, onClose, triggerRef }: RosterPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const headingId = 'roster-panel-heading';
  const [pdfAvailable, setPdfAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    if (!open) return;
    fetch(ROSTER_PDF_URL, { method: 'GET', headers: { Range: 'bytes=0-0' } })
      .then(r => setPdfAvailable(r.ok || r.status === 206))
      .catch(() => setPdfAvailable(false));
  }, [open]);

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

        {/* Content */}
        {pdfAvailable === null ? null : !pdfAvailable ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-5 p-8 text-center">
            <div className="space-y-2">
              <p className="text-dfa-text font-display font-bold text-lg uppercase tracking-wide">
                Roster PDF not configured
              </p>
              <p className="text-dfa-text-muted text-sm max-w-sm">
                Upload a PDF to Supabase Storage and set{' '}
                <code className="text-dfa-gold font-mono bg-dfa-black px-1 rounded">VITE_ROSTER_PDF_URL</code>{' '}
                to enable viewing.
              </p>
            </div>
          </div>
        ) : isSameOrigin ? (
          <iframe
            src={`${ROSTER_PDF_URL}#toolbar=0&navpanes=0&scrollbar=0`}
            title="Death Fields Arena roster reference"
            sandbox="allow-scripts allow-same-origin"
            onContextMenu={e => e.preventDefault()}
            className="flex-1 w-full border-0"
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-5 p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-dfa-surface border border-dfa-border flex items-center justify-center">
              <FileText size={28} className="text-dfa-red" />
            </div>
            <div className="space-y-2">
              <p className="text-dfa-text font-display font-bold text-lg uppercase tracking-wide">
                Roster Reference
              </p>
              <p className="text-dfa-text-muted text-sm max-w-sm">
                Opens in a new tab for the best reading experience.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={ROSTER_PDF_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-dfa-red hover:bg-dfa-red-bright text-white text-sm font-bold rounded transition-colors"
              >
                <FileText size={15} />
                Open Roster PDF
              </a>
              <button
                onClick={onClose}
                className="flex items-center gap-2 px-5 py-2.5 border border-dfa-border text-dfa-text-muted hover:text-dfa-text text-sm rounded transition-colors"
              >
                <X size={15} />
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
