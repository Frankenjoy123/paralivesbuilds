import { ParalivesStyleHero } from '@/themes/default/blocks/paralives-style-hero';
import { ParalivesBrowseGrid } from '@/themes/default/blocks/paralives-browse-grid';

export default async function ParalivesStylePage({
  style,
  initialBuilds,
  totalCount,
}: {
  style: any;
  initialBuilds: any[];
  totalCount: number;
}) {
  return (
    <>
      <ParalivesStyleHero style={style} totalCount={totalCount} />
      <ParalivesBrowseGrid
        initialBuilds={initialBuilds}
        totalCount={totalCount}
        styles={[]}
      />
    </>
  );
}
