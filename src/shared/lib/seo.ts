import { getTranslations, setRequestLocale } from 'next-intl/server';

import { envConfigs } from '@/config';
import { defaultLocale, locales } from '@/config/locale';

const openGraphLocaleMap: Record<string, string> = {
  en: 'en_US',
  zh: 'zh_CN',
};

function normalizePath(path: string) {
  if (!path) return '/';
  if (path.startsWith('http')) return path;
  return path.startsWith('/') ? path : `/${path}`;
}

function fixLocalhostUrl(url: string) {
  if (url.includes('localhost:3000')) {
    return url.replace('http://localhost:3000', 'https://paralivesbuilds.com').replace('https://localhost:3000', 'https://paralivesbuilds.com');
  }
  return url;
}

export function getOpenGraphLocale(locale: string) {
  return openGraphLocaleMap[locale] || locale;
}

export function buildCanonicalUrl(canonicalUrl: string, locale: string) {
  const normalized = normalizePath(canonicalUrl);
  if (normalized.startsWith('http')) {
    return fixLocalhostUrl(normalized);
  }

  let absoluteUrl = `${fixLocalhostUrl(envConfigs.app_url)}${
    !locale || locale === defaultLocale ? '' : `/${locale}`
  }${normalized}`;

  if (locale !== defaultLocale && absoluteUrl.endsWith('/')) {
    absoluteUrl = absoluteUrl.slice(0, -1);
  }

  return absoluteUrl;
}

export function getLanguageAlternates(canonicalUrl: string) {
  const normalized = normalizePath(canonicalUrl);
  const languages: Record<string, string> = {};

  locales.forEach((locale) => {
    languages[locale] = buildCanonicalUrl(normalized, locale);
  });
  languages['x-default'] = buildCanonicalUrl(normalized, defaultLocale);

  return languages;
}

// get metadata for page component
export function getMetadata(
  options: {
    title?: string;
    description?: string;
    keywords?: string;
    metadataKey?: string;
    canonicalUrl?: string; // relative path or full url
    imageUrl?: string;
    appName?: string;
    noIndex?: boolean;
  } = {}
) {
  return async function generateMetadata({
    params,
  }: {
    params: Promise<{ locale: string }>;
  }) {
    const { locale } = await params;
    setRequestLocale(locale);

    // passed metadata
    const passedMetadata = {
      title: options.title,
      description: options.description,
      keywords: options.keywords,
    };

    // default metadata
    const defaultMetadata = await getTranslatedMetadata(
      defaultMetadataKey,
      locale
    );

    // translated metadata
    let translatedMetadata: any = {};
    if (options.metadataKey) {
      translatedMetadata = await getTranslatedMetadata(
        options.metadataKey,
        locale
      );
    }

    // canonical url
    const canonicalUrl = buildCanonicalUrl(
      options.canonicalUrl || '/',
      locale || ''
    );
    const languageAlternates = getLanguageAlternates(
      options.canonicalUrl || '/'
    );

    const title =
      passedMetadata.title || translatedMetadata.title || defaultMetadata.title;
    const description =
      passedMetadata.description ||
      translatedMetadata.description ||
      defaultMetadata.description;

    // image url
    let imageUrl = options.imageUrl || envConfigs.app_preview_image;
    if (imageUrl.startsWith('http')) {
      imageUrl = fixLocalhostUrl(imageUrl);
    } else {
      imageUrl = fixLocalhostUrl(`${envConfigs.app_url}${imageUrl}`);
    }

    // app name
    let appName = options.appName;
    if (!appName) {
      appName = envConfigs.app_name || '';
    }

    return {
      title:
        passedMetadata.title ||
        translatedMetadata.title ||
        defaultMetadata.title,
      description:
        passedMetadata.description ||
        translatedMetadata.description ||
        defaultMetadata.description,
      keywords:
        passedMetadata.keywords ||
        translatedMetadata.keywords ||
        defaultMetadata.keywords,
      alternates: {
        canonical: canonicalUrl,
        languages: languageAlternates,
      },

      openGraph: {
        type: 'website',
        locale: getOpenGraphLocale(locale),
        alternateLocale: locales
          .filter((loc) => loc !== locale)
          .map((loc) => getOpenGraphLocale(loc)),
        url: canonicalUrl,
        title,
        description,
        siteName: appName,
        images: [imageUrl.toString()],
      },

      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [imageUrl.toString()],
        site: fixLocalhostUrl(envConfigs.app_url),
      },

      robots: {
        index: options.noIndex ? false : true,
        follow: options.noIndex ? false : true,
      },

      icons: {
        icon: [
          { url: '/favicon.ico', sizes: '32x32' },
          { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        ],
        apple: [
          { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
        ],
      },
    };
  };
}

const defaultMetadataKey = 'common.metadata';

async function getTranslatedMetadata(metadataKey: string, locale: string) {
  setRequestLocale(locale);
  const t = await getTranslations(metadataKey);

  return {
    title: t.has('title') ? t('title') : '',
    description: t.has('description') ? t('description') : '',
    keywords: t.has('keywords') ? t('keywords') : '',
  };
}
