import { MetadataRoute } from 'next';

import { envConfigs } from '@/config';
import { defaultLocale, locales } from '@/config/locale';
import { BuildStatus, getBuilds } from '@/shared/models/build';
import { getStyles } from '@/shared/models/style';
import { getCreators } from '@/shared/models/creator';
import {
  getLocalPostsAndCategories,
  getPosts,
  PostStatus,
  PostType,
} from '@/shared/models/post';
import {
  getTaxonomies,
  TaxonomyStatus,
  TaxonomyType,
} from '@/shared/models/taxonomy';

const PAGE_SIZE = 500;

function withLocale(pathname: string, locale: string) {
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  if (locale === defaultLocale) {
    return normalizedPath;
  }
  return normalizedPath === '/'
    ? `/${locale}`
    : `/${locale}${normalizedPath}`;
}

function toAbsoluteUrl(pathname: string) {
  const baseUrl = envConfigs.app_url.includes('localhost')
    ? 'https://paralivesbuilds.com'
    : envConfigs.app_url;
  return `${baseUrl}${pathname === '/' ? '' : pathname}`;
}

async function fetchAllBuilds() {
  const builds: Array<{ slug: string; updatedAt?: Date | null }> = [];
  let page = 1;

  while (true) {
    const rows = await getBuilds({
      status: BuildStatus.PUBLISHED,
      page,
      limit: PAGE_SIZE,
    });
    if (!rows.length) break;

    builds.push(...rows.map((item) => ({ slug: item.slug, updatedAt: item.updatedAt })));
    if (rows.length < PAGE_SIZE) break;
    page += 1;
  }

  return builds;
}

async function fetchAllStyles(): Promise<Array<{ slug: string }>> {
  const rows = await getStyles({ limit: PAGE_SIZE });
  return rows.map((item: { slug: string }) => ({ slug: item.slug }));
}

async function fetchAllCreators(): Promise<Array<{ slug: string }>> {
  const rows = await getCreators({ limit: PAGE_SIZE });
  return rows.map((item: { slug: string }) => ({ slug: item.slug }));
}

async function fetchAllBlogPosts() {
  const posts: Array<{ slug: string; updatedAt?: Date | null }> = [];
  let page = 1;

  while (true) {
    const rows = await getPosts({
      type: PostType.ARTICLE,
      status: PostStatus.PUBLISHED,
      page,
      limit: PAGE_SIZE,
    });
    if (!rows.length) break;

    posts.push(...rows.map((item) => ({ slug: item.slug, updatedAt: item.updatedAt })));
    if (rows.length < PAGE_SIZE) break;
    page += 1;
  }

  return posts;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];
  const dedupe = new Set<string>();
  const now = new Date();

  const addEntry = ({
    pathname,
    lastModified,
    changeFrequency = 'weekly',
    priority = 0.7,
  }: {
    pathname: string;
    lastModified?: Date;
    changeFrequency?: MetadataRoute.Sitemap[number]['changeFrequency'];
    priority?: number;
  }) => {
    const url = toAbsoluteUrl(pathname);
    if (dedupe.has(url)) return;
    dedupe.add(url);
    entries.push({
      url,
      lastModified: (lastModified && !isNaN(lastModified.getTime())) ? lastModified : now,
      changeFrequency,
      priority,
    });
  };

  const publicStaticPaths = ['/', '/builds', '/blog', '/showcases', '/updates', '/pricing'];

  locales.forEach((locale) => {
    publicStaticPaths.forEach((path) => {
      addEntry({
        pathname: withLocale(path, locale),
        changeFrequency: path === '/' ? 'daily' : 'weekly',
        priority: path === '/' ? 1 : 0.8,
      });
    });
  });

  try {
    const [builds, styles, creators, blogPosts, blogCategories] = await Promise.all([
      fetchAllBuilds(),
      fetchAllStyles(),
      fetchAllCreators(),
      fetchAllBlogPosts(),
      getTaxonomies({
        type: TaxonomyType.CATEGORY,
        status: TaxonomyStatus.PUBLISHED,
        limit: PAGE_SIZE,
      }),
    ]);

    locales.forEach((locale) => {
      builds.forEach((build) => {
        addEntry({
          pathname: withLocale(`/builds/${build.slug}`, locale),
          lastModified: build.updatedAt || now,
          changeFrequency: 'weekly',
          priority: 0.7,
        });
      });

      styles.forEach((style) => {
        addEntry({
          pathname: withLocale(`/styles/${style.slug}`, locale),
          changeFrequency: 'weekly',
          priority: 0.75,
        });
      });

      creators.forEach((creator) => {
        addEntry({
          pathname: withLocale(`/creators/${creator.slug}`, locale),
          changeFrequency: 'weekly',
          priority: 0.7,
        });
      });

      blogPosts.forEach((post) => {
        addEntry({
          pathname: withLocale(`/blog/${post.slug}`, locale),
          lastModified: post.updatedAt || now,
          changeFrequency: 'weekly',
          priority: 0.7,
        });
      });

      blogCategories.forEach((category) => {
        addEntry({
          pathname: withLocale(`/blog/category/${category.slug}`, locale),
          lastModified: category.updatedAt || now,
          changeFrequency: 'weekly',
          priority: 0.65,
        });
      });
    });
  } catch (error) {
    console.error('Failed to build dynamic sitemap entries:', error);
  }

  // Add locale-specific local markdown posts/logs that may not exist in database.
  await Promise.all(
    locales.map(async (locale) => {
      try {
        const [localBlog, localUpdates] = await Promise.all([
          getLocalPostsAndCategories({
            locale,
            type: PostType.ARTICLE,
            postPrefix: '/blog/',
          }),
          getLocalPostsAndCategories({
            locale,
            type: PostType.LOG,
            postPrefix: '/updates/',
          }),
        ]);

        localBlog.posts.forEach((post) => {
          if (!post.slug) return;
          addEntry({
            pathname: withLocale(`/blog/${post.slug}`, locale),
            changeFrequency: 'weekly',
            priority: 0.7,
          });
        });

        localUpdates.posts.forEach((post) => {
          if (!post.slug) return;
          addEntry({
            pathname: withLocale(`/updates/${post.slug}`, locale),
            changeFrequency: 'monthly',
            priority: 0.6,
          });
        });
      } catch (error) {
        console.error(`Failed to build local sitemap entries for ${locale}:`, error);
      }
    })
  );

  return entries;
}
