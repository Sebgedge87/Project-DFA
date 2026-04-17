export default function RulesPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="shrink-0 px-4 md:px-6 py-3 border-b border-dfa-border">
        <h1 className="font-display text-dfa-text text-xl font-bold uppercase tracking-wide">Rules</h1>
      </div>
      <iframe
        src="/rules.pdf#toolbar=0&navpanes=0&scrollbar=0"
        title="Death Fields Arena rules"
        sandbox="allow-scripts allow-same-origin"
        onContextMenu={e => e.preventDefault()}
        className="flex-1 w-full border-0"
        style={{ minHeight: '80vh' }}
      />
    </div>
  );
}
