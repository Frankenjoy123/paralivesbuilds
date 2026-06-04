'use client';

import { Link } from '@/core/i18n/navigation';
import { SmartIcon } from '@/shared/blocks/common';
import { Button } from '@/shared/components/ui/button';
import { useSidebar } from '@/shared/components/ui/sidebar';
import { cn } from '@/shared/lib/utils';
import { Button as ButtonType } from '@/shared/types/blocks/common';

export function SidebarButtons({ buttons }: { buttons: ButtonType[] }) {
  return (
    <div className="flex flex-col gap-2 px-3 py-3">
      {buttons.map((button, idx) => (
        <Button
          key={idx}
          asChild
          variant={button.variant || 'outline'}
          size={button.size || 'default'}
          className={cn(
            'group', // Add group for child targeting
            'group-data-[state=collapsed]:h-6 group-data-[state=collapsed]:w-6 group-data-[state=collapsed]:justify-center group-data-[state=collapsed]:p-0 group-data-[state=collapsed]:[&_svg]:size-4 group-data-[state=collapsed]:[&_svg]:shrink-0'
          )}
        >
          <Link
            href={button.url || ''}
            target={button.target || '_self'}
            aria-label={button.title || undefined}
            title={button.title || undefined}
          >
            {button.icon && (
              <SmartIcon
                name={button.icon as string}
                className="size-4 shrink-0"
              />
            )}
            {button.title && (
              <span className={cn("whitespace-nowrap transition-all group-data-[state=collapsed]:hidden")}>
                {button.title}
              </span>
            )}
          </Link>
        </Button>
      ))}
    </div>
  );
}
