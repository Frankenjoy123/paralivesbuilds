import { ParalivesBuildDetail } from '@/themes/default/blocks/paralives-build-detail';

export default async function ParalivesBuildDetailPage({
  build,
  tags,
  relatedBuilds,
}: {
  build: any;
  tags: any[];
  relatedBuilds: any[];
}) {
  return (
    <ParalivesBuildDetail
      build={build}
      tags={tags}
      relatedBuilds={relatedBuilds}
    />
  );
}
