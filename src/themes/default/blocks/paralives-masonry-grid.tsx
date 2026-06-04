'use client';

import { ReactNode } from 'react';

export function ParalivesMasonryGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
      {children}
    </div>
  );
}
