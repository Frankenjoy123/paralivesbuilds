import { ParalivesCreatorHero } from '@/themes/default/blocks/paralives-creator-hero';
import { ParalivesBrowseGrid } from '@/themes/default/blocks/paralives-browse-grid';

export default async function ParalivesCreatorPage({
  creator,
  initialBuilds,
  totalCount,
}: {
  creator: any;
  initialBuilds: any[];
  totalCount: number;
}) {
  return (
    <>
      <ParalivesCreatorHero creator={creator} totalCount={totalCount} />
      <ParalivesBrowseGrid
        initialBuilds={initialBuilds}
        totalCount={totalCount}
        styles={[]}
      />
    </>
  );
}
