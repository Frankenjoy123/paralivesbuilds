import { respData, respErr } from '@/shared/lib/resp';
import { getBuilds, getBuildsCount, BuildStatus } from '@/shared/models/build';

export async function POST(req: Request) {
  try {
    const {
      style,
      tag,
      q,
      sort = 'newest',
      page = 1,
      limit = 24,
    } = await req.json();

    const builds = await getBuilds({
      styleSlug: style,
      tagSlug: tag,
      query: q,
      sort,
      status: BuildStatus.PUBLISHED,
      page,
      limit,
    });

    const total = await getBuildsCount({
      styleSlug: style,
      tagSlug: tag,
      query: q,
      status: BuildStatus.PUBLISHED,
    });

    const totalPages = Math.ceil(total / limit);

    return respData({
      data: builds,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (e: any) {
    console.log('get builds list failed:', e);
    return respErr(`get builds list failed: ${e.message}`);
  }
}
