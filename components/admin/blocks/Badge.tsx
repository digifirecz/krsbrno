import type { ReactNode } from 'react';

// Small muted pill for table cells (type, category, …).
export default function Badge({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 text-xs font-semibold whitespace-nowrap ${className}`}
    >
      {children}
    </span>
  );
}
