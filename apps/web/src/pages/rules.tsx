import { useEffect, useState } from 'react';
import { ExternalLink, FileText } from 'lucide-react';

const EXTERNAL_RULES_URL = 'https://www.wargamesatlantic.com/products/death-fields-arena-rules';
const PDF_URL = import.meta.env.VITE_RULES_PDF_URL as string | undefined || '/rules.pdf';

const isSameOrigin = !PDF_URL.startsWith('http');

export default function RulesPage() {
  const [pdfAvailable, setPdfAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    fetch(PDF_URL, { method: 'HEAD' })
      .then(r => setPdfAvailable(r.ok))
      .catch(() => setPdfAvailable(false));
  }, []);

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 5rem)' }}>
      <div className="shrink-0 px-4 md:px-6 py-3 border-b border-dfa-border flex items-center justify-between">
        <h1 className="font-display text-dfa-text text-xl font-bold uppercase tracking-wide">Rules</h1>
        <a
          href={EXTERNAL_RULES_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-dfa-text-muted hover:text-dfa-text transition-colors"
        >
          <ExternalLink size={13} />
          View on Wargames Atlantic
        </a>
      </div>

      {pdfAvailable === null ? null : !pdfAvailable ? (
        /* PDF not found */
        <div className="flex-1 flex flex-col items-center justify-center gap-5 p-8 text-center">
          <div className="space-y-2">
            <p className="text-dfa-text font-display font-bold text-lg uppercase tracking-wide">
              Rules PDF not configured
            </p>
            <p className="text-dfa-text-muted text-sm max-w-sm">
              Upload a PDF to Supabase Storage and set{' '}
              <code className="text-dfa-gold font-mono bg-dfa-surface px-1 rounded">VITE_RULES_PDF_URL</code>{' '}
              to enable viewing.
            </p>
          </div>
          <a
            href={EXTERNAL_RULES_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 bg-dfa-red hover:bg-dfa-red-bright text-white text-sm font-bold rounded transition-colors"
          >
            <ExternalLink size={15} />
            Open Rules on Wargames Atlantic
          </a>
        </div>
      ) : isSameOrigin ? (
        /* Same-origin: embed directly */
        <iframe
          src={`${PDF_URL}#toolbar=0&navpanes=0&scrollbar=0`}
          title="Death Fields Arena rules"
          className="flex-1 w-full border-0"
        />
      ) : (
        /* Cross-origin (Supabase Storage): open in new tab */
        <div className="flex-1 flex flex-col items-center justify-center gap-5 p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-dfa-surface border border-dfa-border flex items-center justify-center">
            <FileText size={28} className="text-dfa-red" />
          </div>
          <div className="space-y-2">
            <p className="text-dfa-text font-display font-bold text-lg uppercase tracking-wide">
              Death Fields Arena Rules
            </p>
            <p className="text-dfa-text-muted text-sm max-w-sm">
              Opens in a new tab for the best reading experience.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={PDF_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 bg-dfa-red hover:bg-dfa-red-bright text-white text-sm font-bold rounded transition-colors"
            >
              <FileText size={15} />
              Open Rules PDF
            </a>
            <a
              href={EXTERNAL_RULES_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 border border-dfa-border text-dfa-text-muted hover:text-dfa-text text-sm rounded transition-colors"
            >
              <ExternalLink size={15} />
              Wargames Atlantic
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
