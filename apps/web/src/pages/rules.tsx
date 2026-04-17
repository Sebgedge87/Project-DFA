import { useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';

const EXTERNAL_RULES_URL = 'https://www.wargamesatlantic.com/products/death-fields-arena-rules';
const PDF_URL = import.meta.env.VITE_RULES_PDF_URL as string | undefined || '/rules.pdf';

export default function RulesPage() {
  const [pdfMissing, setPdfMissing] = useState(false);

  useEffect(() => {
    fetch(PDF_URL, { method: 'HEAD' })
      .then(r => { if (!r.ok) setPdfMissing(true); })
      .catch(() => setPdfMissing(true));
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

      {pdfMissing ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-5 p-8 text-center">
          <div className="space-y-2">
            <p className="text-dfa-text font-display font-bold text-lg uppercase tracking-wide">
              Rules PDF not configured
            </p>
            <p className="text-dfa-text-muted text-sm max-w-sm">
              Place <code className="text-dfa-gold font-mono bg-dfa-surface px-1 rounded">rules.pdf</code> in{' '}
              <code className="text-dfa-gold font-mono bg-dfa-surface px-1 rounded">apps/web/public/</code> to enable inline viewing.
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
      ) : (
        <iframe
          src={`${PDF_URL}#toolbar=0&navpanes=0&scrollbar=0`}
          title="Death Fields Arena rules"
          sandbox="allow-scripts allow-same-origin"
          onContextMenu={e => e.preventDefault()}
          className="flex-1 w-full border-0"
        />
      )}
    </div>
  );
}
