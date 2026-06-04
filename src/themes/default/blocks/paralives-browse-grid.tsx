'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/core/i18n/navigation';
import { Button } from '@/shared/components/ui/button';
import { Loader2 } from 'lucide-react';
import { ParalivesBuildCard } from './paralives-build-card';
import { ParalivesMasonryGrid } from './paralives-masonry-grid';
import { fetchMoreBuilds } from '@/app/[locale]/(landing)/actions';
import { cn } from '@/shared/lib/utils';

export function ParalivesBrowseGrid({
  initialBuilds = [],
  totalCount = 0,
  styles = [],
  currentStyle,
  currentSort = 'newest',
  currentQuery,
}: {
  initialBuilds?: any[];
  totalCount?: number;
  styles?: any[];
  currentStyle?: string;
  currentSort?: string;
  currentQuery?: string;
}) {
  const t = useTranslations('paralives');
  const [builds, setBuilds] = useState(initialBuilds);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(builds.length < totalCount);

  const handleLoadMore = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const nextPage = page + 1;
      const newBuilds = await fetchMoreBuilds({
        page: nextPage,
        limit: 24,
        styleId: currentStyle,
        sort: currentSort as 'newest' | 'popular' | 'featured',
      });

      if (newBuilds.length > 0) {
        setBuilds((prev) => [...prev, ...newBuilds]);
        setPage(nextPage);
        if (builds.length + newBuilds.length >= totalCount) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Failed to load more builds:', error);
    } finally {
      setLoading(false);
    }
  };

  const sortOptions = [
    { value: 'newest', label: t('sort_newest') || 'Newest' },
    { value: 'popular', label: t('sort_popular') || 'Most Popular' },
    { value: 'featured', label: t('sort_featured') || 'Featured' },
  ];

  const buildQueryString = (params: Record<string, string | undefined>) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.set(key, value);
    });
    const qs = searchParams.toString();
    return qs ? `?${qs}` : '';
  };

  return (
    <div className="max-w-[1280px] mx-auto px-6 pb-16">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {/* Style Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <Link
            href={`/builds${buildQueryString({ sort: currentSort, q: currentQuery })}`}
            className={cn(
              'flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border',
              !currentStyle
                ? 'bg-[#e07a5f] text-white border-[#e07a5f]'
                : 'bg-white text-[#6b6b6b] border-[#e8e6e3] hover:border-[#e07a5f]'
            )}
          >
            {t('all_styles') || 'All'}
          </Link>
          {styles.map((style) => (
            <Link
              key={style.slug}
              href={`/builds${buildQueryString({
                style: style.slug,
                sort: currentSort,
                q: currentQuery,
              })}`}
              className={cn(
                'flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border',
                currentStyle === style.slug
                  ? 'bg-[#e07a5f] text-white border-[#e07a5f]'
                  : 'bg-white text-[#6b6b6b] border-[#e8e6e3] hover:border-[#e07a5f]'
              )}
            >
              {style.name}
            </Link>
          ))}
        </div>

        {/* Sort Filter */}
        <div className="flex gap-2">
          {sortOptions.map((option) => (
            <Link
              key={option.value}
              href={`/builds${buildQueryString({
                style: currentStyle,
                sort: option.value,
                q: currentQuery,
              })}`}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border',
                currentSort === option.value
                  ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]'
                  : 'bg-white text-[#6b6b6b] border-[#e8e6e3] hover:border-[#1a1a1a]'
              )}
            >
              {option.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-[#9a9a9a] mb-6">
        {t('found_builds', { count: totalCount }) || `${totalCount} builds found`}
      </p>

      {/* Grid */}
      {builds.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-lg text-[#6b6b6b]">
            {t('no_builds') || 'No builds found'}
          </p>
        </div>
      ) : (
        <>
          <ParalivesMasonryGrid>
            {builds.map((build, i) => (
              <ParalivesBuildCard
                key={build.id}
                slug={build.slug}
                title={build.title}
                style={build.styleName}
                styleSlug={build.styleSlug}
                lotSize={build.lotSize}
                image={build.images ? JSON.parse(build.images)[0] : undefined}
                creatorName={build.creatorName}
                likesCount={build.likesCount}
                viewsCount={build.viewsCount}
                tall={[1, 4, 7].includes(i)}
              />
            ))}
          </ParalivesMasonryGrid>

          {/* Load More */}
          {hasMore && (
            <div className="flex justify-center mt-8">
              <Button
                onClick={handleLoadMore}
                disabled={loading}
                variant="outline"
                className="px-8 py-3 border-[#e8e6e3] text-[#1a1a1a] hover:bg-white hover:border-[#e07a5f] hover:text-[#e07a5f] transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t('loading') || 'Loading...'}
                  </>
                ) : (
                  t('load_more') || 'Load More'
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
