import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface BottomSheetProps {
  open:     boolean;
  onClose:  () => void;
  title?:   string;
  children: ReactNode;
}

export function BottomSheet({ open, onClose, title, children }: BottomSheetProps) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-dfa-surface rounded-t-2xl max-h-[85vh] flex flex-col lg:hidden border-t border-dfa-border shadow-2xl"
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1 bg-dfa-border-neutral rounded-full" />
            </div>

            {title && (
              <div className="flex items-center justify-between px-4 pb-3 pt-1 shrink-0">
                <h2 className="font-display text-dfa-text font-bold text-lg uppercase tracking-wide">{title}</h2>
                <button onClick={onClose} aria-label="Close" className="text-dfa-text-muted hover:text-dfa-text transition-colors">
                  <X size={18} />
                </button>
              </div>
            )}

            <div className="flex-1 overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
