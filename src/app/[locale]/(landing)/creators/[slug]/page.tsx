import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getThemePage } from '@/core/theme';
import { findCreator } from '@/shared/models/creator';
import { getBuilds, getBuildsCount, BuildStatus } from '@/shared/models/build';
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
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const canonicalPath = `/creators/${slug}`;
  const canonicalUrl = buildCanonicalUrl(canonicalPath, locale);
  const languageAlternates = getLanguageAlternates(canonicalPath);
  const creator = await findCreator({ slug });

  if (!creator) {
    return {
      title: 'Creator Not Found',
      alternates: {
        canonical: canonicalUrl,
        languages: languageAlternates,
      },
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = `${creator.name} | Paralives Build Creator`;
  const description = creator.bio || `Explore ${creator.name}'s Paralives builds and house designs.`;
  const imageUrl = creator.avatar || envConfigs.app_preview_image;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: languageAlternates,
    },
    openGraph: {
      type: 'profile',
      locale: getOpenGraphLocale(locale),
      alternateLocale: Object.keys(languageAlternates)
        .filter((key) => key !== locale && key !== 'x-default')
        .map(getOpenGraphLocale),
      url: canonicalUrl,
      title,
      description,
      siteName: envConfigs.app_name,
      images: [imageUrl],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function CreatorPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const creator = await findCreator({ slug });

  if (!creator) {
    notFound();
  }

  const initialBuilds = await getBuilds({
    creatorId: creator.id,
    status: BuildStatus.PUBLISHED,
    limit: 24,
    page: 1,
  });

  const totalCount = await getBuildsCount({
    creatorId: creator.id,
    status: BuildStatus.PUBLISHED,
  });

  const CreatorPage = await getThemePage('paralives-creator');

  return (
    <CreatorPage
      creator={creator}
      initialBuilds={initialBuilds}
      totalCount={totalCount}
    />
  );
}
