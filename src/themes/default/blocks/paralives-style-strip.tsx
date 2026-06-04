'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/core/i18n/navigation';
import { cn } from '@/shared/lib/utils';

interface Style {
  id: string;
  name: string;
  slug: string;
}

interface StyleStripProps {
  styles: Style[];
  activeSlug?: string;
}

export function ParalivesStyleStrip({ styles, activeSlug }: StyleStripProps) {
  const t = useTranslations('paralives');

  return (
    <div className="max-w-[1280px] mx-auto px-6 mb-10">
      <h3 className="text-sm font-semibold text-[#9a9a9a] uppercase tracking-wider mb-4">
        {t('browse_by_style') || 'Browse by Style'}
      </h3>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        <Link
          href="/builds"
          className={cn(
            'flex-shrink-0 px-5 py-2.5 bg-white border border-[#e8e6e3] rounded-full text-sm font-medium transition-all duration-200',
            !activeSlug
              ? 'bg-[#e07a5f] text-white border-[#e07a5f]'
              : 'text-[#6b6b6b] hover:border-[#e07a5f] hover:text-[#e07a5f]'
          )}
        >
          🏠 {t('all_styles') || 'All'}
        </Link>
        {styles.map((style) => (
          <Link
            key={style.slug}
            href={`/styles/${style.slug}`}
            className={cn(
              'flex-shrink-0 px-5 py-2.5 bg-white border border-[#e8e6e3] rounded-full text-sm font-medium transition-all duration-200',
              activeSlug === style.slug
                ? 'bg-[#e07a5f] text-white border-[#e07a5f]'
                : 'text-[#6b6b6b] hover:border-[#e07a5f] hover:text-[#e07a5f]'
            )}
          >
            {style.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
