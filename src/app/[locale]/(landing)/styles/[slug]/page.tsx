import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getThemePage } from '@/core/theme';
import { findStyle } from '@/shared/models/style';
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
  const canonicalPath = `/styles/${slug}`;
  const canonicalUrl = buildCanonicalUrl(canonicalPath, locale);
  const languageAlternates = getLanguageAlternates(canonicalPath);
  const style = await findStyle({ slug });

  if (!style) {
    return {
      title: 'Style Not Found',
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

  const title = `Best ${style.name} Paralives Builds | House Design Inspiration`;
  const description = `Explore the top ${style.name.toLowerCase()} builds in Paralives. Find inspiration for your next home.`;
  const imageUrl = style.image || envConfigs.app_preview_image;

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

export default async function StylePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const style = await findStyle({ slug });

  if (!style) {
    notFound();
  }

  const initialBuilds = await getBuilds({
    styleId: style.id,
    status: BuildStatus.PUBLISHED,
    limit: 24,
    page: 1,
  });

  const totalCount = await getBuildsCount({
    styleId: style.id,
    status: BuildStatus.PUBLISHED,
  });

  const StylePage = await getThemePage('paralives-style');

  return (
    <StylePage
      style={style}
      initialBuilds={initialBuilds}
      totalCount={totalCount}
    />
  );
}
