'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/core/i18n/navigation';

export function ParalivesFooter() {
  const t = useTranslations('paralives');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[#e8e6e3] bg-[#faf9f7]"
    >
      <div className="max-w-[1280px] mx-auto px-6 py-12"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8"
        >
          {/* Brand */}
          <div className="md:col-span-1"
          >
            <Link href="/" className="flex items-center gap-2.5 font-bold text-xl text-[#1a1a1a] mb-4"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#e07a5f] to-[#f2cc8f] flex items-center justify-center text-base"
              >
                🏠
              </div>
              ParalivesBuilds
            </Link>
            <p className="text-sm text-[#6b6b6b] leading-relaxed"
            >
              {t('footer_desc') || 'The best place to find Paralives house design inspiration. Browse builds from the community and share your creations.'}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-semibold text-[#1a1a1a] uppercase tracking-wider mb-4"
            >
              {t('footer_explore') || 'Explore'}
            </h4>
            <ul className="space-y-2"
            >
              <li>
                <Link href="/" className="text-sm text-[#6b6b6b] hover:text-[#e07a5f] transition-colors"
                >
                  {t('nav_home') || 'Home'}
                </Link>
              </li>
              <li>
                <Link href="/builds" className="text-sm text-[#6b6b6b] hover:text-[#e07a5f] transition-colors"
                >
                  {t('nav_browse') || 'Browse'}
                </Link>
              </li>
              <li>
                <Link href="/creators" className="text-sm text-[#6b6b6b] hover:text-[#e07a5f] transition-colors"
                >
                  {t('nav_creators') || 'Creators'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-[#1a1a1a] uppercase tracking-wider mb-4"
            >
              {t('footer_resources') || 'Resources'}
            </h4>
            <ul className="space-y-2"
            >
              <li>
                <Link href="/guides" className="text-sm text-[#6b6b6b] hover:text-[#e07a5f] transition-colors"
                >
                  {t('nav_guides') || 'Guides'}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-[#6b6b6b] hover:text-[#e07a5f] transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-[#6b6b6b] hover:text-[#e07a5f] transition-colors"
                >
                  {t('nav_about') || 'About'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-[#1a1a1a] uppercase tracking-wider mb-4"
            >
              {t('footer_legal') || 'Legal'}
            </h4>
            <ul className="space-y-2"
            >
              <li>
                <Link href="/privacy-policy" className="text-sm text-[#6b6b6b] hover:text-[#e07a5f] transition-colors"
                >
                  {t('nav_privacy') || 'Privacy Policy'}
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-sm text-[#6b6b6b] hover:text-[#e07a5f] transition-colors"
                >
                  {t('nav_terms') || 'Terms of Service'}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-[#e8e6e3] flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <p className="text-xs text-[#9a9a9a]"
          >
            &copy; {currentYear} ParalivesBuilds. All rights reserved.
          </p>
          <p className="text-xs text-[#9a9a9a]"
          >
            Not affiliated with Paralives. Fan-made community project.
          </p>
        </div>
      </div>
    </footer>
  );
}
