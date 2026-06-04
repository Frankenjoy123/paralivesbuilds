import { respData, respErr } from '@/shared/lib/resp';
import { getFeaturedBuilds } from '@/shared/models/build';

export async function POST(req: Request) {
  try {
    const { limit = 12 } = await req.json();
    const builds = await getFeaturedBuilds(limit);
    return respData({ data: builds });
  } catch (e: any) {
    console.log('get featured builds failed:', e);
    return respErr(`get featured builds failed: ${e.message}`);
  }
}
