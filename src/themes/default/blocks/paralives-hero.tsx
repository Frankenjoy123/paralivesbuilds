'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/core/i18n/navigation';

export function ParalivesHero() {
  const t = useTranslations('paralives');

  return (
    <section className="text-center py-16 md:py-20 px-6 max-w-3xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-4">
        {t('hero_title_prefix') || 'Discover Amazing'}{' '}
        <span className="bg-gradient-to-r from-[#e07a5f] to-[#f2cc8f] bg-clip-text text-transparent">
          {t('hero_title_highlight') || 'Paralives Builds'}
        </span>
      </h1>
      <p className="text-lg text-[#6b6b6b] mb-8 max-w-xl mx-auto">
        {t('hero_description') || 'Find inspiration for your next home. Browse modern cottages, minimalist lofts, and creative designs from the Paralives community.'}
      </p>
      <div className="flex gap-3 justify-center">
        <Link
          href="/builds"
          className="px-6 py-3 bg-[#e07a5f] text-white font-semibold rounded-lg hover:bg-[#c96a52] transition-all duration-200"
        >
          🔥 {t('hero_cta_browse') || 'Browse Builds'}
        </Link>
        <Link
          href="/submit"
          className="px-6 py-3 border border-[#e8e6e3] rounded-lg font-medium text-[#1a1a1a] hover:bg-white transition-all duration-200"
        >
          📤 {t('hero_cta_submit') || 'Submit Your Build'}
        </Link>
      </div>
    </section>
  );
}
