import { ParalivesBrowseGrid } from '@/themes/default/blocks/paralives-browse-grid';

export default async function ParalivesBrowsePage({
  initialBuilds,
  totalCount,
  styles,
  currentStyle,
  currentSort,
  currentQuery,
}: {
  initialBuilds: any[];
  totalCount: number;
  styles: any[];
  currentStyle?: string;
  currentSort?: string;
  currentQuery?: string;
}) {
  return (
    <ParalivesBrowseGrid
      initialBuilds={initialBuilds}
      totalCount={totalCount}
      styles={styles}
      currentStyle={currentStyle}
      currentSort={currentSort}
      currentQuery={currentQuery}
    />
  );
}
