import { respData, respErr } from '@/shared/lib/resp';
import { findCreator } from '@/shared/models/creator';
import { getBuilds, getBuildsCount, BuildStatus } from '@/shared/models/build';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const creator = await findCreator({ slug });
    if (!creator) {
      return respErr('creator not found');
    }

    const builds = await getBuilds({
      creatorId: creator.id,
      status: BuildStatus.PUBLISHED,
      limit: 24,
      page: 1,
    });

    const total = await getBuildsCount({
      creatorId: creator.id,
      status: BuildStatus.PUBLISHED,
    });

    return respData({
      creator,
      builds,
      total,
    });
  } catch (e: any) {
    console.log('get creator detail failed:', e);
    return respErr(`get creator detail failed: ${e.message}`);
  }
}
