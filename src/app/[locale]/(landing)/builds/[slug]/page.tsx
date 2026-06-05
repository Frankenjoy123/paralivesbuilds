import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getThemePage } from '@/core/theme';
import { findBuild, getBuilds, BuildStatus } from '@/shared/models/build';
import { getBuildTags } from '@/shared/models/tag';
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
  const canonicalPath = `/builds/${slug}`;
  const canonicalUrl = buildCanonicalUrl(canonicalPath, locale);
  const languageAlternates = getLanguageAlternates(canonicalPath);
  const result = await findBuild({ slug, status: BuildStatus.PUBLISHED });

  if (!result) {
    return {
      title: 'Build Not Found',
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

  const title = `${result.title} - Paralives Build by ${result.creatorName || 'Unknown Creator'}`;
  const description = result.description || `Check out ${result.title}, a ${result.styleName || ''} build in Paralives.`;
  const images = result.images ? JSON.parse(result.images) : [];
  let imageUrl = images[0] || envConfigs.app_preview_image;
  // Ensure image URL is absolute and points to R2 custom domain
  if (imageUrl && !imageUrl.startsWith('http')) {
    const imageDomain = process.env.NEXT_PUBLIC_IMAGE_DOMAIN || 'https://image.paralivesbuilds.com';
    imageUrl = imageUrl.startsWith('/')
      ? `${imageDomain}${imageUrl}`
      : `${imageDomain}/${imageUrl}`;
  }

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: languageAlternates,
    },
    openGraph: {
      type: 'article',
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

export default async function BuildDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const result = await findBuild({ slug, status: BuildStatus.PUBLISHED });

  if (!result) {
    notFound();
  }

  const buildData = result;
  const tags = await getBuildTags(buildData.id);

  // Fetch related builds from same style
  const relatedBuilds = await getBuilds({
    styleId: buildData.styleId,
    status: BuildStatus.PUBLISHED,
    limit: 8,
    page: 1,
  });

  const BuildDetailPage = await getThemePage('paralives-build-detail');

  // Build Article JSON-LD
  const rawImages = buildData.images ? JSON.parse(buildData.images) : [];
  let coverImage = rawImages[0] || '';
  if (coverImage && !coverImage.startsWith('http')) {
    const imageDomain = process.env.NEXT_PUBLIC_IMAGE_DOMAIN || 'https://image.paralivesbuilds.com';
    coverImage = coverImage.startsWith('/') ? `${imageDomain}${coverImage}` : `${imageDomain}/${coverImage}`;
  }

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: buildData.title,
    description: buildData.description || `Check out ${buildData.title}, a Paralives build.`,
    image: coverImage,
    url: `https://paralivesbuilds.com/builds/${slug}`,
    dateModified: buildData.updatedAt || new Date().toISOString(),
    author: {
      '@type': 'Person',
      name: buildData.creatorName || 'Unknown Creator',
      url: buildData.creatorSlug ? `https://paralivesbuilds.com/creators/${buildData.creatorSlug}` : undefined,
    },
    publisher: {
      '@type': 'Organization',
      name: 'ParalivesBuilds',
      logo: {
        '@type': 'ImageObject',
        url: 'https://paralivesbuilds.com/favicon-32x32.png',
      },
    },
    articleSection: buildData.styleName || 'Build',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <BuildDetailPage
        build={buildData}
        tags={tags}
        relatedBuilds={relatedBuilds.filter((b) => b.id !== buildData.id)}
      />
    </>
  );
}
