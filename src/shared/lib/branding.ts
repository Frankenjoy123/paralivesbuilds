import { envConfigs } from '@/config';

export interface AppBranding {
  name: string;
  logo: string;
}

export function getAppBranding(configs?: Record<string, string>): AppBranding {
  const name = configs?.app_name?.trim() || envConfigs.app_name;
  const logo = configs?.app_logo?.trim() || envConfigs.app_logo || '/logo.png';

  return {
    name,
    logo,
  };
}
