import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

interface ValidationAlertProps {
  errors: string[];
}

export function ValidationAlert({ errors }: ValidationAlertProps) {
  return (
    <AnimatePresence>
      {errors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          className="rounded-md border border-red-800/60 bg-red-950/40 p-3 space-y-1"
        >
          {errors.map((error, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-red-400">
              <AlertCircle size={12} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
