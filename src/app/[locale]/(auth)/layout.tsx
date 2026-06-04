import {
  BrandLogo,
  LocaleSelector,
  ThemeToggler,
} from '@/shared/blocks/common';
import { getAppBranding } from '@/shared/lib/branding';
import { getAllConfigs } from '@/shared/models/config';

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const configs = await getAllConfigs();
  const branding = getAppBranding(configs);

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="absolute top-4 left-4">
        <BrandLogo
          brand={{
            title: branding.name,
            logo: {
              src: branding.logo,
              alt: branding.name,
            },
            url: '/',
            target: '_self',
            className: '',
          }}
        />
      </div>
      <div className="absolute top-4 right-4 flex items-center gap-4">
        <ThemeToggler />
        <LocaleSelector type="button" />
      </div>
      <div className="w-full px-4">{children}</div>
    </div>
  );
}
