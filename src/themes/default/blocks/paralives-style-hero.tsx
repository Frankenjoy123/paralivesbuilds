'use client';

import { Link } from '@/core/i18n/navigation';
import { useTranslations } from 'next-intl';
import { ArrowLeft, Home } from 'lucide-react';

export function ParalivesStyleHero({ style, totalCount }: { style: any; totalCount: number }) {
  const t = useTranslations('paralives');

  return (
    <div className="max-w-[1280px] mx-auto px-6 py-8">
      <nav className="text-sm text-[#9a9a9a] mb-6">
        <Link href="/" className="hover:text-[#e07a5f]">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/builds" className="hover:text-[#e07a5f]">Browse</Link>
        <span className="mx-2">/</span>
        <span className="text-[#1a1a1a]">{style.name}</span>
      </nav>

      <div className="flex items-start gap-4 mb-6">
        <Link
          href="/builds"
          className="flex items-center justify-center w-10 h-10 rounded-full border border-[#e8e6e3] hover:border-[#e07a5f] hover:text-[#e07a5f] transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-[#1a1a1a] mb-2">{style.name} Builds</h1>
          <p className="text-[#6b6b6b]">
            {totalCount} {totalCount === 1 ? 'build' : 'builds'} found
          </p>
        </div>
      </div>
    </div>
  );
}
