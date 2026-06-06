'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Menu, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/core/i18n/navigation';
import { SignUser } from '@/shared/blocks/sign/sign-user';
import { cn } from '@/shared/lib/utils';
import { usePathname } from 'next/navigation';
import { searchBuildsAction } from '@/app/[locale]/(landing)/actions';
import type { Header as HeaderType } from '@/shared/types/blocks/landing';

export function ParalivesHeader({ header }: { header?: HeaderType }) {
  const t = useTranslations('paralives');
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    if (searchQuery.trim().length > 0) {
      setIsSearching(true);
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const results = await searchBuildsAction(searchQuery.trim());
          setSearchResults(results);
          setShowSearchDropdown(true);
        } catch (error) {
          console.error('Search error:', error);
        } finally {
          setIsSearching(false);
        }
      }, 300);
    } else {
      setSearchResults([]);
      setShowSearchDropdown(false);
      setIsSearching(false);
    }

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [searchQuery]);

  const navItems = [
    { href: '/', label: t('nav_home') || 'Home' },
    { href: '/builds', label: t('nav_browse') || 'Browse' },
    { href: '/creators', label: t('nav_creators') || 'Creators' },
    { href: '/guides', label: t('nav_guides') || 'Guides' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/' || pathname === '/zh' || pathname === '/en';
    return pathname.startsWith(href) || pathname.startsWith('/zh' + href) || pathname.startsWith('/en' + href);
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#faf9f7]/92 backdrop-blur-xl border-b border-[#e8e6e3]">
      <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-bold text-xl text-[#1a1a1a]">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#e07a5f] to-[#f2cc8f] flex items-center justify-center text-base">
            🏠
          </div>
          ParalivesBuilds
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'text-sm font-medium transition-colors duration-200',
                isActive(item.href)
                  ? 'text-[#e07a5f]'
                  : 'text-[#6b6b6b] hover:text-[#1a1a1a]'
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Search + Submit */}
        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block" ref={searchRef}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9a9a9a]" />
              <input
                type="text"
                placeholder={t('search_placeholder') || 'Search builds...'}
                className="pl-9 pr-4 py-2 bg-white border border-[#e8e6e3] rounded-full text-sm outline-none transition-all duration-200 w-[200px] focus:w-[260px] focus:border-[#e07a5f]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchResults.length > 0 && setShowSearchDropdown(true)}
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="w-3 h-3 border-2 border-[#e07a5f] border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>

            {/* Search Dropdown */}
            {showSearchDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-[#e8e6e3] shadow-lg overflow-hidden z-50">
                {searchResults.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-[#9a9a9a]">
                    {t('no_matches') || 'No matches found'}
                  </div>
                ) : (
                  <div className="max-h-[320px] overflow-y-auto">
                    {searchResults.map((build: any) => (
                      <Link
                        key={build.id}
                        href={`/builds/${build.slug}`}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-[#faf9f7] transition-colors"
                        onClick={() => {
                          setShowSearchDropdown(false);
                          setSearchQuery('');
                        }}
                      >
                        <div className="w-10 h-10 rounded-lg bg-[#f0eeeb] flex items-center justify-center text-lg flex-shrink-0">
                          🏠
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-[#1a1a1a] truncate">
                            {build.title}
                          </p>
                          <p className="text-xs text-[#9a9a9a]">
                            {build.styleName} · {build.creatorName}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <Link
            href="/submit"
            className="hidden sm:inline-flex px-5 py-2.5 bg-[#e07a5f] text-white text-sm font-semibold rounded-lg hover:bg-[#c96a52] transition-all duration-200"
          >
            {t('submit_build') || 'Submit Build'}
          </Link>

          {header?.show_sign !== false && (
            <div className="flex items-center">
              <SignUser userNav={header?.user_nav} signButtonSize="sm" />
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-[#6b6b6b]"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden border-t border-[#e8e6e3] bg-[#faf9f7] px-6 py-4">
          <div className="flex flex-col gap-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-sm font-medium py-2',
                  isActive(item.href)
                    ? 'text-[#e07a5f]'
                    : 'text-[#6b6b6b]'
                )}
                onClick={() => setShowMobileMenu(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/submit"
              className="inline-flex items-center justify-center px-5 py-2.5 bg-[#e07a5f] text-white text-sm font-semibold rounded-lg mt-2"
            >
              {t('submit_build') || 'Submit Build'}
            </Link>
            {header?.show_sign !== false && (
              <div className="mt-2 flex items-center">
                <SignUser userNav={header?.user_nav} signButtonSize="sm" />
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
