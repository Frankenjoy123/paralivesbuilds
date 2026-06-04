'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/core/i18n/navigation';
import { Button } from '@/shared/components/ui/button';
import { Loader2 } from 'lucide-react';
import { ParalivesBuildCard } from './paralives-build-card';
import { ParalivesMasonryGrid } from './paralives-masonry-grid';
import { fetchMoreBuilds } from '@/app/[locale]/(landing)/actions';

export function ParalivesHomeGrid({
  featuredBuilds = [],
  latestBuilds = [],
  totalCount = 0,
}: {
  featuredBuilds?: any[];
  latestBuilds?: any[];
  totalCount?: number;
}) {
  const t = useTranslations('paralives');
  const [builds, setBuilds] = useState(latestBuilds);
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

  return (
    <div className="max-w-[1280px] mx-auto px-6 pb-16">
      {/* Featured Builds */}
      {featuredBuilds.length > 0 && (
        <section className="mb-12">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl font-bold text-[#1a1a1a]">
              🔥 {t('featured_builds') || 'Featured Builds'}
            </h2>
            <Link
              href="/builds"
              className="text-sm font-semibold text-[#e07a5f] hover:underline"
            >
              {t('view_all') || 'View all'} →
            </Link>
          </div>
          <ParalivesMasonryGrid>
            {featuredBuilds.map((build, i) => (
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
                badge={build.featured ? 'Featured' : undefined}
                tall={[1, 4, 7].includes(i)}
              />
            ))}
          </ParalivesMasonryGrid>
        </section>
      )}

      {/* Latest Builds */}
      <section>
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold text-[#1a1a1a]">
            🆕 {t('latest_builds') || 'Latest Builds'}
          </h2>
          <Link
            href="/builds"
            className="text-sm font-semibold text-[#e07a5f] hover:underline"
          >
            {t('view_all') || 'View all'} →
          </Link>
        </div>
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
              tall={[2, 5, 8].includes(i)}
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
      </section>
    </div>
  );
}
