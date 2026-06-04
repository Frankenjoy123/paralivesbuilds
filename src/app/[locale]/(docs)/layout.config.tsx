import Image from 'next/image';
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

import { i18n } from '@/core/docs/source';
import { getAppBranding } from '@/shared/lib/branding';
import { getAllConfigs } from '@/shared/models/config';

export async function baseOptions(locale: string): Promise<BaseLayoutProps> {
  const configs = await getAllConfigs();
  const branding = getAppBranding(configs);

  return {
    links: [],
    nav: {
      title: (
        <>
          <Image
            src={branding.logo}
            alt={branding.name}
            width={28}
            height={28}
            className=""
            unoptimized={branding.logo.startsWith('http')}
          />
          <span className="text-primary text-lg font-bold">
            {branding.name}
          </span>
        </>
      ),
      transparentMode: 'top',
    },
    i18n,
  };
}
