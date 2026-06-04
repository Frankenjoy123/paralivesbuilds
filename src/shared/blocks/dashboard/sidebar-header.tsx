import { Link } from '@/core/i18n/navigation';
import { LazyImage } from '@/shared/blocks/common';
import { Badge } from '@/shared/components/ui/badge';
import {
  SidebarHeader as SidebarHeaderComponent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from '@/shared/components/ui/sidebar';
import { cn } from '@/shared/lib/utils';
import { SidebarHeader as SidebarHeaderType } from '@/shared/types/blocks/dashboard';

export function SidebarHeader({ header }: { header: SidebarHeaderType }) {
  return (
    <SidebarHeaderComponent className="mb-0">
      <SidebarMenu>
        <SidebarMenuItem className="flex items-center justify-between">
          <SidebarMenuButton
            asChild
            className={cn(
              'data-[slot=sidebar-menu-button]:!p-1.5',
              header.show_trigger && 'group-data-[state=collapsed]:hidden'
            )}
          >
            {header.brand && (
              <Link href={header.brand.url || ''}>
                {header.brand.logo && (
                  <LazyImage
                    src={header.brand.logo.src}
                    alt={header.brand.logo.alt || ''}
                    className="h-auto w-8 shrink-0 rounded-md"
                  />
                )}
                <div className="relative text-base font-semibold">
                  {header.brand.title}
                  {header.version && (
                    <Badge
                      variant="secondary"
                      className="absolute -top-0 -right-16 scale-100 px-1 py-0"
                    >
                      v{header.version}
                    </Badge>
                  )}
                </div>
              </Link>
            )}
          </SidebarMenuButton>
          <div className="flex-1"></div>
          {header.show_trigger && <SidebarTrigger />}
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeaderComponent>
  );
}
