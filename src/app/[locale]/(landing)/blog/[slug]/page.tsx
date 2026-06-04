import { getTranslations, setRequestLocale } from 'next-intl/server';

import { getThemePage } from '@/core/theme';
import { envConfigs } from '@/config';
import { Empty } from '@/shared/blocks/common';
import {
  buildCanonicalUrl,
  getLanguageAlternates,
  getOpenGraphLocale,
} from '@/shared/lib/seo';
import { getPost } from '@/shared/models/post';
import { DynamicPage } from '@/shared/types/blocks/landing';

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations('pages.blog.metadata');
  const canonicalPath = `/blog/${slug}`;
  const canonicalUrl = buildCanonicalUrl(canonicalPath, locale);
  const languageAlternates = getLanguageAlternates(canonicalPath);

  const post = await getPost({ slug, locale });
  if (!post) {
    const title = `${slug} | ${t('title')}`;
    const description = t('description');
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

  const title = `${post.title} | ${t('title')}`;
  const description = post.description;
  const imageUrl = post.image || envConfigs.app_preview_image;

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

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = await getPost({ slug, locale });

  if (!post) {
    return <Empty message={`Post not found`} />;
  }

  // build page sections
  const page: DynamicPage = {
    sections: {
      blogDetail: {
        block: 'blog-detail',
        data: {
          post,
        },
      },
    },
  };

  const Page = await getThemePage('dynamic-page');

  return <Page locale={locale} page={page} />;
}
