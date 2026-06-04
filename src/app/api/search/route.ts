import { respData, respErr } from '@/shared/lib/resp';
import { searchBuilds, BuildStatus } from '@/shared/models/build';

export async function POST(req: Request) {
  try {
    const { q, limit = 20 } = await req.json();

    if (!q || q.trim().length === 0) {
      return respErr('query is required');
    }

    const builds = await searchBuilds({
      query: q.trim(),
      status: BuildStatus.PUBLISHED,
      limit,
    });

    return respData({ data: builds });
  } catch (e: any) {
    console.log('search builds failed:', e);
    return respErr(`search builds failed: ${e.message}`);
  }
}
