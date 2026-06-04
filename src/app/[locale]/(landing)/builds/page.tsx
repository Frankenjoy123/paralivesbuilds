import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getThemePage } from '@/core/theme';
import { getBuilds, getBuildsCount, BuildStatus } from '@/shared/models/build';
import { getStyles } from '@/shared/models/style';
import {
  buildCanonicalUrl,
  getLanguageAlternates,
  getOpenGraphLocale,
} from '@/shared/lib/seo';
import { envConfigs } from '@/config';

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const canonicalPath = '/builds';
  const canonicalUrl = buildCanonicalUrl(canonicalPath, locale);
  const languageAlternates = getLanguageAlternates(canonicalPath);

  const title = 'Browse Paralives Builds | House Design Inspiration';
  const description = 'Discover amazing Paralives builds. Filter by style, lot size, and more. Find inspiration for your next home design.';

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: languageAlternates,
    },
    openGraph: {
      type: 'website',
      locale: getOpenGraphLocale(locale),
      alternateLocale: Object.keys(languageAlternates)
        .filter((key) => key !== locale && key !== 'x-default')
        .map(getOpenGraphLocale),
      url: canonicalUrl,
      title,
      description,
      siteName: envConfigs.app_name,
      images: [envConfigs.app_preview_image],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [envConfigs.app_preview_image],
    },
  };
}

export default async function BrowsePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ style?: string; q?: string; sort?: string; page?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { style, q, sort = 'newest', page: pageParam } = await searchParams;
  const page = Number(pageParam) || 1;

  const initialBuilds = await getBuilds({
    styleSlug: style,
    query: q,
    sort: sort as 'newest' | 'popular' | 'featured',
    status: BuildStatus.PUBLISHED,
    limit: 24,
    page,
  });

  const totalCount = await getBuildsCount({
    styleSlug: style,
    query: q,
    status: BuildStatus.PUBLISHED,
  });

  const styles = await getStyles({ limit: 100 });

  const BrowsePage = await getThemePage('paralives-browse');

  return (
    <BrowsePage
      initialBuilds={initialBuilds}
      totalCount={totalCount}
      styles={styles}
      currentStyle={style}
      currentSort={sort}
      currentQuery={q}
    />
  );
}
