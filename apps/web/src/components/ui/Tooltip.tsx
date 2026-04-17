import { useState, useRef, useEffect, useCallback, useId, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
}

const SHOW_DELAY = 200;

export function Tooltip({ title, description, children, className }: TooltipProps) {
  const id = useId();
  const wrapRef = useRef<HTMLSpanElement>(null);
  const timerRef = useRef<number | undefined>(undefined);
  const [pos, setPos] = useState<{ top: number; left: number; above: boolean } | null>(null);

  const computeAndShow = useCallback(() => {
    clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      if (!wrapRef.current) return;
      const r = wrapRef.current.getBoundingClientRect();
      const above = r.top > 80;
      setPos({
        top: above
          ? r.top + window.scrollY - 8
          : r.bottom + window.scrollY + 8,
        left: r.left + window.scrollX + r.width / 2,
        above,
      });
    }, SHOW_DELAY);
  }, []);

  const dismiss = useCallback(() => {
    clearTimeout(timerRef.current);
    setPos(null);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') dismiss(); };
    const onTouchOutside = (e: TouchEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) dismiss();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('touchstart', onTouchOutside, { passive: true });
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('touchstart', onTouchOutside);
      clearTimeout(timerRef.current);
    };
  }, [dismiss]);

  return (
    <>
      <span
        ref={wrapRef}
        aria-describedby={pos ? id : undefined}
        className={`cursor-help${className ? ` ${className}` : ''}`}
        onMouseEnter={computeAndShow}
        onMouseLeave={dismiss}
        onTouchStart={e => {
          if (pos) { dismiss(); }
          else { e.preventDefault(); computeAndShow(); }
        }}
      >
        {children}
      </span>
      {pos && createPortal(
        <div
          id={id}
          role="tooltip"
          style={{
            position: 'absolute',
            top: pos.top,
            left: pos.left,
            transform: pos.above ? 'translate(-50%, -100%)' : 'translate(-50%, 0)',
            zIndex: 9999,
          }}
          className="pointer-events-none w-max max-w-[260px] px-3 py-2 bg-dfa-black border border-dfa-border rounded shadow-xl"
        >
          <p className="text-[13px] font-bold text-dfa-text leading-tight">{title}</p>
          <p className="text-xs text-dfa-text-muted leading-snug mt-0.5">{description}</p>
        </div>,
        document.body
      )}
    </>
  );
}
