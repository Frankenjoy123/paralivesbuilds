import { ParalivesHero } from '@/themes/default/blocks/paralives-hero';
import { ParalivesStyleStrip } from '@/themes/default/blocks/paralives-style-strip';
import { ParalivesHomeGrid } from '@/themes/default/blocks/paralives-home-grid';

export default async function ParalivesHomePage({
  featuredBuilds,
  latestBuilds,
  totalCount,
  styles,
}: {
  featuredBuilds: any[];
  latestBuilds: any[];
  totalCount: number;
  styles: any[];
}) {
  return (
    <>
      <ParalivesHero />
      <ParalivesStyleStrip styles={styles} />
      <ParalivesHomeGrid
        featuredBuilds={featuredBuilds}
        latestBuilds={latestBuilds}
        totalCount={totalCount}
      />
    </>
  );
}
