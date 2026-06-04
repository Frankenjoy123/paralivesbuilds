import { respData, respErr } from '@/shared/lib/resp';
import { findStyle } from '@/shared/models/style';
import { getBuilds, getBuildsCount, BuildStatus } from '@/shared/models/build';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const style = await findStyle({ slug });
    if (!style) {
      return respErr('style not found');
    }

    const builds = await getBuilds({
      styleId: style.id,
      status: BuildStatus.PUBLISHED,
      limit: 24,
      page: 1,
    });

    const total = await getBuildsCount({
      styleId: style.id,
      status: BuildStatus.PUBLISHED,
    });

    return respData({
      style,
      builds,
      total,
    });
  } catch (e: any) {
    console.log('get style detail failed:', e);
    return respErr(`get style detail failed: ${e.message}`);
  }
}
