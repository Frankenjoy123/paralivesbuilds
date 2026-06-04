import { setRequestLocale } from 'next-intl/server';

import { getThemePage } from '@/core/theme';
import { getMetadata } from '@/shared/lib/seo';
import {
  getBuilds,
  getBuildsCount,
  getFeaturedBuilds,
  BuildStatus,
} from '@/shared/models/build';
import { getStyles } from '@/shared/models/style';

export const revalidate = 3600;
export const generateMetadata = getMetadata({
  canonicalUrl: '/',
});

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // fetch featured builds for the home grid
  const featuredBuilds = await getFeaturedBuilds(12);

  // fetch latest builds
  const latestBuilds = await getBuilds({
    status: BuildStatus.PUBLISHED,
    limit: 24,
    page: 1,
  });

  const totalCount = await getBuildsCount({
    status: BuildStatus.PUBLISHED,
  });

  // fetch styles for the style strip
  const styles = await getStyles({ limit: 100 });

  // load page component
  const Page = await getThemePage('paralives-home');

  return (
    <Page
      featuredBuilds={featuredBuilds}
      latestBuilds={latestBuilds}
      totalCount={totalCount}
      styles={styles}
    />
  );
}
