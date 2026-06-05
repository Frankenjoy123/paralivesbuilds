import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';

import { routing } from '@/core/i18n/config';
import { ThemeProvider } from '@/core/theme/provider';
import { Toaster } from '@/shared/components/ui/sonner';
import { AppContextProvider } from '@/shared/contexts/app';
import { getMetadata } from '@/shared/lib/seo';
import { getPublicConfigs } from '@/shared/models/config';

export const generateMetadata = getMetadata();

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const initialConfigs = await getPublicConfigs();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ParalivesBuilds',
    url: 'https://paralivesbuilds.com',
    logo: 'https://paralivesbuilds.com/favicon-32x32.png',
    sameAs: [],
  };

  return (
    <html lang={locale}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="overflow-x-hidden">
        <NextIntlClientProvider>
          <ThemeProvider>
            <AppContextProvider initialConfigs={initialConfigs}>
              {children}
              <Toaster position="top-center" richColors />
            </AppContextProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
