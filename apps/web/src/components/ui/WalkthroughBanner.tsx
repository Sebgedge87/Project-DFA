import { X, Lightbulb } from 'lucide-react';

interface WalkthroughBannerProps {
  message: string;
  onDismiss: () => void;
}

export function WalkthroughBanner({ message, onDismiss }: WalkthroughBannerProps) {
  return (
    <div className="flex items-start gap-3 px-4 py-3 bg-dfa-red/10 border border-dfa-red/30 rounded-lg text-sm">
      <Lightbulb size={15} className="text-dfa-red shrink-0 mt-0.5" />
      <p className="flex-1 text-dfa-text leading-snug">{message}</p>
      <button
        onClick={onDismiss}
        title="Dismiss"
        className="text-dfa-text-muted hover:text-dfa-text transition-colors shrink-0 mt-0.5"
      >
        <X size={14} />
      </button>
    </div>
  );
}
